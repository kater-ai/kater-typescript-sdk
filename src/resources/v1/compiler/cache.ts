// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Cache extends APIResource {
  /**
   * Invalidate cache entries scoped by client, tenant, or connection.
   *
   * The caller's client_id must match the request client_id (auth scoping). No
   * cross-client invalidation is permitted.
   */
  invalidate(body: CacheInvalidateParams, options?: RequestOptions): APIPromise<CacheInvalidateResponse> {
    return this._client.post('/api/v1/compiler/cache/invalidate', { body, ...options });
  }
}

/**
 * Response from cache invalidation.
 */
export interface CacheInvalidateResponse {
  /**
   * Number of cache entries removed
   */
  entries_invalidated: number;
}

export interface CacheInvalidateParams {
  /**
   * Client ID to invalidate cache entries for (mandatory)
   */
  client_id: string;

  /**
   * Optional connection ID for connection-scoped invalidation
   */
  connection_id?: string | null;

  /**
   * Optional tenant ID for tenant-scoped invalidation
   */
  tenant_id?: string | null;
}

export declare namespace Cache {
  export {
    type CacheInvalidateResponse as CacheInvalidateResponse,
    type CacheInvalidateParams as CacheInvalidateParams,
  };
}
