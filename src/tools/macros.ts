/**
 * Macro Tools
 *
 * MCP tools for Gorgias macro management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all macro-related tools
 */
export function registerMacroTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Macros
  // ===========================================================================
  server.tool(
    'gorgias_list_macros',
    `List macros from Gorgias with pagination.

Macros are pre-defined responses and actions that agents can use to respond quickly to common customer inquiries.

Args:
  - limit: Number of macros to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Macro[], nextCursor }
  Markdown format: Formatted table of macros`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of macros to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, format }) => {
      try {
        const result = await client.listMacros({ limit, cursor });
        return formatResponse(result, format, 'macros');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Macro
  // ===========================================================================
  server.tool(
    'gorgias_get_macro',
    `Get a single macro by ID.

Args:
  - id: The macro ID
  - format: Response format ('json' or 'markdown')

Returns:
  The macro record with all available fields including actions.`,
    {
      id: z.number().int().describe('Macro ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const macro = await client.getMacro(id);
        return formatResponse(macro, format, 'macro');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Macro
  // ===========================================================================
  server.tool(
    'gorgias_create_macro',
    `Create a new macro in Gorgias.

Args:
  - name: Macro name (required)
  - actions: Array of macro actions as JSON (required)
  - intent: Intent/category of the macro
  - language: Language code for the macro

Returns:
  The created macro record.`,
    {
      name: z.string().describe('Macro name'),
      actionsJson: z.string().describe('Macro actions as JSON array of {type, args} objects'),
      intent: z.string().optional().describe('Intent/category'),
      language: z.string().optional().describe('Language code'),
    },
    async ({ name, actionsJson, intent, language }) => {
      try {
        const actions = JSON.parse(actionsJson) as Array<{
          type: string;
          args: Record<string, unknown>;
        }>;
        const macro = await client.createMacro({ name, actions, intent, language });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Macro created', macro }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Macro
  // ===========================================================================
  server.tool(
    'gorgias_update_macro',
    `Update an existing macro.

Args:
  - id: Macro ID to update
  - name: New macro name
  - actionsJson: New array of macro actions as JSON
  - intent: New intent/category
  - language: New language code

Returns:
  The updated macro record.`,
    {
      id: z.number().int().describe('Macro ID to update'),
      name: z.string().optional().describe('Macro name'),
      actionsJson: z.string().optional().describe('Macro actions as JSON array'),
      intent: z.string().optional().describe('Intent/category'),
      language: z.string().optional().describe('Language code'),
    },
    async ({ id, name, actionsJson, intent, language }) => {
      try {
        const actions = actionsJson
          ? (JSON.parse(actionsJson) as Array<{ type: string; args: Record<string, unknown> }>)
          : undefined;
        const macro = await client.updateMacro(id, { name, actions, intent, language });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Macro updated', macro }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Macro
  // ===========================================================================
  server.tool(
    'gorgias_delete_macro',
    `Delete a macro from Gorgias.

Args:
  - id: Macro ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Macro ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteMacro(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Macro ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
