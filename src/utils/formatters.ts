/**
 * Response Formatting Utilities
 *
 * Helpers for formatting tool responses in JSON or Markdown.
 */

import type {
  GorgiasCustomer,
  GorgiasMacro,
  GorgiasMessage,
  GorgiasRule,
  GorgiasSatisfactionSurvey,
  GorgiasTag,
  GorgiasTeam,
  GorgiasTicket,
  GorgiasUser,
  PaginatedResponse,
  ResponseFormat,
} from '../types/entities.js';
import { formatErrorForLogging, GorgiasApiError } from './errors.js';

/**
 * MCP tool response type
 * Note: Index signature required for MCP SDK 1.25+ compatibility
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Format a successful response
 */
export function formatResponse(
  data: unknown,
  format: ResponseFormat,
  entityType: string
): ToolResponse {
  if (format === 'markdown') {
    return {
      content: [{ type: 'text', text: formatAsMarkdown(data, entityType) }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Format an error response
 */
export function formatError(error: unknown): ToolResponse {
  const errorInfo = formatErrorForLogging(error);

  let message: string;
  if (error instanceof GorgiasApiError) {
    message = `Error: ${error.message}`;
    if (error.retryable) {
      message += ' (retryable)';
    }
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = `Error: ${String(error)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message, details: errorInfo }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: unknown, entityType: string): string {
  if (isPaginatedResponse(data)) {
    return formatPaginatedAsMarkdown(data, entityType);
  }

  if (Array.isArray(data)) {
    return formatArrayAsMarkdown(data, entityType);
  }

  if (typeof data === 'object' && data !== null) {
    return formatObjectAsMarkdown(data as Record<string, unknown>, entityType);
  }

  return String(data);
}

/**
 * Type guard for paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as PaginatedResponse<unknown>).items)
  );
}

/**
 * Format paginated response as Markdown
 */
function formatPaginatedAsMarkdown(data: PaginatedResponse<unknown>, entityType: string): string {
  const lines: string[] = [];

  lines.push(`## ${capitalize(entityType)}`);
  lines.push('');
  lines.push(`**Showing:** ${data.items.length} items`);

  if (data.nextCursor) {
    lines.push(`**More available:** Yes (cursor: \`${data.nextCursor}\`)`);
  }
  lines.push('');

  if (data.items.length === 0) {
    lines.push('_No items found._');
    return lines.join('\n');
  }

  // Format items based on entity type
  switch (entityType) {
    case 'tickets':
      lines.push(formatTicketsTable(data.items as GorgiasTicket[]));
      break;
    case 'messages':
      lines.push(formatMessagesTable(data.items as GorgiasMessage[]));
      break;
    case 'customers':
      lines.push(formatCustomersTable(data.items as GorgiasCustomer[]));
      break;
    case 'users':
      lines.push(formatUsersTable(data.items as GorgiasUser[]));
      break;
    case 'teams':
      lines.push(formatTeamsTable(data.items as GorgiasTeam[]));
      break;
    case 'tags':
      lines.push(formatTagsTable(data.items as GorgiasTag[]));
      break;
    case 'macros':
      lines.push(formatMacrosTable(data.items as GorgiasMacro[]));
      break;
    case 'rules':
      lines.push(formatRulesTable(data.items as GorgiasRule[]));
      break;
    case 'satisfaction_surveys':
      lines.push(formatSatisfactionSurveysTable(data.items as GorgiasSatisfactionSurvey[]));
      break;
    default:
      lines.push(formatGenericTable(data.items));
  }

  return lines.join('\n');
}

/**
 * Format tickets as Markdown table
 */
function formatTicketsTable(tickets: GorgiasTicket[]): string {
  const lines: string[] = [];
  lines.push('| ID | Subject | Status | Priority | Channel | Customer | Created |');
  lines.push('|---|---|---|---|---|---|---|');

  for (const ticket of tickets) {
    const customer = ticket.customer?.email || ticket.customer?.name || '-';
    const subject = ticket.subject ? truncate(ticket.subject, 40) : '-';
    const created = formatDate(ticket.createdDatetime);
    lines.push(
      `| ${ticket.id} | ${subject} | ${ticket.status} | ${ticket.priority || '-'} | ${ticket.channel} | ${customer} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format messages as Markdown table
 */
function formatMessagesTable(messages: GorgiasMessage[]): string {
  const lines: string[] = [];
  lines.push('| ID | Ticket | Channel | From Agent | Sender | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const message of messages) {
    const sender = message.sender?.email || message.sender?.name || '-';
    const created = formatDate(message.createdDatetime);
    lines.push(
      `| ${message.id} | ${message.ticketId} | ${message.channel} | ${message.fromAgent ? 'Yes' : 'No'} | ${sender} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format customers as Markdown table
 */
function formatCustomersTable(customers: GorgiasCustomer[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Language | Tickets | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const customer of customers) {
    const name =
      customer.name || `${customer.firstname || ''} ${customer.lastname || ''}`.trim() || '-';
    const created = formatDate(customer.createdDatetime);
    lines.push(
      `| ${customer.id} | ${name} | ${customer.email || '-'} | ${customer.language || '-'} | ${customer.ticketsCount} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format users as Markdown table
 */
function formatUsersTable(users: GorgiasUser[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Role | Active | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const user of users) {
    const name = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || '-';
    const created = formatDate(user.createdDatetime);
    lines.push(
      `| ${user.id} | ${name} | ${user.email} | ${user.role?.name || '-'} | ${user.active ? 'Yes' : 'No'} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format teams as Markdown table
 */
function formatTeamsTable(teams: GorgiasTeam[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Description | Members | Created |');
  lines.push('|---|---|---|---|---|');

  for (const team of teams) {
    const description = team.description ? truncate(team.description, 30) : '-';
    const created = formatDate(team.createdDatetime);
    lines.push(
      `| ${team.id} | ${team.name} | ${description} | ${team.members?.length || 0} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format tags as Markdown table
 */
function formatTagsTable(tags: GorgiasTag[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Description | Usage | Created |');
  lines.push('|---|---|---|---|---|');

  for (const tag of tags) {
    const description = tag.description ? truncate(tag.description, 30) : '-';
    const created = formatDate(tag.createdDatetime);
    lines.push(`| ${tag.id} | ${tag.name} | ${description} | ${tag.usage} | ${created} |`);
  }

  return lines.join('\n');
}

/**
 * Format macros as Markdown table
 */
function formatMacrosTable(macros: GorgiasMacro[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Intent | Language | Usage | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const macro of macros) {
    const created = formatDate(macro.createdDatetime);
    lines.push(
      `| ${macro.id} | ${macro.name} | ${macro.intent || '-'} | ${macro.language || '-'} | ${macro.usage} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format rules as Markdown table
 */
function formatRulesTable(rules: GorgiasRule[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Event Types | Priority | Active | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const rule of rules) {
    const active = rule.deactivatedDatetime ? 'No' : 'Yes';
    const created = formatDate(rule.createdDatetime);
    lines.push(
      `| ${rule.id} | ${rule.name} | ${rule.eventTypes} | ${rule.priority} | ${active} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format satisfaction surveys as Markdown table
 */
function formatSatisfactionSurveysTable(surveys: GorgiasSatisfactionSurvey[]): string {
  const lines: string[] = [];
  lines.push('| ID | Score | Ticket | Customer | Scored At | Created |');
  lines.push('|---|---|---|---|---|---|');

  for (const survey of surveys) {
    const score = survey.score !== null ? String(survey.score) : '-';
    const scoredAt = survey.scoredDatetime ? formatDate(survey.scoredDatetime) : '-';
    const created = formatDate(survey.createdDatetime);
    lines.push(
      `| ${survey.id} | ${score} | ${survey.ticketId} | ${survey.customerId} | ${scoredAt} | ${created} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format a generic array as Markdown table
 */
function formatGenericTable(items: unknown[]): string {
  if (items.length === 0) return '_No items_';

  const first = items[0] as Record<string, unknown>;
  const keys = Object.keys(first).slice(0, 5); // Limit columns

  const lines: string[] = [];
  lines.push(`| ${keys.join(' | ')} |`);
  lines.push(`|${keys.map(() => '---').join('|')}|`);

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const values = keys.map((k) => String(record[k] ?? '-'));
    lines.push(`| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * Format an array as Markdown
 */
function formatArrayAsMarkdown(data: unknown[], _entityType: string): string {
  return formatGenericTable(data);
}

/**
 * Format a single object as Markdown
 */
function formatObjectAsMarkdown(data: Record<string, unknown>, entityType: string): string {
  const lines: string[] = [];
  lines.push(`## ${capitalize(entityType.replace(/s$/, ''))}`);
  lines.push('');

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'object') {
      lines.push(`**${formatKey(key)}:**`);
      lines.push('```json');
      lines.push(JSON.stringify(value, null, 2));
      lines.push('```');
    } else {
      lines.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a key for display (camelCase to Title Case)
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Truncate string with ellipsis
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
}
