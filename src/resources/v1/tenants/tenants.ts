// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as GroupsAPI from './groups';
import { GroupGetTenantGroupsSchemaResponse, Groups } from './groups';
import { APIPromise } from '../../../core/api-promise';
import { type Uploadable } from '../../../core/uploads';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { multipartFormRequestOptions } from '../../../internal/uploads';

/**
 * Manage tenants (your end customers)
 */
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
   * - Additional columns can be mapped to attributes via attribute_columns
   *
   * Creates new tenants and updates existing ones with new name/groups. Groups are
   * added additively (not replaced) and auto-created if needed.
   *
   * Optionally processes attribute columns: values are validated against
   * attributes.yaml, stored additively, and validation errors are non-fatal.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ValidationError: If CSV format is invalid (400)
   * TenantCreationNotAllowedError: If tenancy type is NONE (400)
   */
  importFromCsv(
    params: TenantImportFromCsvParams,
    options?: RequestOptions,
  ): APIPromise<ImportTenantsResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post(
      '/api/v1/tenants/import/csv',
      multipartFormRequestOptions(
        {
          query: { source },
          body,
          ...options,
          headers: buildHeaders([
            { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
            options?.headers,
          ]),
        },
        this._client,
      ),
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
    params: TenantImportFromWarehouseParams,
    options?: RequestOptions,
  ): APIPromise<ImportTenantsResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/tenants/import/warehouse', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
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
   * Non-fatal attribute validation errors during import
   */
  attribute_errors?: Array<ImportTenantsResponse.AttributeError>;

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
   * Error for a single attribute during import.
   */
  export interface AttributeError {
    /**
     * Attribute name that failed
     */
    attribute: string;

    /**
     * Error message
     */
    error: string;

    /**
     * Tenant key for which attribute processing failed
     */
    tenant_key: string;

    /**
     * Value that caused the error
     */
    value: string;
  }

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
   * Body param: CSV file with tenant data
   */
  file: Uploadable;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: JSON mapping: attribute_name -> csv_column_name
   */
  attribute_columns?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export interface TenantImportFromWarehouseParams {
  /**
   * Body param: Warehouse connection ID to query
   */
  connection_id: string;

  /**
   * Body param: Database name containing the tenant table
   */
  database: string;

  /**
   * Body param: Schema name containing the tenant table
   */
  schema: string;

  /**
   * Body param: Table name containing tenant data
   */
  table: string;

  /**
   * Body param: Column name for tenant key
   */
  tenant_key_column: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Mapping of attribute names to warehouse column names for attribute
   * import
   */
  attribute_columns?: { [key: string]: string } | null;

  /**
   * Body param: Column name for tenant group (optional)
   */
  tenant_group_column?: string | null;

  /**
   * Body param: Column name for tenant display name (optional)
   */
  tenant_name_column?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
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
