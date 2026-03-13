// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

/**
 * Tenant MCP credential management
 */
export class OAuth extends APIResource {
  /**
   * Handle OAuth callback from an MCP provider.
   *
   * Validates the state token, exchanges the authorization code for tokens, encrypts
   * them, and stores them in the database. The state token is consumed (deleted) on
   * first use to prevent replay attacks.
   */
  handleCallback(
    query: OAuthHandleCallbackParams,
    options?: RequestOptions,
  ): APIPromise<OAuthHandleCallbackResponse> {
    return this._client.get('/api/v1/oauth/callback', {
      query,
      ...options,
      __security: { propelAuth: true },
    });
  }
}

/**
 * Response after successful OAuth callback.
 */
export interface OAuthHandleCallbackResponse {
  connected_at: string;

  connection_status: string;

  mcp_id: string;
}

export interface OAuthHandleCallbackParams {
  /**
   * Authorization code from OAuth provider
   */
  code: string;

  /**
   * State token for CSRF validation
   */
  state: string;

  tenant_id: string;

  tenant_user_id: string;
}

export declare namespace OAuth {
  export {
    type OAuthHandleCallbackResponse as OAuthHandleCallbackResponse,
    type OAuthHandleCallbackParams as OAuthHandleCallbackParams,
  };
}
