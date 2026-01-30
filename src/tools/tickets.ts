/**
 * Ticket Tools
 *
 * MCP tools for Gorgias ticket management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all ticket-related tools
 */
export function registerTicketTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Tickets
  // ===========================================================================
  server.tool(
    'gorgias_list_tickets',
    `List tickets from Gorgias with pagination and filtering.

Returns a paginated list of tickets. Use the cursor from the response to fetch the next page.

Args:
  - limit: Number of tickets to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - status: Filter by status ('open' or 'closed')
  - assigneeUserId: Filter by assigned user ID
  - assigneeTeamId: Filter by assigned team ID
  - customerId: Filter by customer ID
  - channel: Filter by channel
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Ticket[], nextCursor }
  Markdown format: Formatted table of tickets`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of tickets to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      status: z.enum(['open', 'closed']).optional().describe('Filter by status'),
      assigneeUserId: z.number().int().optional().describe('Filter by assigned user ID'),
      assigneeTeamId: z.number().int().optional().describe('Filter by assigned team ID'),
      customerId: z.number().int().optional().describe('Filter by customer ID'),
      channel: z.string().optional().describe('Filter by channel'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({
      limit,
      cursor,
      status,
      assigneeUserId,
      assigneeTeamId,
      customerId,
      channel,
      format,
    }) => {
      try {
        const result = await client.listTickets({
          limit,
          cursor,
          status,
          assigneeUserId,
          assigneeTeamId,
          customerId,
          channel,
        });
        return formatResponse(result, format, 'tickets');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Ticket
  // ===========================================================================
  server.tool(
    'gorgias_get_ticket',
    `Get a single ticket by ID with all messages included.

Args:
  - id: The ticket ID
  - format: Response format ('json' or 'markdown')

Returns:
  The ticket record with all available fields and messages.`,
    {
      id: z.number().int().describe('Ticket ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const ticket = await client.getTicket(id);
        return formatResponse(ticket, format, 'ticket');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Ticket
  // ===========================================================================
  server.tool(
    'gorgias_create_ticket',
    `Create a new ticket in Gorgias.

Args:
  - channel: The channel for the ticket (e.g., 'email', 'chat', 'phone')
  - customerId: Customer ID (optional if customerEmail provided)
  - customerEmail: Customer email (used if customerId not provided)
  - subject: Ticket subject
  - messageBodyText: Initial message body (plain text)
  - messageBodyHtml: Initial message body (HTML, optional)
  - messageVia: How the message was received (e.g., 'email', 'api')

Returns:
  The created ticket record.`,
    {
      channel: z.string().describe('Channel for the ticket'),
      customerId: z.number().int().optional().describe('Customer ID'),
      customerEmail: z.string().email().optional().describe('Customer email'),
      subject: z.string().optional().describe('Ticket subject'),
      messageBodyText: z.string().describe('Initial message body (plain text)'),
      messageBodyHtml: z.string().optional().describe('Initial message body (HTML)'),
      messageVia: z.string().default('api').describe('How the message was received'),
    },
    async ({
      channel,
      customerId,
      customerEmail,
      subject,
      messageBodyText,
      messageBodyHtml,
      messageVia,
    }) => {
      try {
        const ticket = await client.createTicket({
          channel,
          customerId,
          customerEmail,
          subject,
          messages: [
            {
              channel,
              via: messageVia,
              bodyText: messageBodyText,
              bodyHtml: messageBodyHtml,
              fromAgent: false,
            },
          ],
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Ticket created', ticket }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Ticket
  // ===========================================================================
  server.tool(
    'gorgias_update_ticket',
    `Update an existing ticket.

Args:
  - id: Ticket ID to update
  - status: New status ('open' or 'closed')
  - priority: New priority ('low', 'normal', 'high', 'urgent')
  - assigneeUserId: New assignee user ID (null to unassign)
  - assigneeTeamId: New assignee team ID (null to unassign)
  - snoozeUntilDatetime: Snooze until this datetime (ISO format, null to unsnooze)

Returns:
  The updated ticket record.`,
    {
      id: z.number().int().describe('Ticket ID to update'),
      status: z.enum(['open', 'closed']).optional().describe('New status'),
      priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().describe('New priority'),
      assigneeUserId: z.number().int().nullable().optional().describe('New assignee user ID'),
      assigneeTeamId: z.number().int().nullable().optional().describe('New assignee team ID'),
      snoozeUntilDatetime: z
        .string()
        .nullable()
        .optional()
        .describe('Snooze until datetime (ISO format)'),
    },
    async ({ id, ...input }) => {
      try {
        const ticket = await client.updateTicket(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Ticket updated', ticket }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Ticket
  // ===========================================================================
  server.tool(
    'gorgias_delete_ticket',
    `Delete a ticket from Gorgias.

Args:
  - id: Ticket ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Ticket ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteTicket(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Ticket ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add Tags to Ticket
  // ===========================================================================
  server.tool(
    'gorgias_add_ticket_tags',
    `Add tags to a ticket.

Args:
  - ticketId: The ticket ID
  - tagIds: Array of tag IDs to add

Returns:
  Confirmation of success.`,
    {
      ticketId: z.number().int().describe('Ticket ID'),
      tagIds: z.array(z.number().int()).describe('Tag IDs to add'),
    },
    async ({ ticketId, tagIds }) => {
      try {
        await client.addTicketTags(ticketId, tagIds);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tags added to ticket' }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove Tags from Ticket
  // ===========================================================================
  server.tool(
    'gorgias_remove_ticket_tags',
    `Remove tags from a ticket.

Args:
  - ticketId: The ticket ID
  - tagIds: Array of tag IDs to remove

Returns:
  Confirmation of success.`,
    {
      ticketId: z.number().int().describe('Ticket ID'),
      tagIds: z.array(z.number().int()).describe('Tag IDs to remove'),
    },
    async ({ ticketId, tagIds }) => {
      try {
        await client.removeTicketTags(ticketId, tagIds);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tags removed from ticket' }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
