/**
 * Gorgias MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It supports both stateless (McpServer) and stateful (McpAgent) modes.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (API keys, etc.) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 *   X-Gorgias-Domain: Your Gorgias subdomain (e.g., "mycompany" for mycompany.gorgias.com)
 *   X-Gorgias-Email: Your Gorgias account email
 *   X-Gorgias-API-Key: Your Gorgias API key
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createGorgiasClient } from './client.js';
import {
  registerAccountTools,
  registerCustomerTools,
  registerCustomFieldTools,
  registerEventTools,
  registerIntegrationTools,
  registerJobTools,
  registerMacroTools,
  registerMessageTools,
  registerRuleTools,
  registerSatisfactionTools,
  registerTagTools,
  registerTeamTools,
  registerTicketTools,
  registerUserTools,
  registerViewTools,
  registerWidgetTools,
} from './tools/index.js';
import {
  type Env,
  type GorgiasCredentials,
  parseGorgiasCredentials,
  validateGorgiasCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-gorgias';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode (Option 2) instead.
 * The stateful McpAgent is better suited for single-tenant deployments where
 * credentials can be stored as wrangler secrets.
 *
 * @deprecated For multi-tenant support, use stateless mode with per-request credentials
 */
export class GorgiasMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Gorgias-* headers instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 */
function createStatelessServer(credentials: GorgiasCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createGorgiasClient(credentials);

  // Register all Gorgias tools
  registerAccountTools(server, client);
  registerTicketTools(server, client);
  registerMessageTools(server, client);
  registerCustomerTools(server, client);
  registerUserTools(server, client);
  registerTeamTools(server, client);
  registerTagTools(server, client);
  registerMacroTools(server, client);
  registerRuleTools(server, client);
  registerIntegrationTools(server, client);
  registerViewTools(server, client);
  registerSatisfactionTools(server, client);
  registerCustomFieldTools(server, client);
  registerEventTools(server, client);
  registerJobTools(server, client);
  registerWidgetTools(server, client);

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseGorgiasCredentials(request);

      // Validate credentials are present
      try {
        validateGorgiasCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Gorgias-Domain', 'X-Gorgias-Email', 'X-Gorgias-API-Key'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Gorgias Helpdesk MCP Server - Multi-tenant',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass tenant credentials via request headers',
          required_headers: {
            'X-Gorgias-Domain':
              'Your Gorgias subdomain (e.g., "mycompany" for mycompany.gorgias.com)',
            'X-Gorgias-Email': 'Your Gorgias account email',
            'X-Gorgias-API-Key': 'Your Gorgias API key',
          },
        },
        tools: [
          'gorgias_test_connection',
          'gorgias_get_account',
          'gorgias_get_statistics',
          'gorgias_list_tickets',
          'gorgias_get_ticket',
          'gorgias_create_ticket',
          'gorgias_update_ticket',
          'gorgias_delete_ticket',
          'gorgias_add_ticket_tags',
          'gorgias_remove_ticket_tags',
          'gorgias_list_messages',
          'gorgias_get_message',
          'gorgias_create_message',
          'gorgias_delete_message',
          'gorgias_list_customers',
          'gorgias_get_customer',
          'gorgias_create_customer',
          'gorgias_update_customer',
          'gorgias_delete_customer',
          'gorgias_merge_customers',
          'gorgias_list_users',
          'gorgias_get_user',
          'gorgias_list_teams',
          'gorgias_get_team',
          'gorgias_create_team',
          'gorgias_update_team',
          'gorgias_delete_team',
          'gorgias_list_tags',
          'gorgias_get_tag',
          'gorgias_create_tag',
          'gorgias_update_tag',
          'gorgias_delete_tag',
          'gorgias_merge_tags',
          'gorgias_list_macros',
          'gorgias_get_macro',
          'gorgias_create_macro',
          'gorgias_update_macro',
          'gorgias_delete_macro',
          'gorgias_list_rules',
          'gorgias_get_rule',
          'gorgias_create_rule',
          'gorgias_update_rule',
          'gorgias_delete_rule',
          'gorgias_list_integrations',
          'gorgias_get_integration',
          'gorgias_create_integration',
          'gorgias_update_integration',
          'gorgias_delete_integration',
          'gorgias_list_views',
          'gorgias_get_view',
          'gorgias_create_view',
          'gorgias_update_view',
          'gorgias_delete_view',
          'gorgias_list_view_items',
          'gorgias_list_satisfaction_surveys',
          'gorgias_get_satisfaction_survey',
          'gorgias_create_satisfaction_survey',
          'gorgias_list_custom_fields',
          'gorgias_get_custom_field',
          'gorgias_create_custom_field',
          'gorgias_update_custom_field',
          'gorgias_list_events',
          'gorgias_get_event',
          'gorgias_list_jobs',
          'gorgias_get_job',
          'gorgias_create_job',
          'gorgias_cancel_job',
          'gorgias_list_widgets',
          'gorgias_get_widget',
          'gorgias_create_widget',
          'gorgias_update_widget',
          'gorgias_delete_widget',
        ],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
