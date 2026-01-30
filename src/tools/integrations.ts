/**
 * Integration Tools
 *
 * MCP tools for Gorgias integration management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all integration-related tools
 */
export function registerIntegrationTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Integrations
  // ===========================================================================
  server.tool(
    'gorgias_list_integrations',
    `List all integrations from Gorgias.

Integrations connect Gorgias to external services like Shopify, Magento, BigCommerce, etc.

Returns:
  JSON format: Array of integrations
  Markdown format: Formatted table of integrations`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const integrations = await client.listIntegrations();
        return formatResponse({ items: integrations }, format, 'integrations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Integration
  // ===========================================================================
  server.tool(
    'gorgias_get_integration',
    `Get a single integration by ID.

Args:
  - id: The integration ID
  - format: Response format ('json' or 'markdown')

Returns:
  The integration record with all available fields.`,
    {
      id: z.number().int().describe('Integration ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const integration = await client.getIntegration(id);
        return formatResponse(integration, format, 'integration');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Integration
  // ===========================================================================
  server.tool(
    'gorgias_create_integration',
    `Create a new HTTP integration in Gorgias.

Args:
  - name: Integration name (required)
  - type: Integration type (required)
  - httpUrl: HTTP endpoint URL
  - httpMethod: HTTP method (GET, POST, etc.)
  - httpHeaders: HTTP headers as key-value pairs (string values only)

Returns:
  The created integration record.`,
    {
      name: z.string().describe('Integration name'),
      type: z.string().describe('Integration type'),
      httpUrl: z.string().url().optional().describe('HTTP endpoint URL'),
      httpMethod: z.string().optional().describe('HTTP method'),
      httpHeadersJson: z.string().optional().describe('HTTP headers as JSON object'),
    },
    async ({ name, type, httpUrl, httpMethod, httpHeadersJson }) => {
      try {
        const httpHeaders: Record<string, string> = httpHeadersJson
          ? JSON.parse(httpHeadersJson)
          : {};
        const http = httpUrl
          ? {
              url: httpUrl,
              method: httpMethod || 'POST',
              headers: httpHeaders,
              triggers: {},
            }
          : undefined;
        const integration = await client.createIntegration({ name, type, http });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Integration created', integration },
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
  // Update Integration
  // ===========================================================================
  server.tool(
    'gorgias_update_integration',
    `Update an existing integration.

Args:
  - id: Integration ID to update
  - name: New integration name

Returns:
  The updated integration record.`,
    {
      id: z.number().int().describe('Integration ID to update'),
      name: z.string().optional().describe('Integration name'),
    },
    async ({ id, name }) => {
      try {
        const integration = await client.updateIntegration(id, { name });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Integration updated', integration },
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
  // Delete Integration
  // ===========================================================================
  server.tool(
    'gorgias_delete_integration',
    `Delete an integration from Gorgias.

Args:
  - id: Integration ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Integration ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteIntegration(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: `Integration ${id} deleted` },
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
