/**
 * Satisfaction Survey Tools
 *
 * MCP tools for Gorgias satisfaction survey management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all satisfaction survey-related tools
 */
export function registerSatisfactionTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Satisfaction Surveys
  // ===========================================================================
  server.tool(
    'gorgias_list_satisfaction_surveys',
    `List satisfaction surveys from Gorgias with pagination.

Satisfaction surveys collect customer feedback after ticket resolution.

Args:
  - limit: Number of surveys to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - ticketId: Filter by ticket ID
  - customerId: Filter by customer ID
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: SatisfactionSurvey[], nextCursor }
  Markdown format: Formatted table of surveys`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of surveys to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      ticketId: z.number().int().optional().describe('Filter by ticket ID'),
      customerId: z.number().int().optional().describe('Filter by customer ID'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, ticketId, customerId, format }) => {
      try {
        const result = await client.listSatisfactionSurveys({
          limit,
          cursor,
          ticketId,
          customerId,
        });
        return formatResponse(result, format, 'satisfaction_surveys');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Satisfaction Survey
  // ===========================================================================
  server.tool(
    'gorgias_get_satisfaction_survey',
    `Get a single satisfaction survey by ID.

Args:
  - id: The survey ID
  - format: Response format ('json' or 'markdown')

Returns:
  The satisfaction survey record with all available fields.`,
    {
      id: z.number().int().describe('Survey ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const survey = await client.getSatisfactionSurvey(id);
        return formatResponse(survey, format, 'satisfaction_survey');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Satisfaction Survey
  // ===========================================================================
  server.tool(
    'gorgias_create_satisfaction_survey',
    `Create a new satisfaction survey in Gorgias.

Args:
  - ticketId: The ticket ID to survey (required)
  - customerId: The customer ID (required)
  - shouldSendDatetime: When to send the survey (ISO datetime)

Returns:
  The created satisfaction survey record.`,
    {
      ticketId: z.number().int().describe('Ticket ID'),
      customerId: z.number().int().describe('Customer ID'),
      shouldSendDatetime: z.string().optional().describe('When to send (ISO datetime)'),
    },
    async ({ ticketId, customerId, shouldSendDatetime }) => {
      try {
        const survey = await client.createSatisfactionSurvey({
          ticketId,
          customerId,
          shouldSendDatetime,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Satisfaction survey created', survey },
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
