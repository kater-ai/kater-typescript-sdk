// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class APIKeys extends APIResource {
  /**
   * Create a new API key.
   *
   * Returns the full API key exactly once. The key cannot be retrieved after this
   * response - only the masked key_prefix is stored.
   *
   * Scopes are validated against the creating user's permissions. You cannot grant
   * scopes you don't have.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ApiKeyScopeExceededError: If requested scopes exceed user's permissions
   * (403)
   */
  create(body: APIKeyCreateParams, options?: RequestOptions): APIPromise<APIKeyCreateResponse> {
    return this._client.post('/api/v1/api-keys', { body, ...options });
  }

  /**
   * Get an API key by ID.
   *
   * Returns the API key with masked key_prefix (never the full key).
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ApiKeyNotFoundError: If key doesn't exist (404)
   */
  retrieve(apiKeyID: string, options?: RequestOptions): APIPromise<APIKey> {
    return this._client.get(path`/api/v1/api-keys/${apiKeyID}`, options);
  }

  /**
   * List all API keys for the current organization.
   *
   * Returns API keys with masked key_prefix (never the full key).
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  list(options?: RequestOptions): APIPromise<APIKeyListResponse> {
    return this._client.get('/api/v1/api-keys', options);
  }

  /**
   * Revoke an API key.
   *
   * Revoked keys cannot be used for authentication. This action is immediate and
   * cannot be undone.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ApiKeyNotFoundError: If key doesn't exist (404)
   */
  revoke(apiKeyID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/api-keys/${apiKeyID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Response model for API key (masked).
 */
export interface APIKey {
  /**
   * API key UUID
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Optional description
   */
  description: string | null;

  /**
   * Expiration datetime
   */
  expires_at: string | null;

  /**
   * Key prefix for display (e.g., kat_live_7kD9...)
   */
  key_prefix: string;

  /**
   * Last usage timestamp
   */
  last_used_at: string | null;

  /**
   * API key name
   */
  name: string;

  /**
   * Granted scopes
   */
  scopes: Array<string>;

  /**
   * Key status (active/revoked/expired)
   */
  status: 'active' | 'revoked' | 'expired';
}

/**
 * Response model for created API key (includes full key once).
 */
export interface APIKeyCreateResponse {
  /**
   * API key UUID
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Expiration datetime
   */
  expires_at: string | null;

  /**
   * Full API key (only shown once)
   */
  key: string;

  /**
   * API key name
   */
  name: string;

  /**
   * Granted scopes
   */
  scopes: Array<string>;
}

export type APIKeyListResponse = Array<APIKey>;

export interface APIKeyCreateParams {
  /**
   * Name for the API key
   */
  name: string;

  /**
   * List of scopes to grant to this key
   */
  scopes: Array<string>;

  /**
   * Optional description
   */
  description?: string | null;

  /**
   * Optional expiration datetime (UTC)
   */
  expires_at?: string | null;
}

export declare namespace APIKeys {
  export {
    type APIKey as APIKey,
    type APIKeyCreateResponse as APIKeyCreateResponse,
    type APIKeyListResponse as APIKeyListResponse,
    type APIKeyCreateParams as APIKeyCreateParams,
  };
}
