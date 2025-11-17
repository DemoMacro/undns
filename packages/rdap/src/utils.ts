/**
 * RDAP Utility Functions
 */

import type { RdapQueryType, RdapBootstrapType } from "./types";

/**
 * Convert domain name to ASCII format (Punycode)
 */
export function convertToAscii(domain: string): string {
  try {
    return new URL(`http://${domain}`).hostname;
  } catch {
    return domain;
  }
}

/**
 * Convert bootstrap type to query type
 */
export function bootstrapTypeToQueryType(
  type: RdapBootstrapType,
): RdapQueryType {
  switch (type) {
    case "asn":
      return "autnum";
    case "dns":
      return "domain";
    case "ipv4":
    case "ipv6":
      return "ip";
    case "object-tags":
      return "entity";
    default:
      throw new Error(`Invalid bootstrap type: ${String(type)}`);
  }
}

/**
 * Check if a string is a valid ASN
 */
export function isAsn(value: string): boolean {
  return /^AS\d+$/i.test(value) || /^\d+$/.test(value);
}

/**
 * Format ASN number
 */
export function formatAsn(value: string): string {
  if (/^AS\d+$/i.test(value)) {
    return value.slice(2);
  }
  return value;
}

/**
 * Check if a string is a valid domain name
 */
export function isDomain(value: string): boolean {
  try {
    new URL(`http://${value}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get query type from query string
 */
export function getQueryType(query: string): RdapQueryType {
  // Import from ipdo to avoid duplication
  const { isValidIP } = require("ipdo");

  if (isValidIP(query)) {
    return "ip";
  }
  if (isAsn(query)) {
    return "autnum";
  }
  if (isDomain(query)) {
    return "domain";
  }
  return "entity";
}

/**
 * Get bootstrap type from query string
 */
export function getBootstrapType(query: string): RdapBootstrapType {
  // Import from ipdo to avoid duplication
  const { isIPv4, isIPv6 } = require("ipdo");

  if (isIPv4(query)) {
    return "ipv4";
  }
  if (isIPv6(query)) {
    return "ipv6";
  }
  if (isAsn(query)) {
    return "asn";
  }
  if (isDomain(query)) {
    return "dns";
  }
  return "object-tags";
}
