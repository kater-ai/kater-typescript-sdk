// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../../core/resource';
import * as CredentialsAPI from './credentials';
import { CredentialRevokeParams, Credentials } from './credentials';
import * as OAuthAPI from './oauth';
import { OAuth, OAuthInitiateParams, OAuthInitiateResponse } from './oauth';
import { APIPromise } from '../../../../../core/api-promise';
import { RequestOptions } from '../../../../../internal/request-options';
import { path } from '../../../../../internal/utils/path';

/**
 * Tenant MCP credential management
 */
export class Mcp extends APIResource {
  credentials: CredentialsAPI.Credentials = new CredentialsAPI.Credentials(this._client);
  oauth: OAuthAPI.OAuth = new OAuthAPI.OAuth(this._client);

  /**
   * List active MCP servers for the client with per-user connection status.
   *
   * Returns servers where status='active', enabled=true, deleted_at IS NULL. For
   * auth_type='none' servers, connection_status is always "connected". For other
   * servers, connection status reflects the user's credential state.
   */
  list(query: McpListParams, options?: RequestOptions): APIPromise<McpListResponse> {
    return this._client.get('/api/v1/tenant/mcp', { query, ...options, __security: { propelAuth: true } });
  }

  /**
   * Get credential audit history for the current user's MCP server connection.
   *
   * Returns audit records across all credential rotations using the shared
   * credential_key, ordered by created_at DESC.
   */
  getAuditHistory(
    mcpID: string,
    query: McpGetAuditHistoryParams,
    options?: RequestOptions,
  ): APIPromise<McpGetAuditHistoryResponse> {
    return this._client.get(path`/api/v1/tenant/mcp/${mcpID}/audit`, {
      query,
      ...options,
      __security: { propelAuth: true },
    });
  }
}

export type McpListResponse = Array<McpListResponse.McpListResponseItem>;

export namespace McpListResponse {
  /**
   * Response model for a tenant-visible MCP server with connection status.
   */
  export interface McpListResponseItem {
    /**
     * Authentication type for MCP server connections.
     */
    auth_type: 'api_key' | 'oauth2' | 'none';

    connection_status: string;

    mcp_id: string;

    name: string;

    slug: string;

    description?: string | null;
  }
}

/**
 * Paginated response for credential audit history.
 */
export interface McpGetAuditHistoryResponse {
  items: Array<McpGetAuditHistoryResponse.Item>;

  next_cursor?: string | null;
}

export namespace McpGetAuditHistoryResponse {
  /**
   * Response model for a single credential audit record.
   */
  export interface Item {
    id: string;

    action: string;

    actor_id: string;

    created_at: string;

    actor_ip?: string | null;

    metadata?: { [key: string]: unknown } | null;
  }
}

export interface McpListParams {
  tenant_id: string;

  tenant_user_id: string;
}

export interface McpGetAuditHistoryParams {
  tenant_id: string;

  tenant_user_id: string;

  cursor?: string | null;

  limit?: number;
}

Mcp.Credentials = Credentials;
Mcp.OAuth = OAuth;

export declare namespace Mcp {
  export {
    type McpListResponse as McpListResponse,
    type McpGetAuditHistoryResponse as McpGetAuditHistoryResponse,
    type McpListParams as McpListParams,
    type McpGetAuditHistoryParams as McpGetAuditHistoryParams,
  };

  export { Credentials as Credentials, type CredentialRevokeParams as CredentialRevokeParams };

  export {
    OAuth as OAuth,
    type OAuthInitiateResponse as OAuthInitiateResponse,
    type OAuthInitiateParams as OAuthInitiateParams,
  };
}
