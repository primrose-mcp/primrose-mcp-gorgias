/**
 * Gorgias Entity Types
 *
 * Type definitions for Gorgias helpdesk entities.
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

// =============================================================================
// Ticket
// =============================================================================

export interface GorgiasTicket {
  id: number;
  externalId: string | null;
  subject: string | null;
  status: 'open' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  channel: string;
  via: string;
  fromAgent: boolean;
  customer: GorgiasCustomerRef | null;
  assigneeUser: GorgiasUserRef | null;
  assigneeTeam: GorgiasTeamRef | null;
  messagesCount: number;
  isUnread: boolean;
  spamStatus: string | null;
  createdDatetime: string;
  updatedDatetime: string;
  openedDatetime: string | null;
  closedDatetime: string | null;
  lastReceivedMessageDatetime: string | null;
  lastMessageDatetime: string | null;
  snoozeUntilDatetime: string | null;
  tags: GorgiasTagRef[];
  uri: string;
}

export interface GorgiasTicketWithMessages extends GorgiasTicket {
  messages: GorgiasMessage[];
}

export interface GorgiasTicketCreateInput {
  channel: string;
  customerId?: number;
  customerEmail?: string;
  subject?: string;
  messages: GorgiasMessageInput[];
}

export interface GorgiasTicketUpdateInput {
  status?: 'open' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assigneeUserId?: number | null;
  assigneeTeamId?: number | null;
  snoozeUntilDatetime?: string | null;
}

// =============================================================================
// Message
// =============================================================================

export interface GorgiasMessage {
  id: number;
  ticketId: number;
  channel: string;
  via: string;
  fromAgent: boolean;
  sender: GorgiasSenderRef;
  receiver: GorgiasSenderRef | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  strippedText: string | null;
  strippedHtml: string | null;
  publicHtml: string | null;
  attachments: GorgiasAttachment[];
  actions: GorgiasAction[];
  headers: Record<string, string>;
  macroId: number | null;
  ruleId: number | null;
  integrationsData: Record<string, unknown>;
  createdDatetime: string;
  sentDatetime: string | null;
  failedDatetime: string | null;
  openedDatetime: string | null;
  uri: string;
}

export interface GorgiasMessageInput {
  channel: string;
  via: string;
  bodyText?: string;
  bodyHtml?: string;
  fromAgent?: boolean;
  senderId?: number;
  receiverId?: number;
  subject?: string;
}

export interface GorgiasMessageCreateInput {
  ticketId: number;
  channel: string;
  via: string;
  bodyText?: string;
  bodyHtml?: string;
  fromAgent?: boolean;
  senderId?: number;
  receiverId?: number;
  subject?: string;
}

export interface GorgiasAttachment {
  url: string;
  name: string;
  size: number;
  contentType: string;
}

export interface GorgiasAction {
  type: string;
  label: string;
  url?: string;
}

// =============================================================================
// Customer
// =============================================================================

export interface GorgiasCustomer {
  id: number;
  externalId: string | null;
  email: string | null;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  note: string | null;
  language: string | null;
  timezone: string | null;
  data: Record<string, unknown>;
  channels: GorgiasChannel[];
  integrations: Record<string, unknown>;
  meta: Record<string, unknown>;
  ticketsCount: number;
  createdDatetime: string;
  updatedDatetime: string;
  uri: string;
}

export interface GorgiasCustomerCreateInput {
  email?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  externalId?: string;
  note?: string;
  language?: string;
  timezone?: string;
  data?: Record<string, unknown>;
  channels?: GorgiasChannelInput[];
}

export interface GorgiasCustomerUpdateInput {
  email?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  externalId?: string;
  note?: string;
  language?: string;
  timezone?: string;
  data?: Record<string, unknown>;
}

export interface GorgiasChannel {
  id: number;
  type: string;
  address: string;
  preferred: boolean;
  createdDatetime: string;
}

export interface GorgiasChannelInput {
  type: string;
  address: string;
  preferred?: boolean;
}

// =============================================================================
// User (Agent)
// =============================================================================

export interface GorgiasUser {
  id: number;
  externalId: string | null;
  email: string;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  role: GorgiasRole;
  bio: string | null;
  active: boolean;
  timezone: string | null;
  language: string | null;
  country: string | null;
  meta: Record<string, unknown>;
  createdDatetime: string;
  updatedDatetime: string | null;
  uri: string;
}

export interface GorgiasRole {
  id: number;
  name: string;
}

export interface GorgiasUserCreateInput {
  email: string;
  firstname?: string;
  lastname?: string;
  roleId?: number;
  timezone?: string;
  language?: string;
}

// =============================================================================
// Team
// =============================================================================

export interface GorgiasTeam {
  id: number;
  name: string;
  description: string | null;
  decoration: GorgiasDecoration | null;
  members: GorgiasUserRef[];
  createdDatetime: string;
  uri: string;
}

export interface GorgiasTeamCreateInput {
  name: string;
  description?: string;
  decoration?: GorgiasDecoration;
  memberIds?: number[];
}

// =============================================================================
// Tag
// =============================================================================

export interface GorgiasTag {
  id: number;
  name: string;
  description: string | null;
  decoration: GorgiasColorDecoration | null;
  usage: number;
  createdDatetime: string;
  deletedDatetime: string | null;
  uri: string;
}

export interface GorgiasTagCreateInput {
  name: string;
  description?: string;
  decoration?: GorgiasColorDecoration;
}

// =============================================================================
// Macro
// =============================================================================

export interface GorgiasMacro {
  id: number;
  externalId: string | null;
  name: string;
  intent: string | null;
  language: string | null;
  usage: number;
  actions: GorgiasMacroAction[];
  createdDatetime: string;
  updatedDatetime: string | null;
  archivedDatetime: string | null;
  uri: string;
}

export interface GorgiasMacroAction {
  type: string;
  args: Record<string, unknown>;
}

export interface GorgiasMacroCreateInput {
  name: string;
  actions: GorgiasMacroAction[];
  intent?: string;
  language?: string;
}

// =============================================================================
// Rule
// =============================================================================

export interface GorgiasRule {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  codeAst: Record<string, unknown> | null;
  eventTypes: string;
  priority: number;
  createdDatetime: string;
  updatedDatetime: string | null;
  deactivatedDatetime: string | null;
  uri: string;
}

export interface GorgiasRuleCreateInput {
  name: string;
  description?: string;
  code?: string;
  codeAst?: Record<string, unknown>;
  eventTypes: string;
  priority?: number;
}

// =============================================================================
// Integration
// =============================================================================

export interface GorgiasIntegration {
  id: number;
  name: string;
  type: string;
  http: GorgiasHttpConfig | null;
  createdDatetime: string;
  updatedDatetime: string | null;
  managed: boolean;
  businessHoursId: number | null;
  uri: string;
}

export interface GorgiasHttpConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  triggers: Record<string, unknown>;
}

export interface GorgiasIntegrationCreateInput {
  name: string;
  type: string;
  http?: GorgiasHttpConfig;
}

// =============================================================================
// View
// =============================================================================

export interface GorgiasView {
  id: number;
  name: string;
  slug: string | null;
  filters: string | null;
  orderBy: string | null;
  orderDir: 'asc' | 'desc' | null;
  visibility: 'public' | 'shared' | 'private';
  fields: string[] | null;
  decoration: GorgiasDecoration | null;
  createdDatetime: string;
  updatedDatetime: string | null;
  uri: string;
}

export interface GorgiasViewCreateInput {
  name: string;
  filters?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  visibility?: 'public' | 'shared' | 'private';
  fields?: string[];
  decoration?: GorgiasDecoration;
}

// =============================================================================
// Satisfaction Survey
// =============================================================================

export interface GorgiasSatisfactionSurvey {
  id: number;
  score: number | null;
  bodyText: string | null;
  customerId: number;
  ticketId: number;
  meta: Record<string, unknown>;
  createdDatetime: string;
  sentDatetime: string | null;
  scoredDatetime: string | null;
  shouldSendDatetime: string | null;
  uri: string;
}

export interface GorgiasSatisfactionSurveyCreateInput {
  ticketId: number;
  customerId: number;
  shouldSendDatetime?: string;
}

// =============================================================================
// Custom Field
// =============================================================================

export interface GorgiasCustomField {
  id: number;
  externalId: string | null;
  objectType: 'ticket' | 'customer';
  label: string;
  description: string | null;
  priority: number;
  required: boolean | null;
  managedType: string | null;
  definition: GorgiasCustomFieldDefinition;
  createdDatetime: string;
  updatedDatetime: string | null;
  deactivatedDatetime: string | null;
  uri: string;
}

export interface GorgiasCustomFieldDefinition {
  type: string;
  choices?: Array<{ value: string; label: string }>;
}

export interface GorgiasCustomFieldCreateInput {
  objectType: 'ticket' | 'customer';
  label: string;
  description?: string;
  priority?: number;
  required?: boolean;
  definition: GorgiasCustomFieldDefinition;
}

// =============================================================================
// Event
// =============================================================================

export interface GorgiasEvent {
  id: number;
  context: string;
  type: string;
  objectId: number;
  objectType: string;
  userId: number | null;
  data: Record<string, unknown>;
  createdDatetime: string;
  uri: string;
}

// =============================================================================
// Job
// =============================================================================

export interface GorgiasJob {
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
  scheduledDatetime: string | null;
  completedDatetime: string | null;
  createdDatetime: string;
  updatedDatetime: string | null;
  uri: string;
}

export interface GorgiasJobCreateInput {
  type: string;
  params: Record<string, unknown>;
  scheduledDatetime?: string;
}

// =============================================================================
// Widget
// =============================================================================

export interface GorgiasWidget {
  id: number;
  context: 'ticket' | 'customer' | 'user';
  template: string;
  order: number;
  integrationId: number | null;
  appId: number | null;
  createdDatetime: string;
  updatedDatetime: string | null;
  uri: string;
}

export interface GorgiasWidgetCreateInput {
  context: 'ticket' | 'customer' | 'user';
  template: string;
  order?: number;
  integrationId?: number;
}

// =============================================================================
// Account
// =============================================================================

export interface GorgiasAccount {
  domain: string;
  status: GorgiasAccountStatus;
  settings: GorgiasAccountSetting[];
  createdDatetime: string;
  deactivatedDatetime: string | null;
}

export interface GorgiasAccountStatus {
  active: boolean;
  reason: string | null;
}

export interface GorgiasAccountSetting {
  id: number;
  key: string;
  value: unknown;
}

// =============================================================================
// Statistics
// =============================================================================

export interface GorgiasStatistic {
  data: Record<string, unknown>;
  meta: GorgiasStatisticMeta;
}

export interface GorgiasStatisticMeta {
  startDatetime: string;
  endDatetime: string;
  previousStartDatetime: string | null;
  previousEndDatetime: string | null;
}

// =============================================================================
// Reference Types (for embedded objects)
// =============================================================================

export interface GorgiasCustomerRef {
  id: number;
  email: string | null;
  name: string | null;
}

export interface GorgiasUserRef {
  id: number;
  email: string | null;
  name: string | null;
}

export interface GorgiasTeamRef {
  id: number;
  name: string;
}

export interface GorgiasTagRef {
  id: number;
  name: string;
}

export interface GorgiasSenderRef {
  id: number;
  email: string | null;
  name: string | null;
  type?: 'customer' | 'user';
}

// =============================================================================
// Decorations
// =============================================================================

export interface GorgiasDecoration {
  emoji?: string;
}

export interface GorgiasColorDecoration {
  color?: string;
}

// =============================================================================
// Response Format
// =============================================================================

export type ResponseFormat = 'json' | 'markdown';
