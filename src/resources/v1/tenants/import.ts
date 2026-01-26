// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { type Uploadable } from '../../../core/uploads';
import { RequestOptions } from '../../../internal/request-options';
import { multipartFormRequestOptions } from '../../../internal/uploads';

export class Import extends APIResource {
  /**
   * Import tenants from a CSV file using upsert semantics.
   *
   * Expected CSV format:
   *
   * - tenant_key (required): Unique tenant identifier
   * - tenant_name (optional): Human-readable name
   * - group_names (optional): Comma-separated list of group names
   *
   * Creates new tenants and updates existing ones with new name/groups. Groups are
   * added additively (not replaced) and auto-created if needed.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ValidationError: If CSV format is invalid (400)
   * TenantCreationNotAllowedError: If tenancy type is NONE (400)
   */
  fromCsv(body: ImportFromCsvParams, options?: RequestOptions): APIPromise<ImportTenants> {
    return this._client.post(
      '/api/v1/tenants/import/csv',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Import tenants from a warehouse table using upsert semantics.
   *
   * Creates new tenants and updates existing ones with new name/groups. Groups are
   * added additively (not replaced).
   *
   * Streams data from the warehouse in batches to handle large datasets without
   * loading everything into memory.
   *
   * For tenants with groups, groups are aggregated per tenant key and auto-created
   * if they don't exist.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ConnectionNotFoundError: If the connection doesn't exist (404)
   * TenantCreationNotAllowedError: If tenancy type is NONE (400)
   */
  fromWarehouse(body: ImportFromWarehouseParams, options?: RequestOptions): APIPromise<ImportTenants> {
    return this._client.post('/api/v1/tenants/import/warehouse', { body, ...options });
  }
}

/**
 * Response model for tenant import operation.
 */
export interface ImportTenants {
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
  errors?: Array<ImportTenants.Error>;

  /**
   * Groups that were auto-created
   */
  groups_created?: Array<string>;
}

export namespace ImportTenants {
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

export interface ImportFromCsvParams {
  /**
   * CSV file with tenant data
   */
  file: Uploadable;
}

export interface ImportFromWarehouseParams {
  /**
   * Warehouse connection ID to query
   */
  connection_id: string;

  /**
   * Database name containing the tenant table
   */
  database: string;

  /**
   * Schema name containing the tenant table
   */
  schema: string;

  /**
   * Table name containing tenant data
   */
  table: string;

  /**
   * Column name for tenant key
   */
  tenant_key_column: string;

  /**
   * Column name for tenant group (optional)
   */
  tenant_group_column?: string | null;

  /**
   * Column name for tenant display name (optional)
   */
  tenant_name_column?: string | null;
}

export declare namespace Import {
  export {
    type ImportTenants as ImportTenants,
    type ImportFromCsvParams as ImportFromCsvParams,
    type ImportFromWarehouseParams as ImportFromWarehouseParams,
  };
}
