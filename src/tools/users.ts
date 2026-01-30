/**
 * User Tools
 *
 * MCP tools for Gorgias user (agent) management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all user-related tools
 */
export function registerUserTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Users
  // ===========================================================================
  server.tool(
    'gorgias_list_users',
    `List users (agents) from Gorgias with pagination.

Returns a paginated list of users/agents. Use the cursor from the response to fetch the next page.

Args:
  - limit: Number of users to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: User[], nextCursor }
  Markdown format: Formatted table of users`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of users to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, format }) => {
      try {
        const result = await client.listUsers({ limit, cursor });
        return formatResponse(result, format, 'users');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get User
  // ===========================================================================
  server.tool(
    'gorgias_get_user',
    `Get a single user (agent) by ID.

Args:
  - id: The user ID
  - format: Response format ('json' or 'markdown')

Returns:
  The user record with all available fields.`,
    {
      id: z.number().int().describe('User ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const user = await client.getUser(id);
        return formatResponse(user, format, 'user');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
