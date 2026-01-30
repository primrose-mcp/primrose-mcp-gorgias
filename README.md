# Gorgias MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/gorgias)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for Gorgias, enabling AI assistants to manage customer support tickets, automate responses, and handle e-commerce helpdesk operations.

## Features

- **Account** - Account information and settings
- **Custom Fields** - Custom field management
- **Customers** - Customer profile management
- **Events** - Event tracking
- **Integrations** - Third-party integrations
- **Jobs** - Background job management
- **Macros** - Response automation templates
- **Messages** - Ticket message management
- **Rules** - Automation rule configuration
- **Satisfaction** - Customer satisfaction surveys
- **Tags** - Ticket tagging system
- **Teams** - Team management
- **Tickets** - Support ticket operations
- **Users** - Agent and user management
- **Views** - Custom ticket views
- **Widgets** - Chat widget configuration

## Quick Start

The recommended way to use this MCP server is through the Primrose SDK:

```bash
npm install primrose-mcp
```

```typescript
import { PrimroseMCP } from 'primrose-mcp';

const primrose = new PrimroseMCP({
  service: 'gorgias',
  headers: {
    'X-Gorgias-Domain': 'your-subdomain',
    'X-Gorgias-Email': 'your-email@example.com',
    'X-Gorgias-API-Key': 'your-api-key'
  }
});
```

## Manual Installation

If you prefer to run the MCP server directly:

```bash
# Clone the repository
git clone https://github.com/primrose-ai/primrose-mcp-gorgias.git
cd primrose-mcp-gorgias

# Install dependencies
npm install

# Run locally
npm run dev
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Gorgias-Domain` | Your Gorgias subdomain (e.g., "mycompany" for mycompany.gorgias.com) |
| `X-Gorgias-Email` | Your Gorgias account email |
| `X-Gorgias-API-Key` | Your Gorgias API key |

## Available Tools

### Account Tools
- Get account information
- Update account settings

### Custom Field Tools
- Create custom fields
- Update custom fields
- Delete custom fields
- List custom fields

### Customer Tools
- List customers
- Create customers
- Update customer profiles
- Merge customers
- Customer search

### Event Tools
- List events
- Create events
- Event filtering

### Integration Tools
- List integrations
- Integration configuration

### Job Tools
- List background jobs
- Job status tracking

### Macro Tools
- Create macros
- Update macros
- Delete macros
- List macros
- Apply macros to tickets

### Message Tools
- List messages
- Create messages
- Update messages
- Delete messages

### Rule Tools
- Create automation rules
- Update rules
- Delete rules
- List rules
- Rule conditions and actions

### Satisfaction Tools
- Get satisfaction ratings
- Satisfaction survey management

### Tag Tools
- Create tags
- Update tags
- Delete tags
- List tags

### Team Tools
- List teams
- Create teams
- Update teams
- Team member management

### Ticket Tools
- List tickets
- Create tickets
- Update tickets
- Close/reopen tickets
- Assign tickets
- Ticket merging

### User Tools
- List users/agents
- Create users
- Update users
- User permissions

### View Tools
- Create views
- Update views
- Delete views
- List views

### Widget Tools
- Widget configuration
- Chat widget settings

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Related Resources

- [Primrose SDK Documentation](https://primrose.dev/docs)
- [Gorgias API Documentation](https://developers.gorgias.com/)
- [Gorgias Help Center](https://help.gorgias.com/)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT
