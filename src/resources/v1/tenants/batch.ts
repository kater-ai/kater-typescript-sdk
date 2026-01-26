// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as TenantsAPI from './tenants';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Batch extends APIResource {
  /**
   * Create multiple tenants in a single request.
   *
   * Each tenant is processed independently. If one fails, others may succeed.
   * Returns lists of succeeded and failed operations.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  create(body: BatchCreateParams, options?: RequestOptions): APIPromise<BatchCreateResponse> {
    return this._client.post('/api/v1/tenants/batch', { body, ...options });
  }

  /**
   * Update multiple tenants in a single request.
   *
   * Each tenant is processed independently. If one fails, others may succeed.
   * Returns lists of succeeded and failed operations.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  update(body: BatchUpdateParams, options?: RequestOptions): APIPromise<BatchUpdateResponse> {
    return this._client.patch('/api/v1/tenants/batch', { body, ...options });
  }

  /**
   * Delete multiple tenants in a single request.
   *
   * Each tenant is processed independently. If one fails, others may succeed.
   * Returns lists of succeeded and failed operations.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  delete(body: BatchDeleteParams, options?: RequestOptions): APIPromise<BatchDeleteResponse> {
    return this._client.delete('/api/v1/tenants/batch', { body, ...options });
  }
}

/**
 * Failed tenant operation in batch response.
 */
export interface BatchTenantError {
  /**
   * Error code
   */
  code: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Index in request array (for create operations)
   */
  index?: number | null;

  /**
   * Tenant ID (for update/delete operations)
   */
  tenant_id?: string | null;

  /**
   * Tenant key (for create operations)
   */
  tenant_key?: string | null;
}

/**
 * Successful tenant operation in batch response.
 */
export interface BatchTenantSuccess {
  /**
   * Tenant ID
   */
  tenant_id: string;

  /**
   * Response model for a single tenant.
   */
  tenant?: TenantsAPI.Tenant | null;
}

/**
 * Response model for batch tenant creation.
 */
export interface BatchCreateResponse {
  /**
   * Failed tenant creations
   */
  failed: Array<BatchTenantError>;

  /**
   * Successfully created tenants
   */
  succeeded: Array<BatchTenantSuccess>;
}

/**
 * Response model for batch tenant updates.
 */
export interface BatchUpdateResponse {
  /**
   * Failed tenant updates
   */
  failed: Array<BatchTenantError>;

  /**
   * Successfully updated tenants
   */
  succeeded: Array<BatchTenantSuccess>;
}

/**
 * Response model for batch tenant deletions.
 */
export interface BatchDeleteResponse {
  /**
   * Failed tenant deletions
   */
  failed: Array<BatchTenantError>;

  /**
   * Successfully deleted tenants
   */
  succeeded: Array<BatchTenantSuccess>;
}

export interface BatchCreateParams {
  /**
   * List of tenants to create
   */
  tenants: Array<TenantsAPI.CreateTenant>;
}

export interface BatchUpdateParams {
  /**
   * List of tenant updates
   */
  tenants: Array<BatchUpdateParams.Tenant>;
}

export namespace BatchUpdateParams {
  /**
   * Single tenant update in a batch operation.
   */
  export interface Tenant {
    /**
     * Tenant ID to update
     */
    tenant_id: string;

    /**
     * Connection ID for database association (required with database_name)
     */
    connection_id?: string | null;

    /**
     * Database name for association (required with connection_id)
     */
    database_name?: string | null;

    /**
     * New list of group names (replaces all existing associations)
     */
    group_names?: Array<string> | null;

    /**
     * New human-readable tenant name
     */
    tenant_name?: string | null;
  }
}

export interface BatchDeleteParams {
  /**
   * List of tenant IDs to delete
   */
  tenant_ids: Array<string>;
}

export declare namespace Batch {
  export {
    type BatchTenantError as BatchTenantError,
    type BatchTenantSuccess as BatchTenantSuccess,
    type BatchCreateResponse as BatchCreateResponse,
    type BatchUpdateResponse as BatchUpdateResponse,
    type BatchDeleteResponse as BatchDeleteResponse,
    type BatchCreateParams as BatchCreateParams,
    type BatchUpdateParams as BatchUpdateParams,
    type BatchDeleteParams as BatchDeleteParams,
  };
}
