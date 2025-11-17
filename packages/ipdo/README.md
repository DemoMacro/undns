# ipdo 🔍

A powerful and efficient IP address manipulation library.

## ✨ Features

- 🌐 Complete IP address manipulation
  - 📍 IPv4 and IPv6 support
  - 🔢 CIDR range operations
  - ✅ IP address validation
  - 🎯 Network mask calculations
  - 🔄 Binary and numeric conversions
  - 🏷️ IP address type detection (private, loopback, multicast)
  - ➕ IP address arithmetic
- 🚀 Zero dependencies
- 📝 TypeScript support
- 🛡️ Comprehensive error handling
- ⚡️ High performance bitwise operations
- 📦 Modern ESM and CJS support

## 📥 Installation

```bash
# Using npm
npm install ipdo

# Using yarn
yarn add ipdo

# Using pnpm
pnpm add ipdo
```

## 🚀 Basic Usage

```typescript
import {
  isIPv4,
  isIPv6,
  isValidIP,
  isPrivateIPv4,
  nextIPv4,
  parseCIDR,
  ipInRange,
  firstIPInRange,
  lastIPInRange,
  maskForCIDR,
  rangeSize,
} from "ipdo";

// IP address validation
console.log(isValidIP("192.168.0.1")); // true
console.log(isValidIP("not an ip")); // false
console.log(isIPv4("192.168.0.1")); // true
console.log(isIPv6("2001:db8::")); // true

// IP address type checks
console.log(isPrivateIPv4("192.168.0.1")); // true
console.log(isPrivateIPv4("8.8.8.8")); // false

// IP address arithmetic
console.log(nextIPv4("192.168.0.1")); // '192.168.0.2'
console.log(prevIPv4("192.168.0.1")); // '192.168.0.0'

// CIDR range operations
const range = parseCIDR("192.168.0.0/24");
console.log(ipInRange("192.168.0.0/24", "192.168.0.1")); // true
console.log(ipInRange("192.168.0.0/24", "192.168.1.1")); // false
console.log(firstIPInRange("192.168.0.0/24")); // '192.168.0.0'
console.log(lastIPInRange("192.168.0.0/24")); // '192.168.0.255'
console.log(maskForCIDR("192.168.0.0/24")); // '255.255.255.0'
console.log(rangeSize("192.168.0.0/24")); // 256
```

## 🔧 Advanced Usage

### 🌐 IPv6 Operations

```typescript
import {
  isIPv6,
  isPrivateIPv6,
  nextIPv6,
  parseCIDR,
  ipInRange,
  firstIPInRange,
  lastIPInRange,
  rangesOverlap,
} from "ipdo";

console.log(ipInRange("2001:db8::/32", "2001:db8::1")); // true
console.log(ipInRange("2001:db8::/32", "2001:db9::1")); // false
console.log(firstIPInRange("2001:db8::/32")); // '2001:db8:0000:0000:0000:0000:0000:0000'
console.log(lastIPInRange("2001:db8::/32")); // '2001:db8:ffff:ffff:ffff:ffff:ffff:ffff'
console.log(isPrivateIPv6("fc00::1")); // true
console.log(nextIPv6("2001:db8::")); // '2001:db8::1'
```

### 🔄 Range Overlap Checking

```typescript
import { rangesOverlap } from "ipdo";

console.log(rangesOverlap("192.168.0.0/24", "192.168.0.128/25")); // true
console.log(rangesOverlap("192.168.0.0/24", "10.0.0.0/24")); // false
```

### 🔄 Binary and Numeric Conversions

```typescript
import {
  ipv4ToInt,
  intToIPv4,
  ipv6ToBigInt,
  bigIntToIPv6,
  toBinary,
  toNumber,
} from "ipdo";

// IPv4 conversions
console.log(ipv4ToInt("192.168.0.1")); // 3232235521
console.log(intToIPv4(3232235521)); // '192.168.0.1'

// IPv6 conversions
console.log(ipv6ToBigInt("2001:db8::")); // 42540766452641154071740215577757643584n
console.log(bigIntToIPv6(42540766452641154071740215577757643584n)); // '2001:db8::'

// Generic conversions
console.log(toBinary("192.168.0.1")); // '11000000101010000000000000000001'
console.log(toNumber("192.168.0.1")); // 3232235521
```

## 📚 API Reference

### 🔍 IP Address Validation

#### `isIPv4(ip: string): boolean`

Check if a string is a valid IPv4 address.

#### `isIPv6(ip: string): boolean`

Check if a string is a valid IPv6 address.

#### `isValidIP(ip: string): boolean`

Check if a string is a valid IP address (IPv4 or IPv6).

### 🔄 IP Address Conversions

#### `ipv4ToInt(ip: string): number`

Convert IPv4 address to 32-bit number.

#### `intToIPv4(int: number): string`

Convert number to IPv4 address.

#### `ipv6ToBigInt(ip: string): bigint`

Convert IPv6 address to BigInt.

#### `bigIntToIPv6(int: bigint): string`

Convert BigInt to IPv6 address.

#### `toBinary(ip: string): string`

Convert IP address to binary string.

#### `toNumber(ip: string): number | bigint`

Convert IP address to numeric value.

### 🏷️ IP Address Type Detection

#### `isPrivateIPv4(ip: string | number): boolean`

Check if IPv4 address is private.

#### `isLoopbackIPv4(ip: string | number): boolean`

Check if IPv4 address is loopback.

#### `isMulticastIPv4(ip: string | number): boolean`

Check if IPv4 address is multicast.

#### `isPrivateIPv6(ip: string | bigint): boolean`

Check if IPv6 address is private.

#### `isLoopbackIPv6(ip: string | bigint): boolean`

Check if IPv6 address is loopback.

#### `isMulticastIPv6(ip: string | bigint): boolean`

Check if IPv6 address is multicast.

### ➕ IP Address Arithmetic

#### `nextIPv4(ip: string | number): string`

Get next IPv4 address.

#### `prevIPv4(ip: string | number): string`

Get previous IPv4 address.

#### `nextIPv6(ip: string | bigint): string`

Get next IPv6 address.

#### `prevIPv6(ip: string | bigint): string`

Get previous IPv6 address.

### 🌐 CIDR Range Operations

#### `parseCIDR(cidr: string): object`

Parse CIDR notation to range information.

#### `ipInRange(cidr: string, ip: string): boolean`

Check if IP address is in CIDR range.

#### `firstIPInRange(cidr: string): string`

Get first IP address in CIDR range.

#### `lastIPInRange(cidr: string): string`

Get last IP address in CIDR range.

#### `maskForCIDR(cidr: string): string`

Get network mask for CIDR.

#### `rangeSize(cidr: string): number | bigint`

Get total number of addresses in CIDR range.

#### `rangesOverlap(cidr1: string, cidr2: string): boolean`

Check if two CIDR ranges overlap.

## ⚠️ Error Handling

The library throws descriptive errors for:

- 🚫 Invalid IP address format
- 📏 Invalid prefix length (must be 0-32 for IPv4, 0-128 for IPv6)
- ❌ Mismatched IP version
- 🚫 Invalid CIDR notation

## 📄 License

[MIT](../../LICENSE) © [Demo Macro](https://imst.xyz/)
