// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as GroupsAPI from './groups';
import { GroupGetTenantGroupsSchemaResponse, Groups } from './groups';
import { APIPromise } from '../../../core/api-promise';
import { type Uploadable } from '../../../core/uploads';
import { RequestOptions } from '../../../internal/request-options';
import { multipartFormRequestOptions } from '../../../internal/uploads';

export class Tenants extends APIResource {
  groups: GroupsAPI.Groups = new GroupsAPI.Groups(this._client);

  /**
   * Get all tenants as a TenantSchema object.
   *
   * Returns tenants in the YAML-compatible schema format with group references.
   * Supports content negotiation: JSON by default, YAML with Accept:
   * application/yaml.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  getTenantsSchema(options?: RequestOptions): APIPromise<TenantGetTenantsSchemaResponse> {
    return this._client.get('/api/v1/tenants/schema', options);
  }

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
  importFromCsv(
    body: TenantImportFromCsvParams,
    options?: RequestOptions,
  ): APIPromise<ImportTenantsResponse> {
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
  importFromWarehouse(
    body: TenantImportFromWarehouseParams,
    options?: RequestOptions,
  ): APIPromise<ImportTenantsResponse> {
    return this._client.post('/api/v1/tenants/import/warehouse', { body, ...options });
  }
}

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

/**
 * Schema for tenant configuration files
 */
export interface TenantGetTenantsSchemaResponse {
  /**
   * Array of tenant configurations
   */
  tenants: Array<TenantGetTenantsSchemaResponse.Tenant>;
}

export namespace TenantGetTenantsSchemaResponse {
  export interface Tenant {
    /**
     * Unique Kater identifier
     */
    kater_id: string;

    /**
     * Unique key identifier for the tenant (e.g., 'acme_corp')
     */
    tenant_key: string;

    /**
     * References to tenant groups this tenant belongs to
     */
    groups?: Array<string> | null;

    /**
     * Human-readable display name for the tenant
     */
    name?: string | null;
  }
}

export interface TenantImportFromCsvParams {
  /**
   * CSV file with tenant data
   */
  file: Uploadable;
}

export interface TenantImportFromWarehouseParams {
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

Tenants.Groups = Groups;

export declare namespace Tenants {
  export {
    type ImportTenantsResponse as ImportTenantsResponse,
    type TenantGetTenantsSchemaResponse as TenantGetTenantsSchemaResponse,
    type TenantImportFromCsvParams as TenantImportFromCsvParams,
    type TenantImportFromWarehouseParams as TenantImportFromWarehouseParams,
  };

  export { Groups as Groups, type GroupGetTenantGroupsSchemaResponse as GroupGetTenantGroupsSchemaResponse };
}
