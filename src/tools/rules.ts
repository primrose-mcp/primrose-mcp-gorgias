/**
 * Rule Tools
 *
 * MCP tools for Gorgias rule management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all rule-related tools
 */
export function registerRuleTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Rules
  // ===========================================================================
  server.tool(
    'gorgias_list_rules',
    `List automation rules from Gorgias with pagination.

Rules are automation workflows that trigger actions based on events (e.g., auto-tagging, auto-assignment).

Args:
  - limit: Number of rules to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Rule[], nextCursor }
  Markdown format: Formatted table of rules`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of rules to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, format }) => {
      try {
        const result = await client.listRules({ limit, cursor });
        return formatResponse(result, format, 'rules');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Rule
  // ===========================================================================
  server.tool(
    'gorgias_get_rule',
    `Get a single rule by ID.

Args:
  - id: The rule ID
  - format: Response format ('json' or 'markdown')

Returns:
  The rule record with all available fields including code/codeAst.`,
    {
      id: z.number().int().describe('Rule ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const rule = await client.getRule(id);
        return formatResponse(rule, format, 'rule');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Rule
  // ===========================================================================
  server.tool(
    'gorgias_create_rule',
    `Create a new automation rule in Gorgias.

Args:
  - name: Rule name (required)
  - eventTypes: Event types that trigger the rule (required, e.g., 'ticket-created')
  - description: Rule description
  - code: Rule code (Python-like syntax)
  - codeAstJson: Rule code AST as JSON (alternative to code)
  - priority: Rule priority (lower runs first)

Returns:
  The created rule record.`,
    {
      name: z.string().describe('Rule name'),
      eventTypes: z.string().describe('Event types (e.g., ticket-created)'),
      description: z.string().optional().describe('Rule description'),
      code: z.string().optional().describe('Rule code'),
      codeAstJson: z.string().optional().describe('Rule code AST as JSON'),
      priority: z.number().int().optional().describe('Rule priority'),
    },
    async ({ name, eventTypes, description, code, codeAstJson, priority }) => {
      try {
        const codeAst = codeAstJson
          ? (JSON.parse(codeAstJson) as Record<string, unknown>)
          : undefined;
        const rule = await client.createRule({
          name,
          eventTypes,
          description,
          code,
          codeAst,
          priority,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Rule created', rule }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Rule
  // ===========================================================================
  server.tool(
    'gorgias_update_rule',
    `Update an existing rule.

Args:
  - id: Rule ID to update
  - name: New rule name
  - eventTypes: New event types
  - description: New rule description
  - code: New rule code
  - codeAstJson: New rule code AST as JSON
  - priority: New rule priority

Returns:
  The updated rule record.`,
    {
      id: z.number().int().describe('Rule ID to update'),
      name: z.string().optional().describe('Rule name'),
      eventTypes: z.string().optional().describe('Event types'),
      description: z.string().optional().describe('Rule description'),
      code: z.string().optional().describe('Rule code'),
      codeAstJson: z.string().optional().describe('Rule code AST as JSON'),
      priority: z.number().int().optional().describe('Rule priority'),
    },
    async ({ id, name, eventTypes, description, code, codeAstJson, priority }) => {
      try {
        const codeAst = codeAstJson
          ? (JSON.parse(codeAstJson) as Record<string, unknown>)
          : undefined;
        const rule = await client.updateRule(id, {
          name,
          eventTypes,
          description,
          code,
          codeAst,
          priority,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Rule updated', rule }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Rule
  // ===========================================================================
  server.tool(
    'gorgias_delete_rule',
    `Delete a rule from Gorgias.

Args:
  - id: Rule ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Rule ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteRule(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Rule ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
