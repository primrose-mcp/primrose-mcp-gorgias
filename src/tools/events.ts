/**
 * Event Tools
 *
 * MCP tools for Gorgias event management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all event-related tools
 */
export function registerEventTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Events
  // ===========================================================================
  server.tool(
    'gorgias_list_events',
    `List events from Gorgias with pagination and filtering.

Events represent actions that occurred in Gorgias (e.g., ticket created, message sent).

Args:
  - limit: Number of events to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - objectType: Filter by object type (e.g., 'ticket', 'message')
  - objectId: Filter by object ID
  - type: Filter by event type
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Event[], nextCursor }
  Markdown format: Formatted table of events`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of events to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      objectType: z.string().optional().describe('Filter by object type'),
      objectId: z.number().int().optional().describe('Filter by object ID'),
      type: z.string().optional().describe('Filter by event type'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, objectType, objectId, type, format }) => {
      try {
        const result = await client.listEvents({ limit, cursor, objectType, objectId, type });
        return formatResponse(result, format, 'events');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Event
  // ===========================================================================
  server.tool(
    'gorgias_get_event',
    `Get a single event by ID.

Args:
  - id: The event ID
  - format: Response format ('json' or 'markdown')

Returns:
  The event record with all available fields.`,
    {
      id: z.number().int().describe('Event ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const event = await client.getEvent(id);
        return formatResponse(event, format, 'event');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
