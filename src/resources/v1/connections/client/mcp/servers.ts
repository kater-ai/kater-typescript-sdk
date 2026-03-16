// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../../core/resource';
import { APIPromise } from '../../../../../core/api-promise';
import { buildHeaders } from '../../../../../internal/headers';
import { RequestOptions } from '../../../../../internal/request-options';
import { path } from '../../../../../internal/utils/path';

/**
 * Manage MCP server integrations
 */
export class Servers extends APIResource {
  /**
   * Register a new MCP server for the client organization.
   *
   * Validates URL safety (SSRF prevention), slug format, and OAuth fields. The MCP
   * server is NOT contacted during registration.
   */
  create(body: ServerCreateParams, options?: RequestOptions): APIPromise<ServerCreateResponse> {
    return this._client.post('/api/v1/client/mcp/servers', {
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }

  /**
   * Activate an MCP server by selecting capabilities to expose.
   *
   * Validates that all submitted capability names exist in the server's discovered
   * capabilities. Sets status to 'active' when allowed_capabilities is non-empty.
   */
  update(
    mcpID: string,
    body: ServerUpdateParams,
    options?: RequestOptions,
  ): APIPromise<ServerUpdateResponse> {
    return this._client.put(path`/api/v1/client/mcp/servers/${mcpID}`, {
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }

  /**
   * List all MCP servers for the authenticated client.
   *
   * RLS automatically scopes results to the client's organization. Only non-deleted
   * servers are returned.
   */
  list(options?: RequestOptions): APIPromise<ServerListResponse> {
    return this._client.get('/api/v1/client/mcp/servers', { ...options, __security: { propelAuth: true } });
  }

  /**
   * Soft-delete an MCP server and cascade to credential settings.
   *
   * Cascades:
   *
   * 1. All mcp_credential_settings rows set to status='revoked' + deleted_at
   * 2. OAuth client secret credential soft-deleted (if exists)
   * 3. MCP server row soft-deleted
   */
  delete(mcpID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/client/mcp/servers/${mcpID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: { propelAuth: true },
    });
  }

  /**
   * Discover capabilities from a registered MCP server.
   *
   * For api_key servers with a stored credential, uses the API key for discovery.
   * Discovery does NOT change server status.
   */
  discover(
    mcpID: string,
    body: ServerDiscoverParams,
    options?: RequestOptions,
  ): APIPromise<ServerDiscoverResponse> {
    return this._client.post(path`/api/v1/client/mcp/servers/${mcpID}/discover`, {
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }

  /**
   * Re-discover capabilities and merge with existing data.
   *
   * New capabilities are added. Existing capabilities that are in
   * allowed_capabilities preserve their is_write classification. The
   * allowed_capabilities list and status are NOT modified.
   */
  rediscover(
    mcpID: string,
    body: ServerRediscoverParams,
    options?: RequestOptions,
  ): APIPromise<ServerRediscoverResponse> {
    return this._client.post(path`/api/v1/client/mcp/servers/${mcpID}/rediscover`, {
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }

  /**
   * Replace the shared API key credential for an api_key MCP server.
   *
   * Soft-deletes the old credential and creates a new one.
   */
  updateAPIKey(mcpID: string, body: ServerUpdateAPIKeyParams, options?: RequestOptions): APIPromise<void> {
    return this._client.put(path`/api/v1/client/mcp/servers/${mcpID}/api-key`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: { propelAuth: true },
    });
  }

  /**
   * Update the configuration of a registered MCP server.
   *
   * Slug is not editable (used in tool naming). Changing server_url or auth_type
   * resets server to pending_setup and revokes all tenant credential settings.
   */
  updateConfig(
    mcpID: string,
    body: ServerUpdateConfigParams,
    options?: RequestOptions,
  ): APIPromise<ServerUpdateConfigResponse> {
    return this._client.patch(path`/api/v1/client/mcp/servers/${mcpID}/config`, {
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }
}

/**
 * Response model for a registered MCP server.
 */
export interface ServerCreateResponse {
  id: string;

  allowed_capabilities: Array<unknown>;

  /**
   * Authentication type for MCP server connections.
   */
  auth_type: 'api_key' | 'oauth2' | 'none';

  capabilities: Array<unknown>;

  created_at: string;

  enabled: boolean;

  name: string;

  server_url: string;

  slug: string;

  /**
   * Lifecycle status of an MCP server registration.
   */
  status: 'pending_setup' | 'active';

  /**
   * Transport protocol for MCP server communication.
   */
  transport: 'auto' | 'streamable_http' | 'sse';
}

/**
 * Response model for a registered MCP server.
 */
export interface ServerUpdateResponse {
  id: string;

  allowed_capabilities: Array<unknown>;

  /**
   * Authentication type for MCP server connections.
   */
  auth_type: 'api_key' | 'oauth2' | 'none';

  capabilities: Array<unknown>;

  created_at: string;

  enabled: boolean;

  name: string;

  server_url: string;

  slug: string;

  /**
   * Lifecycle status of an MCP server registration.
   */
  status: 'pending_setup' | 'active';

  /**
   * Transport protocol for MCP server communication.
   */
  transport: 'auto' | 'streamable_http' | 'sse';
}

export type ServerListResponse = Array<ServerListResponse.ServerListResponseItem>;

export namespace ServerListResponse {
  /**
   * Response model for a single server in the list.
   */
  export interface ServerListResponseItem {
    id: string;

    allowed_capabilities_count: number;

    /**
     * Authentication type for MCP server connections.
     */
    auth_type: 'api_key' | 'oauth2' | 'none';

    capabilities_count: number;

    created_at: string;

    enabled: boolean;

    name: string;

    server_url: string;

    slug: string;

    /**
     * Lifecycle status of an MCP server registration.
     */
    status: 'pending_setup' | 'active';

    /**
     * Transport protocol for MCP server communication.
     */
    transport: 'auto' | 'streamable_http' | 'sse';

    allowed_capabilities?: Array<unknown>;

    capabilities?: Array<unknown>;

    description?: string | null;

    oauth_authorize_url?: string | null;

    oauth_client_id?: string | null;

    oauth_revoke_url?: string | null;

    oauth_scopes_requested?: string | null;

    oauth_token_url?: string | null;
  }
}

/**
 * Response model for MCP server capability discovery.
 */
export interface ServerDiscoverResponse {
  capabilities: Array<{ [key: string]: unknown }>;

  capabilities_count: number;

  /**
   * Lifecycle status of an MCP server registration.
   */
  status: 'pending_setup' | 'active';

  can_skip?: boolean;

  error?: string | null;
}

/**
 * Response model for MCP server capability discovery.
 */
export interface ServerRediscoverResponse {
  capabilities: Array<{ [key: string]: unknown }>;

  capabilities_count: number;

  /**
   * Lifecycle status of an MCP server registration.
   */
  status: 'pending_setup' | 'active';

  can_skip?: boolean;

  error?: string | null;
}

/**
 * Response model for a registered MCP server.
 */
export interface ServerUpdateConfigResponse {
  id: string;

  allowed_capabilities: Array<unknown>;

  /**
   * Authentication type for MCP server connections.
   */
  auth_type: 'api_key' | 'oauth2' | 'none';

  capabilities: Array<unknown>;

  created_at: string;

  enabled: boolean;

  name: string;

  server_url: string;

  slug: string;

  /**
   * Lifecycle status of an MCP server registration.
   */
  status: 'pending_setup' | 'active';

  /**
   * Transport protocol for MCP server communication.
   */
  transport: 'auto' | 'streamable_http' | 'sse';
}

export interface ServerCreateParams {
  /**
   * Display name
   */
  name: string;

  /**
   * HTTPS URL of the MCP server
   */
  server_url: string;

  /**
   * Unique snake_case identifier
   */
  slug: string;

  /**
   * API key (for auth_type=api_key). Stored as shared client-level credential.
   */
  api_key?: string | null;

  /**
   * Authentication type
   */
  auth_type?: 'api_key' | 'oauth2' | 'none';

  /**
   * Optional description
   */
  description?: string | null;

  /**
   * OAuth2 authorize URL
   */
  oauth_authorize_url?: string | null;

  /**
   * OAuth2 client ID
   */
  oauth_client_id?: string | null;

  /**
   * OAuth2 client secret (encrypted)
   */
  oauth_client_secret?: string | null;

  /**
   * OAuth2 revoke URL (optional)
   */
  oauth_revoke_url?: string | null;

  /**
   * OAuth2 scopes
   */
  oauth_scopes_requested?: string | null;

  /**
   * OAuth2 token URL
   */
  oauth_token_url?: string | null;

  /**
   * Must be true to accept security terms
   */
  terms_acknowledged?: boolean;

  /**
   * Transport protocol
   */
  transport?: 'auto' | 'streamable_http' | 'sse';
}

export interface ServerUpdateParams {
  /**
   * Capabilities to expose as LLM tools
   */
  allowed_capabilities?: Array<ServerUpdateParams.AllowedCapability> | null;

  /**
   * Enable/disable toggle
   */
  enabled?: boolean | null;
}

export namespace ServerUpdateParams {
  /**
   * A capability selected by the admin for LLM tool exposure.
   */
  export interface AllowedCapability {
    description: string;

    inputSchema: { [key: string]: unknown };

    name: string;
  }
}

export interface ServerDiscoverParams {}

export interface ServerRediscoverParams {}

export interface ServerUpdateAPIKeyParams {
  /**
   * New API key value
   */
  api_key: string;
}

export interface ServerUpdateConfigParams {
  /**
   * Authentication type for MCP server connections.
   */
  auth_type?: 'api_key' | 'oauth2' | 'none' | null;

  description?: string | null;

  name?: string | null;

  oauth_authorize_url?: string | null;

  oauth_client_id?: string | null;

  oauth_client_secret?: string | null;

  oauth_revoke_url?: string | null;

  oauth_scopes_requested?: string | null;

  oauth_token_url?: string | null;

  server_url?: string | null;

  /**
   * Transport protocol for MCP server communication.
   */
  transport?: 'auto' | 'streamable_http' | 'sse' | null;
}

export declare namespace Servers {
  export {
    type ServerCreateResponse as ServerCreateResponse,
    type ServerUpdateResponse as ServerUpdateResponse,
    type ServerListResponse as ServerListResponse,
    type ServerDiscoverResponse as ServerDiscoverResponse,
    type ServerRediscoverResponse as ServerRediscoverResponse,
    type ServerUpdateConfigResponse as ServerUpdateConfigResponse,
    type ServerCreateParams as ServerCreateParams,
    type ServerUpdateParams as ServerUpdateParams,
    type ServerDiscoverParams as ServerDiscoverParams,
    type ServerRediscoverParams as ServerRediscoverParams,
    type ServerUpdateAPIKeyParams as ServerUpdateAPIKeyParams,
    type ServerUpdateConfigParams as ServerUpdateConfigParams,
  };
}
