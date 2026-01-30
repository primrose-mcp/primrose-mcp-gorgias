/**
 * Tag Tools
 *
 * MCP tools for Gorgias tag management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all tag-related tools
 */
export function registerTagTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Tags
  // ===========================================================================
  server.tool(
    'gorgias_list_tags',
    `List all tags from Gorgias.

Returns:
  JSON format: Array of tags
  Markdown format: Formatted table of tags`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const tags = await client.listTags();
        return formatResponse({ items: tags }, format, 'tags');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Tag
  // ===========================================================================
  server.tool(
    'gorgias_get_tag',
    `Get a single tag by ID.

Args:
  - id: The tag ID
  - format: Response format ('json' or 'markdown')

Returns:
  The tag record with all available fields.`,
    {
      id: z.number().int().describe('Tag ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const tag = await client.getTag(id);
        return formatResponse(tag, format, 'tag');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Tag
  // ===========================================================================
  server.tool(
    'gorgias_create_tag',
    `Create a new tag in Gorgias.

Args:
  - name: Tag name (required)
  - description: Tag description
  - color: Tag color (hex code)

Returns:
  The created tag record.`,
    {
      name: z.string().describe('Tag name'),
      description: z.string().optional().describe('Tag description'),
      color: z.string().optional().describe('Tag color (hex code)'),
    },
    async ({ name, description, color }) => {
      try {
        const decoration = color ? { color } : undefined;
        const tag = await client.createTag({ name, description, decoration });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tag created', tag }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Tag
  // ===========================================================================
  server.tool(
    'gorgias_update_tag',
    `Update an existing tag.

Args:
  - id: Tag ID to update
  - name: New tag name
  - description: New tag description
  - color: New tag color (hex code)

Returns:
  The updated tag record.`,
    {
      id: z.number().int().describe('Tag ID to update'),
      name: z.string().optional().describe('Tag name'),
      description: z.string().optional().describe('Tag description'),
      color: z.string().optional().describe('Tag color (hex code)'),
    },
    async ({ id, name, description, color }) => {
      try {
        const decoration = color ? { color } : undefined;
        const tag = await client.updateTag(id, { name, description, decoration });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tag updated', tag }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Tag
  // ===========================================================================
  server.tool(
    'gorgias_delete_tag',
    `Delete a tag from Gorgias.

Args:
  - id: Tag ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Tag ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteTag(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Tag ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Merge Tags
  // ===========================================================================
  server.tool(
    'gorgias_merge_tags',
    `Merge multiple tags into one.

Args:
  - primaryId: The tag ID to keep (primary)
  - secondaryIds: Array of tag IDs to merge into the primary

Returns:
  The merged tag record.`,
    {
      primaryId: z.number().int().describe('Primary tag ID to keep'),
      secondaryIds: z.array(z.number().int()).describe('Tag IDs to merge'),
    },
    async ({ primaryId, secondaryIds }) => {
      try {
        const tag = await client.mergeTags(primaryId, secondaryIds);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tags merged', tag }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
