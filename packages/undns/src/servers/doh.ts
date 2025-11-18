/**
 * DNS over HTTPS (DoH) Server
 * RFC 8484 compliant DoH server implementation using h3 and undns
 * @see https://www.rfc-editor.org/rfc/rfc8484
 */

import {
  defineHandler,
  EventHandlerRequest,
  EventHandlerWithFetch,
  H3,
  serve,
} from "h3";
import { HTTPError } from "h3";
import type { Driver, DNSRecord, DOHResponse } from "../types";
import { createDNSManager } from "../dns";
import type { AnyRecord } from "node:dns";

// DNS type mapping: string to number
const DNS_TYPE_NUMBERS: Record<string, number> = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  NS: 2,
  SOA: 6,
  SRV: 33,
  PTR: 12,
  CAA: 257,
  ANY: 255,
};

const SupportedMethods = ["GET", "HEAD"];

export interface DohServerOptions {
  /**
   * DNS driver to use for queries (from undns)
   */
  driver?: Driver;

  /**
   * Authorization function for requests
   */
  authorize?: (request: any) => void | Promise<void>;
}

export type FetchHandler = (
  req: globalThis.Request,
) => globalThis.Response | Promise<globalThis.Response>;

/**
 * Create a DNS over HTTPS (DoH) handler
 *
 * Supports Google/Cloudflare JSON API format:
 * - GET requests with query parameters: name, type, do, cd
 * - Accept: application/dns-json
 *
 * @param options DoH server configuration options
 * @returns A h3 event handler
 */
export function createDohHandler(
  opts: DohServerOptions = {},
): EventHandlerWithFetch<EventHandlerRequest, Promise<DOHResponse | string>> {
  const dnsManager = createDNSManager({
    driver: opts.driver || { name: "default" },
  });

  const handler = defineHandler(async (event) => {
    // Validate method
    if (!SupportedMethods.includes(event.req.method)) {
      throw new HTTPError({
        statusCode: 405,
        statusMessage: `Method Not Allowed: ${event.req.method}`,
      });
    }

    // Parse query parameters
    const url = new URL(event.req.url || "");
    const query = Object.fromEntries(url.searchParams.entries());

    // Validate required parameters
    const name = query.name;
    const type = (query.type || "A").toUpperCase();

    if (!name) {
      throw new HTTPError({
        statusCode: 400,
        statusMessage: "Missing required parameter: name",
      });
    }

    if (!DNS_TYPE_NUMBERS[type]) {
      throw new HTTPError({
        statusCode: 400,
        statusMessage: `Invalid DNS record type: ${type}`,
      });
    }

    // Authorize request
    await opts.authorize?.({ name, type });

    // Set headers
    event.res.headers.set("Content-Type", "application/dns-json");
    event.res.headers.set("Access-Control-Allow-Origin", "*");

    // Handle HEAD
    if (event.req.method === "HEAD") {
      return "";
    }

    // Perform DNS query
    const records = await dnsManager.getRecords(name, { type });

    // Build DoH response
    const response: DOHResponse = {
      Status: 0, // NOERROR
      TC: false,
      RD: true,
      RA: true,
      AD: false,
      CD: query.cd === "1" || query.cd === "true",
      Question: [
        {
          name: name.endsWith(".") ? name : `${name}.`,
          type: DNS_TYPE_NUMBERS[type],
        },
      ],
      Answer: records.map((record) => convertDNSRecordToDoHAnswer(record)),
    };

    return JSON.stringify(response, null, 2);
  });

  return handler;
}

/**
 * Create a complete DoH server
 */
export function createDohServer(opts: DohServerOptions = {}): {
  handler: EventHandlerWithFetch<
    EventHandlerRequest,
    Promise<DOHResponse | string>
  >;
  serve: (port?: number) => void;
} {
  const handler = createDohHandler(opts);
  const app = new H3().use("/**", handler);

  return {
    handler,
    serve: (port = 8080) => serve(app, { port }),
  };
}

/**
 * Convert DNS record to DoH answer format
 */
function convertDNSRecordToDoHAnswer(record: DNSRecord): {
  name: string;
  type: number;
  TTL: number;
  data: string;
} {
  const type = DNS_TYPE_NUMBERS[record.type] || 1;
  const answer: { name: string; type: number; TTL: number; data: string } = {
    name: "",
    type,
    TTL: 300,
    data: "",
  };

  const typedRecord = record as AnyRecord;

  switch (record.type) {
    case "A":
    case "AAAA":
      if (typedRecord.type === "A" || typedRecord.type === "AAAA") {
        answer.data = typedRecord.address;
      }
      break;
    case "CNAME":
    case "NS":
    case "PTR":
      if (
        typedRecord.type === "CNAME" ||
        typedRecord.type === "NS" ||
        typedRecord.type === "PTR"
      ) {
        answer.data = typedRecord.value;
      }
      break;
    case "MX":
      if (typedRecord.type === "MX") {
        answer.data = `${typedRecord.priority} ${typedRecord.exchange}`;
      }
      break;
    case "TXT":
      if (typedRecord.type === "TXT") {
        const entries = typedRecord.entries || [];
        answer.data = entries.length > 0 ? entries.join("") : "";
      }
      break;
    case "SRV":
      if (typedRecord.type === "SRV") {
        answer.data = `${typedRecord.priority} ${typedRecord.weight} ${typedRecord.port} ${typedRecord.name}`;
      }
      break;
    case "SOA":
      if (typedRecord.type === "SOA") {
        answer.data = `${typedRecord.nsname} ${typedRecord.hostmaster} ${typedRecord.serial} ${typedRecord.refresh} ${typedRecord.retry} ${typedRecord.expire} ${typedRecord.minttl}`;
      }
      break;
    case "CAA":
      if (typedRecord.type === "CAA") {
        const critical = typedRecord.critical || 0;
        const tag = typedRecord.issue
          ? "issue"
          : typedRecord.iodef
            ? "iodef"
            : "unknown";
        const value = typedRecord.issue || typedRecord.iodef || "";
        answer.data = `${critical} ${tag} "${value}"`;
      }
      break;
    default:
      // For unknown record types, try to serialize the record
      answer.data = JSON.stringify(typedRecord);
  }

  return answer;
}
