// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../../core/resource';
import { APIPromise } from '../../../../../core/api-promise';
import { RequestOptions } from '../../../../../internal/request-options';
import { path } from '../../../../../internal/utils/path';

/**
 * Tenant MCP credential management
 */
export class OAuth extends APIResource {
  /**
   * Initiate OAuth authorization flow for an MCP server.
   *
   * Generates a cryptographically random state token, stores it in
   * oauth_pending_state with a 10-minute TTL, and returns the provider's
   * authorization URL for the frontend to redirect to.
   *
   * Returns the URL in the response body (not an HTTP redirect) so the SPA frontend
   * can handle navigation.
   */
  initiate(
    mcpID: string,
    query: OAuthInitiateParams,
    options?: RequestOptions,
  ): APIPromise<OAuthInitiateResponse> {
    return this._client.get(path`/api/v1/tenant/mcp/${mcpID}/oauth/authorize`, {
      query,
      ...options,
      __security: { propelAuth: true },
    });
  }
}

/**
 * Response model containing the OAuth authorization URL for the frontend.
 */
export interface OAuthInitiateResponse {
  authorize_url: string;
}

export interface OAuthInitiateParams {
  tenant_id: string;

  tenant_user_id: string;
}

export declare namespace OAuth {
  export {
    type OAuthInitiateResponse as OAuthInitiateResponse,
    type OAuthInitiateParams as OAuthInitiateParams,
  };
}
