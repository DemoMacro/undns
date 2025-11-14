# UnDns

![GitHub](https://img.shields.io/github/license/DemoMacro/undns)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

> Unified DNS management library for multi-provider DNS operations

## Packages

This is a monorepo that contains the following packages:

- **[undns](./packages/undns/README.md)** - Core DNS management library with unified API

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/DemoMacro/undns.git
cd undns

# Install dependencies
pnpm install
```

### Basic Usage

```typescript
import { createDNSManager } from "undns";
import nodeDriver from "undns/drivers/node";

// Create DNS manager with Node.js driver
const dns = createDNSManager({
  driver: nodeDriver({
    servers: ["8.8.8.8", "1.1.1.1"],
  }),
});

// Query DNS records
const records = await dns.getRecords("example.com");
console.log(`Found ${records.length} records`);

// Check for specific record type
const hasMxRecord = await dns.hasRecord("example.com", { type: "MX" });
console.log("Has MX record:", hasMxRecord);
```

### Development

```bash
# Development mode
pnpm dev

# Build the project
pnpm build

# Run linting
pnpm lint

# Test the implementation
bun playground/drivers/node.ts
```

## Project Structure

```
undns/
├── packages/
│   └── undns/                 # Core library
│       ├── src/
│       │   ├── dns.ts         # DNS manager implementation
│       │   ├── types.ts       # Type definitions
│       │   └── drivers/       # DNS provider drivers
│       │       └── node.ts    # Node.js DNS driver
│       └── dist/              # Built files
├── playground/
│   └── drivers/
│       └── node.ts            # Test examples
└── README.md                  # This file
```

## Contributing

We welcome contributions! Here's how to get started:

### Quick Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/undns.git
   cd undns
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/DemoMacro/undns.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Development mode**:

   ```bash
   pnpm dev
   ```

### Development Workflow

1. **Code**: Follow our project standards
2. **Test**: `pnpm build && <test your provider>`
3. **Commit**: Use conventional commits (`feat:`, `fix:`, etc.)
4. **Push**: Push to your fork
5. **Submit**: Create a Pull Request to upstream repository

## Support & Community

- 📫 [Report Issues](https://github.com/DemoMacro/undns/issues)
- 📚 [Package Documentation](./packages/undns/README.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by [Demo Macro](https://imst.xyz/)
