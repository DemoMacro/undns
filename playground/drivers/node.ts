import { createDNSManager } from "../../packages/undns/src/dns";
import nodeDriver from "../../packages/undns/src/drivers/node";
import type { DNSRecord } from "../../packages/undns/src/types";

// Type guard functions
function isARecord(
  record: DNSRecord,
): record is { type: "A"; address: string; ttl: number } {
  return record.type === "A";
}

function isAaaaRecord(
  record: DNSRecord,
): record is { type: "AAAA"; address: string; ttl: number } {
  return record.type === "AAAA";
}

function isMxRecord(
  record: DNSRecord,
): record is { type: "MX"; priority: number; exchange: string } {
  return record.type === "MX";
}

function isTxtRecord(
  record: DNSRecord,
): record is { type: "TXT"; entries: string[] } {
  return record.type === "TXT";
}

function isNsRecord(
  record: DNSRecord,
): record is { type: "NS"; value: string } {
  return record.type === "NS";
}

function isCnameRecord(
  record: DNSRecord,
): record is { type: "CNAME"; value: string } {
  return record.type === "CNAME";
}

function isSoaRecord(record: DNSRecord): record is {
  type: "SOA";
  nsname: string;
  hostmaster: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
} {
  return record.type === "SOA";
}

function isSrvRecord(record: DNSRecord): record is {
  type: "SRV";
  priority: number;
  weight: number;
  port: number;
  name: string;
} {
  return record.type === "SRV";
}

function isCaaRecord(record: DNSRecord): record is {
  type: "CAA";
  critical: number;
  issue?: string;
  iodef?: string;
} {
  return record.type === "CAA";
}

function isPtrRecord(
  record: DNSRecord,
): record is { type: "PTR"; value: string } {
  return record.type === "PTR";
}

function isNaptrRecord(record: DNSRecord): record is {
  type: "NAPTR";
  order: number;
  preference: number;
  flags: string;
  service: string;
  regexp: string;
  replacement: string;
} {
  return record.type === "NAPTR";
}

// Create DNS manager with Node.js driver
const dns = createDNSManager({
  driver: nodeDriver({
    servers: ["8.8.8.8", "1.1.1.1"], // Use Google and Cloudflare DNS
  }),
});

async function testNodeDriver() {
  console.log("Testing Node.js DNS driver...\n");

  try {
    // Test with dns-oarc.net (has comprehensive DNS records)
    const testDomain = "dns-oarc.net";

    // Test all records
    console.log(`All records for ${testDomain}:`);
    const allRecords = await dns.getRecords(testDomain);

    // allRecords is now DNSRecord[] - array of standardized record objects
    console.log(`  Total records: ${allRecords.length}`);

    // Group and display records by type
    const recordTypes = [...new Set(allRecords.map((r) => r.type))];
    recordTypes.forEach((type) => {
      const records = allRecords.filter((r) => r.type === type);
      console.log(`\n${type} records (${records.length}):`);
      records.forEach((record) => {
        switch (type) {
          case "A":
            if (isARecord(record)) {
              console.log(
                `  ${record.address}${record.ttl ? ` (TTL: ${record.ttl})` : ""}`,
              );
            }
            break;
          case "AAAA":
            if (isAaaaRecord(record)) {
              console.log(
                `  ${record.address}${record.ttl ? ` (TTL: ${record.ttl})` : ""}`,
              );
            }
            break;
          case "MX":
            if (isMxRecord(record)) {
              console.log(`  ${record.priority} ${record.exchange}`);
            }
            break;
          case "TXT":
            if (isTxtRecord(record)) {
              console.log(`  ${record.entries?.join("") || ""}`);
            }
            break;
          case "NS":
            if (isNsRecord(record)) {
              console.log(`  ${record.value}`);
            }
            break;
          case "CNAME":
            if (isCnameRecord(record)) {
              console.log(`  ${record.value}`);
            }
            break;
          case "SOA":
            if (isSoaRecord(record)) {
              console.log(
                `  ${record.nsname} ${record.hostmaster} (serial: ${record.serial})`,
              );
            }
            break;
          case "SRV":
            if (isSrvRecord(record)) {
              console.log(
                `  ${record.priority} ${record.weight} ${record.port} ${record.name}`,
              );
            }
            break;
          case "CAA":
            if (isCaaRecord(record)) {
              console.log(
                `  ${record.critical ? "[critical] " : ""}${record.issue || record.iodef}`,
              );
            }
            break;
          case "PTR":
            if (isPtrRecord(record)) {
              console.log(`  ${record.value}`);
            }
            break;
          case "NAPTR":
            if (isNaptrRecord(record)) {
              console.log(
                `  ${record.order} ${record.preference} "${record.flags}" "${record.service}" "${record.regexp}" ${record.replacement}`,
              );
            }
            break;
          default:
            console.log(`  ${JSON.stringify(record)}`);
        }
      });
    });

    // Test hasRecord method
    console.log(`\nRecord existence checks for ${testDomain}:`);
    console.log(
      `  Has A records? ${await dns.hasRecord(testDomain, { type: "A" })}`,
    );
    console.log(
      `  Has MX records? ${await dns.hasRecord(testDomain, { type: "MX" })}`,
    );
    console.log(
      `  Has TXT records? ${await dns.hasRecord(testDomain, { type: "TXT" })}`,
    );

    // Test write operations (should fail - read-only driver)
    console.log("\nWrite operations (expected to fail):");
    try {
      await dns.setRecord(testDomain, {
        name: testDomain,
        type: "A",
        address: "192.168.1.1",
      });
    } catch (error) {
      console.log(`  setRecord: ${(error as Error).message}`);
    }

    try {
      await dns.removeRecord(testDomain, null as any);
    } catch (error) {
      console.log(`  removeRecord: ${(error as Error).message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
testNodeDriver().catch(console.error);
