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

export interface CredentialRevokeParams {
  tenant_id: string;

  tenant_user_id: string;
}

export declare namespace Credentials {
  export { type CredentialRevokeParams as CredentialRevokeParams };
}
