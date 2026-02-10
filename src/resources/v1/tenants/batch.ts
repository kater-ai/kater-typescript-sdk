// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as TenantsAPI from './tenants';

export class Batch extends APIResource {}

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

export declare namespace Batch {
  export { type BatchTenantError as BatchTenantError, type BatchTenantSuccess as BatchTenantSuccess };
}
