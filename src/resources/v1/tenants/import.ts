// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Import extends APIResource {}

/**
 * Response model for tenant import operation.
 */
export interface ImportTenantsResponse {
  /**
   * Unique tenant keys found in source
   */
  total_found: number;

  /**
   * New tenants created
   */
  total_imported: number;

  /**
   * Existing tenants updated
   */
  total_updated: number;

  /**
   * Tenant-specific errors
   */
  errors?: Array<ImportTenantsResponse.Error>;

  /**
   * Groups that were auto-created
   */
  groups_created?: Array<string>;
}

export namespace ImportTenantsResponse {
  /**
   * Error for a single tenant during import.
   */
  export interface Error {
    /**
     * Error code
     */
    code: string;

    /**
     * Error message
     */
    message: string;

    /**
     * Tenant key that failed
     */
    tenant_key: string;
  }
}

export declare namespace Import {
  export { type ImportTenantsResponse as ImportTenantsResponse };
}
