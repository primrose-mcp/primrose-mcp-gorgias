/**
 * View Tools
 *
 * MCP tools for Gorgias view management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all view-related tools
 */
export function registerViewTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Views
  // ===========================================================================
  server.tool(
    'gorgias_list_views',
    `List all ticket views from Gorgias.

Views are saved ticket filters that help organize and categorize tickets.

Returns:
  JSON format: Array of views
  Markdown format: Formatted table of views`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const views = await client.listViews();
        return formatResponse({ items: views }, format, 'views');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get View
  // ===========================================================================
  server.tool(
    'gorgias_get_view',
    `Get a single view by ID.

Args:
  - id: The view ID
  - format: Response format ('json' or 'markdown')

Returns:
  The view record with all available fields.`,
    {
      id: z.number().int().describe('View ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const view = await client.getView(id);
        return formatResponse(view, format, 'view');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create View
  // ===========================================================================
  server.tool(
    'gorgias_create_view',
    `Create a new view in Gorgias.

Args:
  - name: View name (required)
  - filters: Filter expression string
  - orderBy: Field to order by
  - orderDir: Order direction ('asc' or 'desc')
  - visibility: View visibility ('public', 'shared', 'private')
  - fields: Array of fields to display

Returns:
  The created view record.`,
    {
      name: z.string().describe('View name'),
      filters: z.string().optional().describe('Filter expression'),
      orderBy: z.string().optional().describe('Field to order by'),
      orderDir: z.enum(['asc', 'desc']).optional().describe('Order direction'),
      visibility: z.enum(['public', 'shared', 'private']).optional().describe('View visibility'),
      fields: z.array(z.string()).optional().describe('Fields to display'),
    },
    async ({ name, filters, orderBy, orderDir, visibility, fields }) => {
      try {
        const view = await client.createView({
          name,
          filters,
          orderBy,
          orderDir,
          visibility,
          fields,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'View created', view }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update View
  // ===========================================================================
  server.tool(
    'gorgias_update_view',
    `Update an existing view.

Args:
  - id: View ID to update
  - name: New view name
  - filters: New filter expression
  - orderBy: New field to order by
  - orderDir: New order direction
  - visibility: New visibility
  - fields: New fields to display

Returns:
  The updated view record.`,
    {
      id: z.number().int().describe('View ID to update'),
      name: z.string().optional().describe('View name'),
      filters: z.string().optional().describe('Filter expression'),
      orderBy: z.string().optional().describe('Field to order by'),
      orderDir: z.enum(['asc', 'desc']).optional().describe('Order direction'),
      visibility: z.enum(['public', 'shared', 'private']).optional().describe('View visibility'),
      fields: z.array(z.string()).optional().describe('Fields to display'),
    },
    async ({ id, ...input }) => {
      try {
        const view = await client.updateView(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'View updated', view }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete View
  // ===========================================================================
  server.tool(
    'gorgias_delete_view',
    `Delete a view from Gorgias.

Args:
  - id: View ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('View ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteView(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `View ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List View Items (Tickets)
  // ===========================================================================
  server.tool(
    'gorgias_list_view_items',
    `List tickets matching a view's filters.

Args:
  - viewId: The view ID
  - limit: Number of tickets to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Ticket[], nextCursor }
  Markdown format: Formatted table of tickets`,
    {
      viewId: z.number().int().describe('View ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of tickets to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ viewId, limit, cursor, format }) => {
      try {
        const result = await client.listViewItems(viewId, { limit, cursor });
        return formatResponse(result, format, 'tickets');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
