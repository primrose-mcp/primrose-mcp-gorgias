/**
 * Message Tools
 *
 * MCP tools for Gorgias message management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all message-related tools
 */
export function registerMessageTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Messages
  // ===========================================================================
  server.tool(
    'gorgias_list_messages',
    `List messages from Gorgias with pagination and filtering.

Returns a paginated list of messages. Use the cursor from the response to fetch the next page.

Args:
  - limit: Number of messages to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - ticketId: Filter by ticket ID
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Message[], nextCursor }
  Markdown format: Formatted table of messages`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of messages to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      ticketId: z.number().int().optional().describe('Filter by ticket ID'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, ticketId, format }) => {
      try {
        const result = await client.listMessages({ limit, cursor, ticketId });
        return formatResponse(result, format, 'messages');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Message
  // ===========================================================================
  server.tool(
    'gorgias_get_message',
    `Get a single message by ID.

Args:
  - id: The message ID
  - format: Response format ('json' or 'markdown')

Returns:
  The message record with all available fields.`,
    {
      id: z.number().int().describe('Message ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const message = await client.getMessage(id);
        return formatResponse(message, format, 'message');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Message
  // ===========================================================================
  server.tool(
    'gorgias_create_message',
    `Create a new message on a ticket.

Args:
  - ticketId: The ticket ID to add the message to
  - channel: The channel for the message (e.g., 'email', 'internal-note')
  - via: How the message was received (e.g., 'email', 'api', 'helpdesk')
  - bodyText: Message body (plain text)
  - bodyHtml: Message body (HTML, optional)
  - fromAgent: Whether this message is from an agent (default: true)
  - senderId: Sender user ID (for agent messages)
  - receiverId: Receiver user/customer ID
  - subject: Message subject (optional)

Returns:
  The created message record.`,
    {
      ticketId: z.number().int().describe('Ticket ID'),
      channel: z.string().describe('Channel for the message'),
      via: z.string().default('helpdesk').describe('How the message was received'),
      bodyText: z.string().describe('Message body (plain text)'),
      bodyHtml: z.string().optional().describe('Message body (HTML)'),
      fromAgent: z.boolean().default(true).describe('Whether this is from an agent'),
      senderId: z.number().int().optional().describe('Sender user ID'),
      receiverId: z.number().int().optional().describe('Receiver ID'),
      subject: z.string().optional().describe('Message subject'),
    },
    async ({
      ticketId,
      channel,
      via,
      bodyText,
      bodyHtml,
      fromAgent,
      senderId,
      receiverId,
      subject,
    }) => {
      try {
        const message = await client.createMessage({
          ticketId,
          channel,
          via,
          bodyText,
          bodyHtml,
          fromAgent,
          senderId,
          receiverId,
          subject,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Message created', data: message },
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
  // Delete Message
  // ===========================================================================
  server.tool(
    'gorgias_delete_message',
    `Delete a message from Gorgias.

Args:
  - id: Message ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Message ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteMessage(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Message ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
