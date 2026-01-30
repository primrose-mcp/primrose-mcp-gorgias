/**
 * Widget Tools
 *
 * MCP tools for Gorgias widget management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all widget-related tools
 */
export function registerWidgetTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Widgets
  // ===========================================================================
  server.tool(
    'gorgias_list_widgets',
    `List all widgets from Gorgias.

Widgets display custom information in the helpdesk UI (e.g., customer data from external systems).

Returns:
  JSON format: Array of widgets
  Markdown format: Formatted table of widgets`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const widgets = await client.listWidgets();
        return formatResponse({ items: widgets }, format, 'widgets');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Widget
  // ===========================================================================
  server.tool(
    'gorgias_get_widget',
    `Get a single widget by ID.

Args:
  - id: The widget ID
  - format: Response format ('json' or 'markdown')

Returns:
  The widget record with all available fields.`,
    {
      id: z.number().int().describe('Widget ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const widget = await client.getWidget(id);
        return formatResponse(widget, format, 'widget');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Widget
  // ===========================================================================
  server.tool(
    'gorgias_create_widget',
    `Create a new widget in Gorgias.

Args:
  - context: Widget context ('ticket', 'customer', or 'user') (required)
  - template: Widget template HTML (required)
  - order: Display order
  - integrationId: Associated integration ID

Returns:
  The created widget record.`,
    {
      context: z.enum(['ticket', 'customer', 'user']).describe('Widget context'),
      template: z.string().describe('Widget template HTML'),
      order: z.number().int().optional().describe('Display order'),
      integrationId: z.number().int().optional().describe('Integration ID'),
    },
    async ({ context, template, order, integrationId }) => {
      try {
        const widget = await client.createWidget({ context, template, order, integrationId });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Widget created', widget }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Widget
  // ===========================================================================
  server.tool(
    'gorgias_update_widget',
    `Update an existing widget.

Args:
  - id: Widget ID to update
  - context: New widget context
  - template: New widget template HTML
  - order: New display order

Returns:
  The updated widget record.`,
    {
      id: z.number().int().describe('Widget ID to update'),
      context: z.enum(['ticket', 'customer', 'user']).optional().describe('Widget context'),
      template: z.string().optional().describe('Widget template HTML'),
      order: z.number().int().optional().describe('Display order'),
    },
    async ({ id, ...input }) => {
      try {
        const widget = await client.updateWidget(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Widget updated', widget }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Widget
  // ===========================================================================
  server.tool(
    'gorgias_delete_widget',
    `Delete a widget from Gorgias.

Args:
  - id: Widget ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Widget ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteWidget(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Widget ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
