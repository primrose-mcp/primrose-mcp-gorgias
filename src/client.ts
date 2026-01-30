/**
 * Gorgias API Client
 *
 * HTTP client for the Gorgias helpdesk API.
 * API Reference: https://developers.gorgias.com/reference
 */

import type {
  GorgiasAccount,
  GorgiasCustomer,
  GorgiasCustomerCreateInput,
  GorgiasCustomerUpdateInput,
  GorgiasCustomField,
  GorgiasCustomFieldCreateInput,
  GorgiasEvent,
  GorgiasIntegration,
  GorgiasIntegrationCreateInput,
  GorgiasJob,
  GorgiasJobCreateInput,
  GorgiasMacro,
  GorgiasMacroCreateInput,
  GorgiasMessage,
  GorgiasMessageCreateInput,
  GorgiasRule,
  GorgiasRuleCreateInput,
  GorgiasSatisfactionSurvey,
  GorgiasSatisfactionSurveyCreateInput,
  GorgiasStatistic,
  GorgiasTag,
  GorgiasTagCreateInput,
  GorgiasTeam,
  GorgiasTeamCreateInput,
  GorgiasTicket,
  GorgiasTicketCreateInput,
  GorgiasTicketUpdateInput,
  GorgiasTicketWithMessages,
  GorgiasUser,
  GorgiasView,
  GorgiasViewCreateInput,
  GorgiasWidget,
  GorgiasWidgetCreateInput,
  PaginatedResponse,
  PaginationParams,
} from './types/entities.js';
import type { GorgiasCredentials } from './types/env.js';
import { AuthenticationError, GorgiasApiError, RateLimitError } from './utils/errors.js';

// =============================================================================
// Gorgias Client Interface
// =============================================================================

export interface GorgiasClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string }>;

  // Account
  getAccount(): Promise<GorgiasAccount>;

  // Tickets
  listTickets(params?: TicketListParams): Promise<PaginatedResponse<GorgiasTicket>>;
  getTicket(ticketId: number): Promise<GorgiasTicketWithMessages>;
  createTicket(input: GorgiasTicketCreateInput): Promise<GorgiasTicket>;
  updateTicket(ticketId: number, input: GorgiasTicketUpdateInput): Promise<GorgiasTicket>;
  deleteTicket(ticketId: number): Promise<void>;
  addTicketTags(ticketId: number, tagIds: number[]): Promise<void>;
  removeTicketTags(ticketId: number, tagIds: number[]): Promise<void>;

  // Messages
  listMessages(params?: MessageListParams): Promise<PaginatedResponse<GorgiasMessage>>;
  getMessage(messageId: number): Promise<GorgiasMessage>;
  createMessage(input: GorgiasMessageCreateInput): Promise<GorgiasMessage>;
  deleteMessage(messageId: number): Promise<void>;

  // Customers
  listCustomers(params?: CustomerListParams): Promise<PaginatedResponse<GorgiasCustomer>>;
  getCustomer(customerId: number): Promise<GorgiasCustomer>;
  createCustomer(input: GorgiasCustomerCreateInput): Promise<GorgiasCustomer>;
  updateCustomer(customerId: number, input: GorgiasCustomerUpdateInput): Promise<GorgiasCustomer>;
  deleteCustomer(customerId: number): Promise<void>;
  mergeCustomers(targetId: number, sourceId: number): Promise<GorgiasCustomer>;

  // Users
  listUsers(params?: PaginationParams): Promise<PaginatedResponse<GorgiasUser>>;
  getUser(userId: number): Promise<GorgiasUser>;

  // Teams
  listTeams(): Promise<GorgiasTeam[]>;
  getTeam(teamId: number): Promise<GorgiasTeam>;
  createTeam(input: GorgiasTeamCreateInput): Promise<GorgiasTeam>;
  updateTeam(teamId: number, input: Partial<GorgiasTeamCreateInput>): Promise<GorgiasTeam>;
  deleteTeam(teamId: number): Promise<void>;

  // Tags
  listTags(): Promise<GorgiasTag[]>;
  getTag(tagId: number): Promise<GorgiasTag>;
  createTag(input: GorgiasTagCreateInput): Promise<GorgiasTag>;
  updateTag(tagId: number, input: Partial<GorgiasTagCreateInput>): Promise<GorgiasTag>;
  deleteTag(tagId: number): Promise<void>;
  mergeTags(targetId: number, sourceIds: number[]): Promise<GorgiasTag>;

  // Macros
  listMacros(params?: PaginationParams): Promise<PaginatedResponse<GorgiasMacro>>;
  getMacro(macroId: number): Promise<GorgiasMacro>;
  createMacro(input: GorgiasMacroCreateInput): Promise<GorgiasMacro>;
  updateMacro(macroId: number, input: Partial<GorgiasMacroCreateInput>): Promise<GorgiasMacro>;
  deleteMacro(macroId: number): Promise<void>;

  // Rules
  listRules(params?: PaginationParams): Promise<PaginatedResponse<GorgiasRule>>;
  getRule(ruleId: number): Promise<GorgiasRule>;
  createRule(input: GorgiasRuleCreateInput): Promise<GorgiasRule>;
  updateRule(ruleId: number, input: Partial<GorgiasRuleCreateInput>): Promise<GorgiasRule>;
  deleteRule(ruleId: number): Promise<void>;

  // Integrations
  listIntegrations(): Promise<GorgiasIntegration[]>;
  getIntegration(integrationId: number): Promise<GorgiasIntegration>;
  createIntegration(input: GorgiasIntegrationCreateInput): Promise<GorgiasIntegration>;
  updateIntegration(
    integrationId: number,
    input: Partial<GorgiasIntegrationCreateInput>
  ): Promise<GorgiasIntegration>;
  deleteIntegration(integrationId: number): Promise<void>;

  // Views
  listViews(): Promise<GorgiasView[]>;
  getView(viewId: number): Promise<GorgiasView>;
  createView(input: GorgiasViewCreateInput): Promise<GorgiasView>;
  updateView(viewId: number, input: Partial<GorgiasViewCreateInput>): Promise<GorgiasView>;
  deleteView(viewId: number): Promise<void>;
  listViewItems(
    viewId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<GorgiasTicket>>;

  // Satisfaction Surveys
  listSatisfactionSurveys(
    params?: SurveyListParams
  ): Promise<PaginatedResponse<GorgiasSatisfactionSurvey>>;
  getSatisfactionSurvey(surveyId: number): Promise<GorgiasSatisfactionSurvey>;
  createSatisfactionSurvey(
    input: GorgiasSatisfactionSurveyCreateInput
  ): Promise<GorgiasSatisfactionSurvey>;

  // Custom Fields
  listCustomFields(params?: CustomFieldListParams): Promise<GorgiasCustomField[]>;
  getCustomField(fieldId: number): Promise<GorgiasCustomField>;
  createCustomField(input: GorgiasCustomFieldCreateInput): Promise<GorgiasCustomField>;
  updateCustomField(
    fieldId: number,
    input: Partial<GorgiasCustomFieldCreateInput>
  ): Promise<GorgiasCustomField>;

  // Events
  listEvents(params?: EventListParams): Promise<PaginatedResponse<GorgiasEvent>>;
  getEvent(eventId: number): Promise<GorgiasEvent>;

  // Jobs
  listJobs(params?: PaginationParams): Promise<PaginatedResponse<GorgiasJob>>;
  getJob(jobId: number): Promise<GorgiasJob>;
  createJob(input: GorgiasJobCreateInput): Promise<GorgiasJob>;
  cancelJob(jobId: number): Promise<void>;

  // Widgets
  listWidgets(): Promise<GorgiasWidget[]>;
  getWidget(widgetId: number): Promise<GorgiasWidget>;
  createWidget(input: GorgiasWidgetCreateInput): Promise<GorgiasWidget>;
  updateWidget(widgetId: number, input: Partial<GorgiasWidgetCreateInput>): Promise<GorgiasWidget>;
  deleteWidget(widgetId: number): Promise<void>;

  // Statistics
  getStatistic(name: string, params: StatisticParams): Promise<GorgiasStatistic>;
}

