# Delirium Proxmox Library

This is a Node.js library for interacting with the Proxmox API. It provides a simple and lightweight wrapper around the Proxmox API, making it easier to manage your Proxmox virtual environments from a Node.js application.

## Features

- Authentication with Proxmox server
- Fetching nodes, storages, networks, and CPU information
- Creating and configuring virtual machines
- Resizing virtual machine disks
- Fetching Proxmox server version

## Installation

To install the Delirium Proxmox Library, use the following command in your Node.js project:

```bash
npm install delirium-proxmox
```

## Usage

First, import the necessary services from the library:

```typescript
import { DeliriumClient } from 'delirium-proxmox';
```

Then, create an instance of the \`ProxmoxService\` and use its methods to interact with the Proxmox API:

```typescript
const proxmoxService = new ProxmoxService();
// Use the service...
```

## Peer Dependencies

This library has the following peer dependencies, which should be installed in your project:

- \`@nestjs/axios\`
- \`@nestjs/common\`
- \`@nestjs/core\`
- \`@nestjs/platform-express\`
- \`axios\`
- \`reflect-metadata\`
- \`rxjs\`
- \`tough-cookie\`

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Author

- Álvaro Diago de Aguilar - [GitHub](https://github.com/n01rdev)

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on GitHub.