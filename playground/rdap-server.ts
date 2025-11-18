/**
 * RDAP Server Example
 */

import { createRdapServer } from "rdap/server";

console.log("🌐 RDAP Server Example\n");

// Basic RDAP server - uses bootstrap to find authoritative servers
const server = createRdapServer();

server.serve(8080);
