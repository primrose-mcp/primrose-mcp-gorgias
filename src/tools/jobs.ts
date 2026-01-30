/**
 * Job Tools
 *
 * MCP tools for Gorgias job management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all job-related tools
 */
export function registerJobTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Jobs
  // ===========================================================================
  server.tool(
    'gorgias_list_jobs',
    `List background jobs from Gorgias with pagination.

Jobs represent background tasks like bulk operations or imports.

Args:
  - limit: Number of jobs to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Job[], nextCursor }
  Markdown format: Formatted table of jobs`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of jobs to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, format }) => {
      try {
        const result = await client.listJobs({ limit, cursor });
        return formatResponse(result, format, 'jobs');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Job
  // ===========================================================================
  server.tool(
    'gorgias_get_job',
    `Get a single job by ID.

Args:
  - id: The job ID
  - format: Response format ('json' or 'markdown')

Returns:
  The job record with all available fields including status and progress.`,
    {
      id: z.number().int().describe('Job ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const job = await client.getJob(id);
        return formatResponse(job, format, 'job');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Job
  // ===========================================================================
  server.tool(
    'gorgias_create_job',
    `Create a new background job in Gorgias.

Args:
  - type: Job type (required)
  - paramsJson: Job parameters as JSON string (required)
  - scheduledDatetime: When to run the job (ISO datetime)

Returns:
  The created job record.`,
    {
      type: z.string().describe('Job type'),
      paramsJson: z.string().describe('Job parameters as JSON'),
      scheduledDatetime: z.string().optional().describe('When to run (ISO datetime)'),
    },
    async ({ type, paramsJson, scheduledDatetime }) => {
      try {
        const params = JSON.parse(paramsJson) as Record<string, unknown>;
        const job = await client.createJob({ type, params, scheduledDatetime });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Job created', job }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Cancel Job
  // ===========================================================================
  server.tool(
    'gorgias_cancel_job',
    `Cancel a running job.

Args:
  - id: Job ID to cancel

Returns:
  Confirmation of cancellation.`,
    {
      id: z.number().int().describe('Job ID to cancel'),
    },
    async ({ id }) => {
      try {
        await client.cancelJob(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Job ${id} canceled` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
