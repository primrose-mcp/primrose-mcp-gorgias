/**
 * Customer Tools
 *
 * MCP tools for Gorgias customer management.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GorgiasClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all customer-related tools
 */
export function registerCustomerTools(server: McpServer, client: GorgiasClient): void {
  // ===========================================================================
  // List Customers
  // ===========================================================================
  server.tool(
    'gorgias_list_customers',
    `List customers from Gorgias with pagination and filtering.

Returns a paginated list of customers. Use the cursor from the response to fetch the next page.

Args:
  - limit: Number of customers to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - email: Filter by email address
  - format: Response format ('json' or 'markdown')

Returns:
  JSON format: { items: Customer[], nextCursor }
  Markdown format: Formatted table of customers`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of customers to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      email: z.string().optional().describe('Filter by email address'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, email, format }) => {
      try {
        const result = await client.listCustomers({ limit, cursor, email });
        return formatResponse(result, format, 'customers');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Customer
  // ===========================================================================
  server.tool(
    'gorgias_get_customer',
    `Get a single customer by ID.

Args:
  - id: The customer ID
  - format: Response format ('json' or 'markdown')

Returns:
  The customer record with all available fields.`,
    {
      id: z.number().int().describe('Customer ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const customer = await client.getCustomer(id);
        return formatResponse(customer, format, 'customer');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Customer
  // ===========================================================================
  server.tool(
    'gorgias_create_customer',
    `Create a new customer in Gorgias.

Args:
  - email: Customer email address
  - name: Full name
  - firstname: First name
  - lastname: Last name
  - externalId: External ID from your system
  - note: Notes about the customer
  - language: Preferred language code
  - timezone: Customer timezone

Returns:
  The created customer record.`,
    {
      email: z.string().email().optional().describe('Email address'),
      name: z.string().optional().describe('Full name'),
      firstname: z.string().optional().describe('First name'),
      lastname: z.string().optional().describe('Last name'),
      externalId: z.string().optional().describe('External ID'),
      note: z.string().optional().describe('Notes'),
      language: z.string().optional().describe('Language code'),
      timezone: z.string().optional().describe('Timezone'),
    },
    async (input) => {
      try {
        const customer = await client.createCustomer(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Customer created', customer },
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
  // Update Customer
  // ===========================================================================
  server.tool(
    'gorgias_update_customer',
    `Update an existing customer.

Args:
  - id: Customer ID to update
  - email: New email address
  - name: New full name
  - firstname: New first name
  - lastname: New last name
  - externalId: New external ID
  - note: New notes
  - language: New language code
  - timezone: New timezone

Returns:
  The updated customer record.`,
    {
      id: z.number().int().describe('Customer ID to update'),
      email: z.string().email().optional().describe('Email address'),
      name: z.string().optional().describe('Full name'),
      firstname: z.string().optional().describe('First name'),
      lastname: z.string().optional().describe('Last name'),
      externalId: z.string().optional().describe('External ID'),
      note: z.string().optional().describe('Notes'),
      language: z.string().optional().describe('Language code'),
      timezone: z.string().optional().describe('Timezone'),
    },
    async ({ id, ...input }) => {
      try {
        const customer = await client.updateCustomer(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Customer updated', customer },
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
  // Delete Customer
  // ===========================================================================
  server.tool(
    'gorgias_delete_customer',
    `Delete a customer from Gorgias.

Args:
  - id: Customer ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.number().int().describe('Customer ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteCustomer(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Customer ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Merge Customers
  // ===========================================================================
  server.tool(
    'gorgias_merge_customers',
    `Merge two customers into one.

Args:
  - targetId: The customer ID to keep (target)
  - sourceId: The customer ID to merge into target

Returns:
  The merged customer record.`,
    {
      targetId: z.number().int().describe('Target customer ID to keep'),
      sourceId: z.number().int().describe('Source customer ID to merge'),
    },
    async ({ targetId, sourceId }) => {
      try {
        const customer = await client.mergeCustomers(targetId, sourceId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, message: 'Customers merged', customer },
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
