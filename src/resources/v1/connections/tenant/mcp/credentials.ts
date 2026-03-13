// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../../core/resource';
import { APIPromise } from '../../../../../core/api-promise';
import { buildHeaders } from '../../../../../internal/headers';
import { RequestOptions } from '../../../../../internal/request-options';
import { path } from '../../../../../internal/utils/path';

/**
 * Tenant MCP credential management
 */
export class Credentials extends APIResource {
  /**
   * Create an API key credential for an MCP server connection.
   *
   * The API key is encrypted via CredentialEncryptionService and stored as a
   * Credential row. A McpCredentialSettings row links the user to the server. The
   * plaintext API key is never returned in any response.
   */
  create(
    mcpID: string,
    params: CredentialCreateParams,
    options?: RequestOptions,
  ): APIPromise<CredentialCreateResponse> {
    const { tenant_id, tenant_user_id, ...body } = params;
    return this._client.post(path`/api/v1/tenant/mcp/${mcpID}/credentials`, {
      query: { tenant_id, tenant_user_id },
      body,
      ...options,
      __security: { propelAuth: true },
    });
  }

  /**
   * Revoke an MCP credential, disconnecting the user from the server.
   *
   * Soft-deletes both the credential and mcp_credential_settings rows, setting
   * status to 'revoked'. This allows the user to reconnect later by creating a new
   * credential (the UNIQUE constraint uses deleted_at IS NULL).
   */
  revoke(mcpID: string, params: CredentialRevokeParams, options?: RequestOptions): APIPromise<void> {
    const { tenant_id, tenant_user_id } = params;
    return this._client.delete(path`/api/v1/tenant/mcp/${mcpID}/credentials`, {
      query: { tenant_id, tenant_user_id },
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: { propelAuth: true },
    });
  }
}

/**
 * Response model after creating a credential (never contains the API key).
 */
export interface CredentialCreateResponse {
  connected_at: string;

  connection_status: string;

  mcp_id: string;
}

export interface CredentialCreateParams {
  /**
   * Query param
   */
  tenant_id: string;

  /**
   * Query param
   */
  tenant_user_id: string;

  /**
   * Body param: The API key to store (write-only)
   */
  api_key: string;
}

export interface CredentialRevokeParams {
  tenant_id: string;

  tenant_user_id: string;
}

export declare namespace Credentials {
  export {
    type CredentialCreateResponse as CredentialCreateResponse,
    type CredentialCreateParams as CredentialCreateParams,
    type CredentialRevokeParams as CredentialRevokeParams,
  };
}