// =============================================================================
// Parameter Types
// =============================================================================

export interface TicketListParams extends PaginationParams {
  status?: 'open' | 'closed';
  channel?: string;
  assigneeUserId?: number;
  assigneeTeamId?: number;
  customerId?: number;
  tagIds?: number[];
  createdDatetimeAfter?: string;
  createdDatetimeBefore?: string;
  updatedDatetimeAfter?: string;
  updatedDatetimeBefore?: string;
  orderBy?:
    | 'created_datetime'
    | 'updated_datetime'
    | 'last_message_datetime'
    | 'last_received_message_datetime';
}

export interface MessageListParams extends PaginationParams {
  ticketId?: number;
}

export interface CustomerListParams extends PaginationParams {
  email?: string;
}

export interface SurveyListParams extends PaginationParams {
  ticketId?: number;
  customerId?: number;
}

export interface CustomFieldListParams {
  objectType?: 'ticket' | 'customer';
}

export interface EventListParams extends PaginationParams {
  objectType?: string;
  objectId?: number;
  type?: string;
}

export interface StatisticParams {
  startDatetime: string;
  endDatetime: string;
  timezone?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

interface GorgiasListResponse<T> {
  data: T[];
  meta?: {
    next_cursor?: string;
  };
}

// =============================================================================
// Gorgias Client Implementation
// =============================================================================

class GorgiasClientImpl implements GorgiasClient {
  private credentials: GorgiasCredentials;

  constructor(credentials: GorgiasCredentials) {
    this.credentials = credentials;
  }

  private getBaseUrl(): string {
    return `https://${this.credentials.domain}.gorgias.com/api`;
  }

