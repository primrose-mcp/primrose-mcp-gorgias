/**
 * Custom Field Tools
 *
 * MCP tools for Gorgias custom field management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all custom field-related tools
 */
export function registerCustomFieldTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Custom Fields
  // ===========================================================================
  server.tool(
    'gorgias_list_custom_fields',
    `List all custom fields from Gorgias.

Custom fields allow you to store additional structured data on tickets and customers.

Args:
  - objectType: Filter by object type ('ticket' or 'customer')
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: Array of custom fields
  Markdown format: Formatted table of custom fields`,
    {
      objectType: z.enum(['ticket', 'customer']).optional().describe('Filter by object type'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ objectType, format }) => {
      try {
        const customFields = await client.listCustomFields({ objectType });
        return formatResponse({ items: customFields }, format, 'custom_fields');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Custom Field
  // ===========================================================================
  server.tool(
    'gorgias_get_custom_field',
    `Get a single custom field by ID.

Args:
  - id: The custom field ID
  - format: Response format ('json' or 'markdown')

Returns:
  The custom field record with all available fields.`,
    {
      id: z.number().int().describe('Custom field ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const customField = await client.getCustomField(id);
        return formatResponse(customField, format, 'custom_field');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Custom Field
  // ===========================================================================
  server.tool(
    'gorgias_create_custom_field',
    `Create a new custom field in Gorgias.

Args:
  - objectType: Object type ('ticket' or 'customer') (required)
  - label: Field label (required)
  - description: Field description
  - priority: Display priority
  - required: Whether the field is required
  - definitionType: Field type (e.g., 'text', 'number', 'dropdown')
  - definitionChoices: Array of choices for dropdown fields

Returns:
  The created custom field record.`,
    {
      objectType: z.enum(['ticket', 'customer']).describe('Object type'),
      label: z.string().describe('Field label'),
      description: z.string().optional().describe('Field description'),
      priority: z.number().int().optional().describe('Display priority'),
      required: z.boolean().optional().describe('Whether field is required'),
      definitionType: z.string().describe('Field type (text, number, dropdown, etc.)'),
      definitionChoices: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
        .optional()
        .describe('Choices for dropdown fields'),
    },
    async ({
      objectType,
      label,
      description,
      priority,
      required,
      definitionType,
      definitionChoices,
    }) => {
      try {
        const definition = {
          type: definitionType,
          choices: definitionChoices,
        };
        const customField = await client.createCustomField({
          objectType,
          label,
          description,
          priority,
          required,
          definition,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Custom field created', customField },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Custom Field
  // ===========================================================================
  server.tool(
    'gorgias_update_custom_field',
    `Update an existing custom field.

Args:
  - id: Custom field ID to update
  - label: New field label
  - description: New field description
  - priority: New display priority
  - required: New required setting

Returns:
  The updated custom field record.`,
    {
      id: z.number().int().describe('Custom field ID to update'),
      label: z.string().optional().describe('Field label'),
      description: z.string().optional().describe('Field description'),
      priority: z.number().int().optional().describe('Display priority'),
      required: z.boolean().optional().describe('Whether field is required'),
    },
    async ({ id, label, description, priority, required }) => {
      try {
        const customField = await client.updateCustomField(id, {
          label,
          description,
          priority,
          required,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Custom field updated', customField },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
