/**
 * Gorgias MCP Server - Environment Bindings
 *
 * Type definitions for Cloudflare Worker environment variables and bindings.
 *
 * MULTI-TENANT ARCHITECTURE:
 * This server supports multiple tenants. Tenant-specific credentials
 * are passed via request headers, NOT stored in wrangler secrets.
 *
 * Required Headers:
 *   X-Gorgias-Domain: Your Gorgias subdomain (e.g., "mycompany" for mycompany.gorgias.com)
 *   X-Gorgias-Email: Your Gorgias account email
 *   X-Gorgias-API-Key: Your Gorgias API key
 */

// =============================================================================
// Tenant Credentials (parsed from request headers)
// =============================================================================

export interface GorgiasCredentials {
  /** Gorgias subdomain (from X-Gorgias-Domain header) */
  domain: string;

  /** Gorgias account email for Basic Auth (from X-Gorgias-Email header) */
  email: string;

  /** Gorgias API key for Basic Auth (from X-Gorgias-API-Key header) */
  apiKey: string;
}

/**
 * Parse Gorgias credentials from request headers
 */
export function parseGorgiasCredentials(request: Request): Partial<GorgiasCredentials> {
  const headers = request.headers;

  return {
    domain: headers.get('X-Gorgias-Domain') || undefined,
    email: headers.get('X-Gorgias-Email') || undefined,
    apiKey: headers.get('X-Gorgias-API-Key') || undefined,
  };
}

/**
 * Validate that all required Gorgias credentials are present
 */
export function validateGorgiasCredentials(
  credentials: Partial<GorgiasCredentials>
): asserts credentials is GorgiasCredentials {
  const missing: string[] = [];

  if (!credentials.domain) {
    missing.push('X-Gorgias-Domain');
  }
  if (!credentials.email) {
    missing.push('X-Gorgias-Email');
  }
  if (!credentials.apiKey) {
    missing.push('X-Gorgias-API-Key');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required headers: ${missing.join(', ')}`);
  }
}

// =============================================================================
// Environment Configuration (from wrangler.jsonc vars and bindings)
// =============================================================================

export interface Env {
  /** Maximum character limit for responses */
  CHARACTER_LIMIT: string;

  /** Default page size for list operations */
  DEFAULT_PAGE_SIZE: string;

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: string;

  /** KV namespace for caching (optional) */
  CACHE_KV?: KVNamespace;

  /** Durable Object namespace for MCP sessions (optional) */
  MCP_SESSIONS?: DurableObjectNamespace;

  /** Cloudflare AI binding (optional) */
  AI?: Ai;
}

// ===========================================================================
// Helper Functions
// ===========================================================================

/**
 * Get a numeric environment value with a default
 */
export function getEnvNumber(env: Env, key: keyof Env, defaultValue: number): number {
  const value = env[key];
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Get the character limit from environment
 */
export function getCharacterLimit(env: Env): number {
  return getEnvNumber(env, 'CHARACTER_LIMIT', 50000);
}

/**
 * Get the default page size from environment
 */
export function getDefaultPageSize(env: Env): number {
  return getEnvNumber(env, 'DEFAULT_PAGE_SIZE', 20);
}

/**
 * Get the maximum page size from environment
 */
export function getMaxPageSize(env: Env): number {
  return getEnvNumber(env, 'MAX_PAGE_SIZE', 100);
}
