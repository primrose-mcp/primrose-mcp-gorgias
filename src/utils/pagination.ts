/**
 * Pagination Utilities
 *
 * Helpers for handling pagination in the Gorgias API.
 */

import type { PaginatedResponse, PaginationParams } from '../types/entities.js';

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  limit: 20,
  maxLimit: 100,
} as const;

/**
 * Normalize pagination parameters
 */
export function normalizePaginationParams(
  params?: PaginationParams,
  maxLimit = PAGINATION_DEFAULTS.maxLimit
): Required<Pick<PaginationParams, 'limit'>> & Omit<PaginationParams, 'limit'> {
  return {
    limit: Math.min(params?.limit || PAGINATION_DEFAULTS.limit, maxLimit),
    cursor: params?.cursor,
  };
}

/**
 * Create an empty paginated response
 */
export function emptyPaginatedResponse<T>(): PaginatedResponse<T> {
  return {
    items: [],
  };
}

/**
 * Create a paginated response from an array
 */
export function createPaginatedResponse<T>(items: T[], nextCursor?: string): PaginatedResponse<T> {
  return {
    items,
    nextCursor,
  };
}

/**
 * Parse cursor from URL or string
 */
export function parseCursor(cursor?: string): {
  after?: string;
} {
  if (!cursor) return {};
  return { after: cursor };
}

/**
 * Encode cursor for response
 */
export function encodeCursor(data: { after?: string }): string | undefined {
  return data.after;
}