  private getAuthHeaders(): Record<string, string> {
    const credentials = btoa(`${this.credentials.email}:${this.credentials.apiKey}`);
    return {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your Gorgias credentials.');
    }

    if (!response.ok) {
      const errorBody = await response.text();
      let message = `API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.error || message;
      } catch {
        // Use default message
      }
      throw new GorgiasApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      await this.request<GorgiasListResponse<RawUser>>('/users?limit=1');
      return { connected: true, message: 'Successfully connected to Gorgias' };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Account
  // ===========================================================================

  async getAccount(): Promise<GorgiasAccount> {
    const data = await this.request<{
      domain: string;
      status: { active: boolean; reason: string | null };
      settings: Array<{ id: number; key: string; value: unknown }>;
      created_datetime: string;
      deactivated_datetime: string | null;
    }>('/account');

    return {
      domain: data.domain,
      status: data.status,
      settings: data.settings,
      createdDatetime: data.created_datetime,
      deactivatedDatetime: data.deactivated_datetime,
    };
  }

  // ===========================================================================
  // Tickets
  // ===========================================================================

  async listTickets(params?: TicketListParams): Promise<PaginatedResponse<GorgiasTicket>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.channel) queryParams.set('channel', params.channel);
    if (params?.assigneeUserId) queryParams.set('assignee_user_id', String(params.assigneeUserId));
    if (params?.assigneeTeamId) queryParams.set('assignee_team_id', String(params.assigneeTeamId));
    if (params?.customerId) queryParams.set('customer_id', String(params.customerId));
    if (params?.createdDatetimeAfter)
      queryParams.set('created_datetime_after', params.createdDatetimeAfter);
    if (params?.createdDatetimeBefore)
      queryParams.set('created_datetime_before', params.createdDatetimeBefore);
    if (params?.updatedDatetimeAfter)
      queryParams.set('updated_datetime_after', params.updatedDatetimeAfter);
    if (params?.updatedDatetimeBefore)
      queryParams.set('updated_datetime_before', params.updatedDatetimeBefore);
    if (params?.orderBy) queryParams.set('order_by', params.orderBy);

    const data = await this.request<GorgiasListResponse<RawTicket>>(`/tickets?${queryParams}`);

    return {
      items: data.data.map(mapTicket),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getTicket(ticketId: number): Promise<GorgiasTicketWithMessages> {
    const data = await this.request<RawTicketWithMessages>(`/tickets/${ticketId}`);
    return mapTicketWithMessages(data);
  }

  async createTicket(input: GorgiasTicketCreateInput): Promise<GorgiasTicket> {
    const body: Record<string, unknown> = {
      channel: input.channel,
      subject: input.subject,
      messages: input.messages.map((m) => ({
        channel: m.channel,
        via: m.via,
        body_text: m.bodyText,
        body_html: m.bodyHtml,
        from_agent: m.fromAgent ?? false,
        sender: m.senderId ? { id: m.senderId } : undefined,
        receiver: m.receiverId ? { id: m.receiverId } : undefined,
        subject: m.subject,
      })),
    };

    if (input.customerId) {
      body.customer = { id: input.customerId };
    } else if (input.customerEmail) {
      body.customer = { email: input.customerEmail };
    }

    const data = await this.request<RawTicket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapTicket(data);
  }

  async updateTicket(ticketId: number, input: GorgiasTicketUpdateInput): Promise<GorgiasTicket> {
    const body: Record<string, unknown> = {};
    if (input.status) body.status = input.status;
    if (input.priority) body.priority = input.priority;
    if (input.assigneeUserId !== undefined) {
      body.assignee_user = input.assigneeUserId ? { id: input.assigneeUserId } : null;
    }
    if (input.assigneeTeamId !== undefined) {
      body.assignee_team = input.assigneeTeamId ? { id: input.assigneeTeamId } : null;
    }
    if (input.snoozeUntilDatetime !== undefined) {
      body.snooze_datetime = input.snoozeUntilDatetime;
    }

    const data = await this.request<RawTicket>(`/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapTicket(data);
  }

  async deleteTicket(ticketId: number): Promise<void> {
    await this.request(`/tickets/${ticketId}`, { method: 'DELETE' });
  }

  async addTicketTags(ticketId: number, tagIds: number[]): Promise<void> {
    await this.request(`/tickets/${ticketId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags: tagIds.map((id) => ({ id })) }),
    });
  }

  async removeTicketTags(ticketId: number, tagIds: number[]): Promise<void> {
    await this.request(`/tickets/${ticketId}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tags: tagIds.map((id) => ({ id })) }),
    });
  }

  // ===========================================================================
  // Messages
  // ===========================================================================

  async listMessages(params?: MessageListParams): Promise<PaginatedResponse<GorgiasMessage>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);
    if (params?.ticketId) queryParams.set('ticket_id', String(params.ticketId));

    const data = await this.request<GorgiasListResponse<RawMessage>>(`/messages?${queryParams}`);

    return {
      items: data.data.map(mapMessage),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getMessage(messageId: number): Promise<GorgiasMessage> {
    const data = await this.request<RawMessage>(`/messages/${messageId}`);
    return mapMessage(data);
  }

  async createMessage(input: GorgiasMessageCreateInput): Promise<GorgiasMessage> {
    const body = {
      ticket_id: input.ticketId,
      channel: input.channel,
      via: input.via,
      body_text: input.bodyText,
      body_html: input.bodyHtml,
      from_agent: input.fromAgent ?? true,
      sender: input.senderId ? { id: input.senderId } : undefined,
      receiver: input.receiverId ? { id: input.receiverId } : undefined,
      subject: input.subject,
    };

    const data = await this.request<RawMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapMessage(data);
  }

  async deleteMessage(messageId: number): Promise<void> {
    await this.request(`/messages/${messageId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Customers
  // ===========================================================================

  async listCustomers(params?: CustomerListParams): Promise<PaginatedResponse<GorgiasCustomer>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);
    if (params?.email) queryParams.set('email', params.email);

    const data = await this.request<GorgiasListResponse<RawCustomer>>(`/customers?${queryParams}`);

    return {
      items: data.data.map(mapCustomer),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getCustomer(customerId: number): Promise<GorgiasCustomer> {
    const data = await this.request<RawCustomer>(`/customers/${customerId}`);
    return mapCustomer(data);
  }

  async createCustomer(input: GorgiasCustomerCreateInput): Promise<GorgiasCustomer> {
    const body = {
      email: input.email,
      name: input.name,
      firstname: input.firstname,
      lastname: input.lastname,
      external_id: input.externalId,
      note: input.note,
      language: input.language,
      timezone: input.timezone,
      data: input.data,
      channels: input.channels?.map((c) => ({
        type: c.type,
        address: c.address,
        preferred: c.preferred,
      })),
    };

    const data = await this.request<RawCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapCustomer(data);
  }

  async updateCustomer(
    customerId: number,
    input: GorgiasCustomerUpdateInput
  ): Promise<GorgiasCustomer> {
    const body = {
      email: input.email,
      name: input.name,
      firstname: input.firstname,
      lastname: input.lastname,
      external_id: input.externalId,
      note: input.note,
      language: input.language,
      timezone: input.timezone,
      data: input.data,
    };

    const data = await this.request<RawCustomer>(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapCustomer(data);
  }

  async deleteCustomer(customerId: number): Promise<void> {
    await this.request(`/customers/${customerId}`, { method: 'DELETE' });
  }

  async mergeCustomers(targetId: number, sourceId: number): Promise<GorgiasCustomer> {
    const data = await this.request<RawCustomer>(`/customers/${targetId}/merge`, {
      method: 'PUT',
      body: JSON.stringify({ customer_id: sourceId }),
    });

    return mapCustomer(data);
  }

  // ===========================================================================
  // Users
  // ===========================================================================

  async listUsers(params?: PaginationParams): Promise<PaginatedResponse<GorgiasUser>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);

    const data = await this.request<GorgiasListResponse<RawUser>>(`/users?${queryParams}`);

    return {
      items: data.data.map(mapUser),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getUser(userId: number): Promise<GorgiasUser> {
    const data = await this.request<RawUser>(`/users/${userId}`);
    return mapUser(data);
  }

  // ===========================================================================
  // Teams
  // ===========================================================================

  async listTeams(): Promise<GorgiasTeam[]> {
    const data = await this.request<GorgiasListResponse<RawTeam>>('/teams');
    return data.data.map(mapTeam);
  }

  async getTeam(teamId: number): Promise<GorgiasTeam> {
    const data = await this.request<RawTeam>(`/teams/${teamId}`);
    return mapTeam(data);
  }

  async createTeam(input: GorgiasTeamCreateInput): Promise<GorgiasTeam> {
    const body = {
      name: input.name,
      description: input.description,
      decoration: input.decoration,
      members: input.memberIds?.map((id) => ({ id })),
    };

    const data = await this.request<RawTeam>('/teams', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapTeam(data);
  }

  async updateTeam(teamId: number, input: Partial<GorgiasTeamCreateInput>): Promise<GorgiasTeam> {
    const body: Record<string, unknown> = {};
    if (input.name) body.name = input.name;
    if (input.description !== undefined) body.description = input.description;
    if (input.decoration) body.decoration = input.decoration;
    if (input.memberIds) body.members = input.memberIds.map((id) => ({ id }));

    const data = await this.request<RawTeam>(`/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapTeam(data);
  }

  async deleteTeam(teamId: number): Promise<void> {
    await this.request(`/teams/${teamId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Tags
  // ===========================================================================

  async listTags(): Promise<GorgiasTag[]> {
    const data = await this.request<GorgiasListResponse<RawTag>>('/tags');
    return data.data.map(mapTag);
  }

  async getTag(tagId: number): Promise<GorgiasTag> {
    const data = await this.request<RawTag>(`/tags/${tagId}`);
    return mapTag(data);
  }

  async createTag(input: GorgiasTagCreateInput): Promise<GorgiasTag> {
    const body = {
      name: input.name,
      description: input.description,
      decoration: input.decoration,
    };

    const data = await this.request<RawTag>('/tags', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapTag(data);
  }

  async updateTag(tagId: number, input: Partial<GorgiasTagCreateInput>): Promise<GorgiasTag> {
    const data = await this.request<RawTag>(`/tags/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });

    return mapTag(data);
  }

  async deleteTag(tagId: number): Promise<void> {
    await this.request(`/tags/${tagId}`, { method: 'DELETE' });
  }

  async mergeTags(targetId: number, sourceIds: number[]): Promise<GorgiasTag> {
    const data = await this.request<RawTag>('/tags/merge', {
      method: 'PUT',
      body: JSON.stringify({
        target_id: targetId,
        source_ids: sourceIds,
      }),
    });

    return mapTag(data);
  }

  // ===========================================================================
  // Macros
  // ===========================================================================

  async listMacros(params?: PaginationParams): Promise<PaginatedResponse<GorgiasMacro>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);

    const data = await this.request<GorgiasListResponse<RawMacro>>(`/macros?${queryParams}`);

    return {
      items: data.data.map(mapMacro),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getMacro(macroId: number): Promise<GorgiasMacro> {
    const data = await this.request<RawMacro>(`/macros/${macroId}`);
    return mapMacro(data);
  }

  async createMacro(input: GorgiasMacroCreateInput): Promise<GorgiasMacro> {
    const body = {
      name: input.name,
      actions: input.actions,
      intent: input.intent,
      language: input.language,
    };

    const data = await this.request<RawMacro>('/macros', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapMacro(data);
  }

  async updateMacro(
    macroId: number,
    input: Partial<GorgiasMacroCreateInput>
  ): Promise<GorgiasMacro> {
    const data = await this.request<RawMacro>(`/macros/${macroId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });

    return mapMacro(data);
  }

  async deleteMacro(macroId: number): Promise<void> {
    await this.request(`/macros/${macroId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Rules
  // ===========================================================================

  async listRules(params?: PaginationParams): Promise<PaginatedResponse<GorgiasRule>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);

    const data = await this.request<GorgiasListResponse<RawRule>>(`/rules?${queryParams}`);

    return {
      items: data.data.map(mapRule),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getRule(ruleId: number): Promise<GorgiasRule> {
    const data = await this.request<RawRule>(`/rules/${ruleId}`);
    return mapRule(data);
  }

  async createRule(input: GorgiasRuleCreateInput): Promise<GorgiasRule> {
    const body = {
      name: input.name,
      description: input.description,
      code: input.code,
      code_ast: input.codeAst,
      event_types: input.eventTypes,
      priority: input.priority,
    };

    const data = await this.request<RawRule>('/rules', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapRule(data);
  }

  async updateRule(ruleId: number, input: Partial<GorgiasRuleCreateInput>): Promise<GorgiasRule> {
    const body: Record<string, unknown> = {};
    if (input.name) body.name = input.name;
    if (input.description !== undefined) body.description = input.description;
    if (input.code !== undefined) body.code = input.code;
    if (input.codeAst !== undefined) body.code_ast = input.codeAst;
    if (input.eventTypes) body.event_types = input.eventTypes;
    if (input.priority !== undefined) body.priority = input.priority;

    const data = await this.request<RawRule>(`/rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapRule(data);
  }

  async deleteRule(ruleId: number): Promise<void> {
    await this.request(`/rules/${ruleId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Integrations
  // ===========================================================================

  async listIntegrations(): Promise<GorgiasIntegration[]> {
    const data = await this.request<GorgiasListResponse<RawIntegration>>('/integrations');
    return data.data.map(mapIntegration);
  }

  async getIntegration(integrationId: number): Promise<GorgiasIntegration> {
    const data = await this.request<RawIntegration>(`/integrations/${integrationId}`);
    return mapIntegration(data);
  }

  async createIntegration(input: GorgiasIntegrationCreateInput): Promise<GorgiasIntegration> {
    const body = {
      name: input.name,
      type: input.type,
      http: input.http,
    };

    const data = await this.request<RawIntegration>('/integrations', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapIntegration(data);
  }

  async updateIntegration(
    integrationId: number,
    input: Partial<GorgiasIntegrationCreateInput>
  ): Promise<GorgiasIntegration> {
    const data = await this.request<RawIntegration>(`/integrations/${integrationId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });

    return mapIntegration(data);
  }

  async deleteIntegration(integrationId: number): Promise<void> {
    await this.request(`/integrations/${integrationId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Views
  // ===========================================================================

  async listViews(): Promise<GorgiasView[]> {
    const data = await this.request<GorgiasListResponse<RawView>>('/views');
    return data.data.map(mapView);
  }

  async getView(viewId: number): Promise<GorgiasView> {
    const data = await this.request<RawView>(`/views/${viewId}`);
    return mapView(data);
  }

  async createView(input: GorgiasViewCreateInput): Promise<GorgiasView> {
    const body = {
      name: input.name,
      filters: input.filters,
      order_by: input.orderBy,
      order_dir: input.orderDir,
      visibility: input.visibility,
      fields: input.fields,
      decoration: input.decoration,
    };

    const data = await this.request<RawView>('/views', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapView(data);
  }

  async updateView(viewId: number, input: Partial<GorgiasViewCreateInput>): Promise<GorgiasView> {
    const body: Record<string, unknown> = {};
    if (input.name) body.name = input.name;
    if (input.filters !== undefined) body.filters = input.filters;
    if (input.orderBy !== undefined) body.order_by = input.orderBy;
    if (input.orderDir !== undefined) body.order_dir = input.orderDir;
    if (input.visibility) body.visibility = input.visibility;
    if (input.fields) body.fields = input.fields;
    if (input.decoration) body.decoration = input.decoration;

    const data = await this.request<RawView>(`/views/${viewId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapView(data);
  }

  async deleteView(viewId: number): Promise<void> {
    await this.request(`/views/${viewId}`, { method: 'DELETE' });
  }

  async listViewItems(
    viewId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<GorgiasTicket>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);

    const data = await this.request<GorgiasListResponse<RawTicket>>(
      `/views/${viewId}/items?${queryParams}`
    );

    return {
      items: data.data.map(mapTicket),
      nextCursor: data.meta?.next_cursor,
    };
  }

  // ===========================================================================
  // Satisfaction Surveys
  // ===========================================================================

  async listSatisfactionSurveys(
    params?: SurveyListParams
  ): Promise<PaginatedResponse<GorgiasSatisfactionSurvey>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);
    if (params?.ticketId) queryParams.set('ticket_id', String(params.ticketId));
    if (params?.customerId) queryParams.set('customer_id', String(params.customerId));

    const data = await this.request<GorgiasListResponse<RawSatisfactionSurvey>>(
      `/satisfaction-surveys?${queryParams}`
    );

    return {
      items: data.data.map(mapSatisfactionSurvey),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getSatisfactionSurvey(surveyId: number): Promise<GorgiasSatisfactionSurvey> {
    const data = await this.request<RawSatisfactionSurvey>(`/satisfaction-surveys/${surveyId}`);
    return mapSatisfactionSurvey(data);
  }

  async createSatisfactionSurvey(
    input: GorgiasSatisfactionSurveyCreateInput
  ): Promise<GorgiasSatisfactionSurvey> {
    const body = {
      ticket_id: input.ticketId,
      customer_id: input.customerId,
      should_send_datetime: input.shouldSendDatetime,
    };

    const data = await this.request<RawSatisfactionSurvey>('/satisfaction-surveys', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapSatisfactionSurvey(data);
  }

  // ===========================================================================
  // Custom Fields
  // ===========================================================================

  async listCustomFields(params?: CustomFieldListParams): Promise<GorgiasCustomField[]> {
    const queryParams = new URLSearchParams();
    if (params?.objectType) queryParams.set('object_type', params.objectType);

    const data = await this.request<GorgiasListResponse<RawCustomField>>(
      `/custom-fields?${queryParams}`
    );
    return data.data.map(mapCustomField);
  }

  async getCustomField(fieldId: number): Promise<GorgiasCustomField> {
    const data = await this.request<RawCustomField>(`/custom-fields/${fieldId}`);
    return mapCustomField(data);
  }

  async createCustomField(input: GorgiasCustomFieldCreateInput): Promise<GorgiasCustomField> {
    const body = {
      object_type: input.objectType,
      label: input.label,
      description: input.description,
      priority: input.priority,
      required: input.required,
      definition: input.definition,
    };

    const data = await this.request<RawCustomField>('/custom-fields', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapCustomField(data);
  }

  async updateCustomField(
    fieldId: number,
    input: Partial<GorgiasCustomFieldCreateInput>
  ): Promise<GorgiasCustomField> {
    const body: Record<string, unknown> = {};
    if (input.label) body.label = input.label;
    if (input.description !== undefined) body.description = input.description;
    if (input.priority !== undefined) body.priority = input.priority;
    if (input.required !== undefined) body.required = input.required;
    if (input.definition) body.definition = input.definition;

    const data = await this.request<RawCustomField>(`/custom-fields/${fieldId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapCustomField(data);
  }

  // ===========================================================================
  // Events
  // ===========================================================================

  async listEvents(params?: EventListParams): Promise<PaginatedResponse<GorgiasEvent>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);
    if (params?.objectType) queryParams.set('object_type', params.objectType);
    if (params?.objectId) queryParams.set('object_id', String(params.objectId));
    if (params?.type) queryParams.set('type', params.type);

    const data = await this.request<GorgiasListResponse<RawEvent>>(`/events?${queryParams}`);

    return {
      items: data.data.map(mapEvent),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getEvent(eventId: number): Promise<GorgiasEvent> {
    const data = await this.request<RawEvent>(`/events/${eventId}`);
    return mapEvent(data);
  }

  // ===========================================================================
  // Jobs
  // ===========================================================================

  async listJobs(params?: PaginationParams): Promise<PaginatedResponse<GorgiasJob>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.cursor) queryParams.set('cursor', params.cursor);

    const data = await this.request<GorgiasListResponse<RawJob>>(`/jobs?${queryParams}`);

    return {
      items: data.data.map(mapJob),
      nextCursor: data.meta?.next_cursor,
    };
  }

  async getJob(jobId: number): Promise<GorgiasJob> {
    const data = await this.request<RawJob>(`/jobs/${jobId}`);
    return mapJob(data);
  }

  async createJob(input: GorgiasJobCreateInput): Promise<GorgiasJob> {
    const body = {
      type: input.type,
      params: input.params,
      scheduled_datetime: input.scheduledDatetime,
    };

    const data = await this.request<RawJob>('/jobs', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapJob(data);
  }

  async cancelJob(jobId: number): Promise<void> {
    await this.request(`/jobs/${jobId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Widgets
  // ===========================================================================

  async listWidgets(): Promise<GorgiasWidget[]> {
    const data = await this.request<GorgiasListResponse<RawWidget>>('/widgets');
    return data.data.map(mapWidget);
  }

  async getWidget(widgetId: number): Promise<GorgiasWidget> {
    const data = await this.request<RawWidget>(`/widgets/${widgetId}`);
    return mapWidget(data);
  }

  async createWidget(input: GorgiasWidgetCreateInput): Promise<GorgiasWidget> {
    const body = {
      context: input.context,
      template: input.template,
      order: input.order,
      integration_id: input.integrationId,
    };

    const data = await this.request<RawWidget>('/widgets', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return mapWidget(data);
  }

  async updateWidget(
    widgetId: number,
    input: Partial<GorgiasWidgetCreateInput>
  ): Promise<GorgiasWidget> {
    const body: Record<string, unknown> = {};
    if (input.context) body.context = input.context;
    if (input.template) body.template = input.template;
    if (input.order !== undefined) body.order = input.order;
    if (input.integrationId !== undefined) body.integration_id = input.integrationId;

    const data = await this.request<RawWidget>(`/widgets/${widgetId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return mapWidget(data);
  }

  async deleteWidget(widgetId: number): Promise<void> {
    await this.request(`/widgets/${widgetId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Statistics
  // ===========================================================================

  async getStatistic(name: string, params: StatisticParams): Promise<GorgiasStatistic> {
    const body = {
      start_datetime: params.startDatetime,
      end_datetime: params.endDatetime,
      timezone: params.timezone,
    };

    const data = await this.request<{
      data: Record<string, unknown>;
      meta: {
        start_datetime: string;
        end_datetime: string;
        previous_start_datetime: string | null;
        previous_end_datetime: string | null;
      };
    }>(`/stats/${name}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      data: data.data,
      meta: {
        startDatetime: data.meta.start_datetime,
        endDatetime: data.meta.end_datetime,
        previousStartDatetime: data.meta.previous_start_datetime,
        previousEndDatetime: data.meta.previous_end_datetime,
      },
    };
  }
}

// =============================================================================
// Raw API Types (snake_case from API)
// =============================================================================

interface RawTicket {
  id: number;
  external_id: string | null;
  subject: string | null;
  status: 'open' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  channel: string;
  via: string;
  from_agent: boolean;
  customer: { id: number; email: string | null; name: string | null } | null;
  assignee_user: { id: number; email: string | null; name: string | null } | null;
  assignee_team: { id: number; name: string } | null;
  messages_count: number;
  is_unread: boolean;
  spam: string | null;
  created_datetime: string;
  updated_datetime: string;
  opened_datetime: string | null;
  closed_datetime: string | null;
  last_received_message_datetime: string | null;
  last_message_datetime: string | null;
  snooze_datetime: string | null;
  tags: Array<{ id: number; name: string }>;
  uri: string;
}

interface RawTicketWithMessages extends RawTicket {
  messages: RawMessage[];
}

interface RawMessage {
  id: number;
  ticket_id: number;
  channel: string;
  via: string;
  from_agent: boolean;
  sender: { id: number; email: string | null; name: string | null; type?: 'customer' | 'user' };
  receiver: {
    id: number;
    email: string | null;
    name: string | null;
    type?: 'customer' | 'user';
  } | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  stripped_text: string | null;
  stripped_html: string | null;
  public_html: string | null;
  attachments: Array<{ url: string; name: string; size: number; content_type: string }>;
  actions: Array<{ type: string; label: string; url?: string }>;
  headers: Record<string, string>;
  macro_id: number | null;
  rule_id: number | null;
  integrations: Record<string, unknown>;
  created_datetime: string;
  sent_datetime: string | null;
  failed_datetime: string | null;
  opened_datetime: string | null;
  uri: string;
}

interface RawCustomer {
  id: number;
  external_id: string | null;
  email: string | null;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  note: string | null;
  language: string | null;
  timezone: string | null;
  data: Record<string, unknown>;
  channels: Array<{
    id: number;
    type: string;
    address: string;
    preferred: boolean;
    created_datetime: string;
  }>;
  integrations: Record<string, unknown>;
  meta: Record<string, unknown>;
  tickets_count: number;
  created_datetime: string;
  updated_datetime: string;
  uri: string;
}

interface RawUser {
  id: number;
  external_id: string | null;
  email: string;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  role: { id: number; name: string };
  bio: string | null;
  active: boolean;
  timezone: string | null;
  language: string | null;
  country: string | null;
  meta: Record<string, unknown>;
  created_datetime: string;
  updated_datetime: string | null;
  uri: string;
}

interface RawTeam {
  id: number;
  name: string;
  description: string | null;
  decoration: { emoji?: string } | null;
  members: Array<{ id: number; email: string | null; name: string | null }>;
  created_datetime: string;
  uri: string;
}

interface RawTag {
  id: number;
  name: string;
  description: string | null;
  decoration: { color?: string } | null;
  usage: number;
  created_datetime: string;
  deleted_datetime: string | null;
  uri: string;
}

interface RawMacro {
  id: number;
  external_id: string | null;
  name: string;
  intent: string | null;
  language: string | null;
  usage: number;
  actions: Array<{ type: string; args: Record<string, unknown> }>;
  created_datetime: string;
  updated_datetime: string | null;
  archived_datetime: string | null;
  uri: string;
}

interface RawRule {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  code_ast: Record<string, unknown> | null;
  event_types: string;
  priority: number;
  created_datetime: string;
  updated_datetime: string | null;
  deactivated_datetime: string | null;
  uri: string;
}

interface RawIntegration {
  id: number;
  name: string;
  type: string;
  http: {
    url: string;
    method: string;
    headers: Record<string, string>;
    triggers: Record<string, unknown>;
  } | null;
  created_datetime: string;
  updated_datetime: string | null;
  managed: boolean;
  business_hours_id: number | null;
  uri: string;
}

interface RawView {
  id: number;
  name: string;
  slug: string | null;
  filters: string | null;
  order_by: string | null;
  order_dir: 'asc' | 'desc' | null;
  visibility: 'public' | 'shared' | 'private';
  fields: string[] | null;
  decoration: { emoji?: string } | null;
  created_datetime: string;
  updated_datetime: string | null;
  uri: string;
}

interface RawSatisfactionSurvey {
  id: number;
  score: number | null;
  body_text: string | null;
  customer_id: number;
  ticket_id: number;
  meta: Record<string, unknown>;
  created_datetime: string;
  sent_datetime: string | null;
  scored_datetime: string | null;
  should_send_datetime: string | null;
  uri: string;
}

interface RawCustomField {
  id: number;
  external_id: string | null;
  object_type: 'ticket' | 'customer';
  label: string;
  description: string | null;
  priority: number;
  required: boolean | null;
  managed_type: string | null;
  definition: { type: string; choices?: Array<{ value: string; label: string }> };
  created_datetime: string;
  updated_datetime: string | null;
  deactivated_datetime: string | null;
  uri: string;
}

interface RawEvent {
  id: number;
  context: string;
  type: string;
  object_id: number;
  object_type: string;
  user_id: number | null;
  data: Record<string, unknown>;
  created_datetime: string;
  uri: string;
}

interface RawJob {
  id: number;
  type: string;
  status:
    | 'pending'
    | 'running'
    | 'scheduled'
    | 'done'
    | 'canceled'
    | 'errored'
    | 'fatal_errored'
    | 'cancel_requested';
  params: Record<string, unknown>;
  info: Record<string, unknown>;
  scheduled_datetime: string | null;
  completed_datetime: string | null;
  created_datetime: string;
  updated_datetime: string | null;
  uri: string;
}

interface RawWidget {
  id: number;
  context: 'ticket' | 'customer' | 'user';
  template: string;
  order: number;
  integration_id: number | null;
  app_id: number | null;
  created_datetime: string;
  updated_datetime: string | null;
  uri: string;
}

// =============================================================================
// Mapping Functions
// =============================================================================

function mapTicket(raw: RawTicket): GorgiasTicket {
  return {
    id: raw.id,
    externalId: raw.external_id,
    subject: raw.subject,
    status: raw.status,
    priority: raw.priority,
    channel: raw.channel,
    via: raw.via,
    fromAgent: raw.from_agent,
    customer: raw.customer,
    assigneeUser: raw.assignee_user,
    assigneeTeam: raw.assignee_team,
    messagesCount: raw.messages_count,
    isUnread: raw.is_unread,
    spamStatus: raw.spam,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    openedDatetime: raw.opened_datetime,
    closedDatetime: raw.closed_datetime,
    lastReceivedMessageDatetime: raw.last_received_message_datetime,
    lastMessageDatetime: raw.last_message_datetime,
    snoozeUntilDatetime: raw.snooze_datetime,
    tags: raw.tags,
    uri: raw.uri,
  };
}

function mapTicketWithMessages(raw: RawTicketWithMessages): GorgiasTicketWithMessages {
  return {
    ...mapTicket(raw),
    messages: raw.messages.map(mapMessage),
  };
}

function mapMessage(raw: RawMessage): GorgiasMessage {
  return {
    id: raw.id,
    ticketId: raw.ticket_id,
    channel: raw.channel,
    via: raw.via,
    fromAgent: raw.from_agent,
    sender: raw.sender,
    receiver: raw.receiver,
    subject: raw.subject,
    bodyText: raw.body_text,
    bodyHtml: raw.body_html,
    strippedText: raw.stripped_text,
    strippedHtml: raw.stripped_html,
    publicHtml: raw.public_html,
    attachments: raw.attachments.map((a) => ({
      url: a.url,
      name: a.name,
      size: a.size,
      contentType: a.content_type,
    })),
    actions: raw.actions,
    headers: raw.headers,
    macroId: raw.macro_id,
    ruleId: raw.rule_id,
    integrationsData: raw.integrations,
    createdDatetime: raw.created_datetime,
    sentDatetime: raw.sent_datetime,
    failedDatetime: raw.failed_datetime,
    openedDatetime: raw.opened_datetime,
    uri: raw.uri,
  };
}

function mapCustomer(raw: RawCustomer): GorgiasCustomer {
  return {
    id: raw.id,
    externalId: raw.external_id,
    email: raw.email,
    name: raw.name,
    firstname: raw.firstname,
    lastname: raw.lastname,
    note: raw.note,
    language: raw.language,
    timezone: raw.timezone,
    data: raw.data,
    channels: raw.channels.map((c) => ({
      id: c.id,
      type: c.type,
      address: c.address,
      preferred: c.preferred,
      createdDatetime: c.created_datetime,
    })),
    integrations: raw.integrations,
    meta: raw.meta,
    ticketsCount: raw.tickets_count,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    uri: raw.uri,
  };
}

function mapUser(raw: RawUser): GorgiasUser {
  return {
    id: raw.id,
    externalId: raw.external_id,
    email: raw.email,
    name: raw.name,
    firstname: raw.firstname,
    lastname: raw.lastname,
    role: raw.role,
    bio: raw.bio,
    active: raw.active,
    timezone: raw.timezone,
    language: raw.language,
    country: raw.country,
    meta: raw.meta,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    uri: raw.uri,
  };
}

function mapTeam(raw: RawTeam): GorgiasTeam {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    decoration: raw.decoration,
    members: raw.members,
    createdDatetime: raw.created_datetime,
    uri: raw.uri,
  };
}

function mapTag(raw: RawTag): GorgiasTag {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    decoration: raw.decoration,
    usage: raw.usage,
    createdDatetime: raw.created_datetime,
    deletedDatetime: raw.deleted_datetime,
    uri: raw.uri,
  };
}

function mapMacro(raw: RawMacro): GorgiasMacro {
  return {
    id: raw.id,
    externalId: raw.external_id,
    name: raw.name,
    intent: raw.intent,
    language: raw.language,
    usage: raw.usage,
    actions: raw.actions,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    archivedDatetime: raw.archived_datetime,
    uri: raw.uri,
  };
}

function mapRule(raw: RawRule): GorgiasRule {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    code: raw.code,
    codeAst: raw.code_ast,
    eventTypes: raw.event_types,
    priority: raw.priority,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    deactivatedDatetime: raw.deactivated_datetime,
    uri: raw.uri,
  };
}

function mapIntegration(raw: RawIntegration): GorgiasIntegration {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    http: raw.http,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    managed: raw.managed,
    businessHoursId: raw.business_hours_id,
    uri: raw.uri,
  };
}

function mapView(raw: RawView): GorgiasView {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    filters: raw.filters,
    orderBy: raw.order_by,
    orderDir: raw.order_dir,
    visibility: raw.visibility,
    fields: raw.fields,
    decoration: raw.decoration,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    uri: raw.uri,
  };
}

function mapSatisfactionSurvey(raw: RawSatisfactionSurvey): GorgiasSatisfactionSurvey {
  return {
    id: raw.id,
    score: raw.score,
    bodyText: raw.body_text,
    customerId: raw.customer_id,
    ticketId: raw.ticket_id,
    meta: raw.meta,
    createdDatetime: raw.created_datetime,
    sentDatetime: raw.sent_datetime,
    scoredDatetime: raw.scored_datetime,
    shouldSendDatetime: raw.should_send_datetime,
    uri: raw.uri,
  };
}

function mapCustomField(raw: RawCustomField): GorgiasCustomField {
  return {
    id: raw.id,
    externalId: raw.external_id,
    objectType: raw.object_type,
    label: raw.label,
    description: raw.description,
    priority: raw.priority,
    required: raw.required,
    managedType: raw.managed_type,
    definition: raw.definition,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    deactivatedDatetime: raw.deactivated_datetime,
    uri: raw.uri,
  };
}

function mapEvent(raw: RawEvent): GorgiasEvent {
  return {
    id: raw.id,
    context: raw.context,
    type: raw.type,
    objectId: raw.object_id,
    objectType: raw.object_type,
    userId: raw.user_id,
    data: raw.data,
    createdDatetime: raw.created_datetime,
    uri: raw.uri,
  };
}

function mapJob(raw: RawJob): GorgiasJob {
  return {
    id: raw.id,
    type: raw.type,
    status: raw.status,
    params: raw.params,
    info: raw.info,
    scheduledDatetime: raw.scheduled_datetime,
    completedDatetime: raw.completed_datetime,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    uri: raw.uri,
  };
}

function mapWidget(raw: RawWidget): GorgiasWidget {
  return {
    id: raw.id,
    context: raw.context,
    template: raw.template,
    order: raw.order,
    integrationId: raw.integration_id,
    appId: raw.app_id,
    createdDatetime: raw.created_datetime,
    updatedDatetime: raw.updated_datetime,
    uri: raw.uri,
  };
}

// =============================================================================
// Factory Function
// =============================================================================

export function createGorgiasClient(credentials: GorgiasCredentials): GorgiasClient {
  return new GorgiasClientImpl(credentials);
}
