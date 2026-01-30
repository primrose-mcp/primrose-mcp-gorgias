/**
 * Team Tools
 *
 * MCP tools for Gorgias team management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all team-related tools
 */
export function registerTeamTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Teams
  // ===========================================================================
  server.tool(
    'gorgias_list_teams',
    `List all teams from Gorgias.

Returns:
  JSON format: Array of teams
  Markdown format: Formatted table of teams`,
    {
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ format }) => {
      try {
        const teams = await client.listTeams();
        return formatResponse({ items: teams }, format, 'teams');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Team
  // ===========================================================================
  server.tool(
    'gorgias_get_team',
    `Get a single team by ID.

Args:
  - id: The team ID
  - format: Response format ('json' or 'markdown')

Returns:
  The team record with all available fields.`,
    {
      id: z.number().int().describe('Team ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const team = await client.getTeam(id);
        return formatResponse(team, format, 'team');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Team
  // ===========================================================================
  server.tool(
    'gorgias_create_team',
    `Create a new team in Gorgias.

Args:
  - name: Team name (required)
  - description: Team description
  - memberIds: Array of user IDs to add as members

Returns:
  The created team record.`,
    {
      name: z.string().describe('Team name'),
      description: z.string().optional().describe('Team description'),
      memberIds: z.array(z.number().int()).optional().describe('Member user IDs'),
    },
    async ({ name, description, memberIds }) => {
      try {
        const team = await client.createTeam({ name, description, memberIds });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Team created', team }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Team
  // ===========================================================================
  server.tool(
    'gorgias_update_team',
    `Update an existing team.

Args:
  - id: Team ID to update
  - name: New team name
  - description: New team description
  - memberIds: New array of member user IDs

Returns:
  The updated team record.`,
    {
      id: z.number().int().describe('Team ID to update'),
      name: z.string().optional().describe('Team name'),
      description: z.string().optional().describe('Team description'),
      memberIds: z.array(z.number().int()).optional().describe('Member user IDs'),
    },
    async ({ id, ...input }) => {
      try {
        const team = await client.updateTeam(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Team updated', team }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Team
  // ===========================================================================
  server.tool(
    'gorgias_delete_team',
    `Delete a team from Gorgias.

Args:
  - id: Team ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Team ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteTeam(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Team ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
