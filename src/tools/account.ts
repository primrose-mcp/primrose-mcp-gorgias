/**
 * Account Tools
 *
 * MCP tools for Gorgias account management and statistics.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all account-related tools
 */
export function registerAccountTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // Get Account
  // ===========================================================================
  server.tool(
    'gorgias_get_account',
    `Get account information for the Gorgias helpdesk.

Returns:
  The account record including domain, status, and settings.`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const account = await client.getAccount();
        return formatResponse(account, format, 'account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Statistics
  // ===========================================================================
  server.tool(
    'gorgias_get_statistics',
    `Get statistics for the Gorgias helpdesk.

Args:
  - statisticType: Type of statistics to retrieve (required)
  - startDatetime: Start date for statistics (ISO datetime, required)
  - endDatetime: End date for statistics (ISO datetime, required)
  - timezone: Timezone for the statistics (optional)
  - format: Response format ('json' or 'markdown')

Returns:
  Statistics data for the specified time range.`,
    {
      statisticType: z.string().describe('Type of statistics'),
      startDatetime: z.string().describe('Start datetime (ISO format)'),
      endDatetime: z.string().describe('End datetime (ISO format)'),
      timezone: z.string().optional().describe('Timezone'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ statisticType, startDatetime, endDatetime, timezone, format }) => {
      try {
        const stats = await client.getStatistic(statisticType, {
          startDatetime,
          endDatetime,
          timezone,
        });
        return formatResponse(stats, format, 'statistics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Test Connection
  // ===========================================================================
  server.tool(
    'gorgias_test_connection',
    `Test the connection to the Gorgias API.

Returns:
  Connection status and account information.`,
    {},
    async () => {
      try {
        const result = await client.testConnection();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
