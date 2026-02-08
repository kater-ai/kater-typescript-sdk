// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as BatchAPI from './batch';
import {
  Batch,
  BatchCreateParams,
  BatchCreateResponse,
  BatchDeleteParams,
  BatchDeleteResponse,
  BatchTenantError,
  BatchTenantSuccess,
  BatchUpdateParams,
  BatchUpdateResponse,
} from './batch';
import * as GroupsAPI from './groups';
import { GroupRetrieveSchemaResponse, Groups } from './groups';
import * as ImportAPI from './import';
import { Import, ImportFromCsvParams, ImportFromWarehouseParams, ImportTenants } from './import';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tenants extends APIResource {
  batch: BatchAPI.Batch = new BatchAPI.Batch(this._client);
  import: ImportAPI.Import = new ImportAPI.Import(this._client);
  groups: GroupsAPI.Groups = new GroupsAPI.Groups(this._client);

  /**
   * Create a new tenant.
   *
   * Validates the client's tenancy type and creates the tenant accordingly:
   *
   * - ROW tenancy: Creates tenant with optional group associations
   * - DATABASE tenancy: Requires database_name, creates tenant with database
   *   association
   * - NONE tenancy: Returns error (tenant creation not allowed)
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  create(body: TenantCreateParams, options?: RequestOptions): APIPromise<Tenant> {
    return this._client.post('/api/v1/tenants', { body, ...options });
  }

  /**
   * Get a single tenant by ID.
   *
   * Returns the tenant with associated groups and databases.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: TenantNotFoundError: If tenant doesn't exist (404)
   */
  retrieve(tenantID: string, options?: RequestOptions): APIPromise<Tenant> {
    return this._client.get(path`/api/v1/tenants/${tenantID}`, options);
  }

  /**
   * Update a tenant.
   *
   * Updates tenant metadata, group associations, and/or database associations. Group
   * associations use replace semantics:
   *
   * - Omit group_names to leave existing associations unchanged
   * - Pass empty list to remove all group associations
   * - Pass list of names to replace all associations
   *
   * Database associations (DATABASE tenancy only):
   *
   * - Both connection_id and database_name must be provided together
   * - Replaces existing database association
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: TenantNotFoundError: If tenant doesn't exist (404)
   */
  update(tenantID: string, body: TenantUpdateParams, options?: RequestOptions): APIPromise<Tenant> {
    return this._client.patch(path`/api/v1/tenants/${tenantID}`, { body, ...options });
  }

  /**
   * List all tenants for the client.
   *
   * Returns tenants with their associated groups and databases.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  list(options?: RequestOptions): APIPromise<TenantListResponse> {
    return this._client.get('/api/v1/tenants', options);
  }

  /**
   * Delete a tenant.
   *
   * Soft-deletes the tenant and its group/database associations.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: TenantNotFoundError: If tenant doesn't exist (404)
   */
  delete(tenantID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/tenants/${tenantID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get all tenants as a TenantSchema object.
   *
   * Returns tenants in the YAML-compatible schema format with group references.
   * Supports content negotiation: JSON by default, YAML with Accept:
   * application/yaml.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  retrieveSchema(options?: RequestOptions): APIPromise<TenantRetrieveSchemaResponse> {
    return this._client.get('/api/v1/tenants/schema', options);
  }
}

/**
 * Request model for creating a single tenant.
 */
export interface CreateTenant {
  /**
   * Unique tenant identifier within the client
   */
  tenant_key: string;

  /**
   * Connection ID (required for DATABASE tenancy type)
   */
  connection_id?: string | null;

  /**
   * Database name (required for DATABASE tenancy type)
   */
  database_name?: string | null;

  /**
   * List of group names to associate with the tenant
   */
  group_names?: Array<string> | null;

  /**
   * Human-readable tenant name
   */
  tenant_name?: string | null;
}

/**
 * Response model for a single tenant.
 */
export interface Tenant {
  /**
   * Tenant ID
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Associated databases
   */
  databases: Array<Tenant.Database>;

  /**
   * Associated groups
   */
  groups: Array<Tenant.Group>;

  /**
   * Human-readable tenant name
   */
  name: string | null;

  /**
   * Unique tenant identifier
   */
  tenant_key: string;

  /**
   * Last update timestamp
   */
  updated_at: string;
}

export namespace Tenant {
  /**
   * Database information in tenant responses.
   */
  export interface Database {
    /**
     * Database ID
     */
    id: string;

    /**
     * Database name
     */
    name: string;
  }

  /**
   * Group information in tenant responses.
   */
  export interface Group {
    /**
     * Group ID
     */
    id: string;

    /**
     * Group name
     */
    name: string;
  }
}

export type TenantListResponse = Array<Tenant>;

/**
 * Schema for tenant configuration files
 */
export interface TenantRetrieveSchemaResponse {
  /**
   * Array of tenant configurations
   */
  tenants: Array<TenantRetrieveSchemaResponse.Tenant>;
}

export namespace TenantRetrieveSchemaResponse {
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

export interface TenantCreateParams {
  /**
   * Unique tenant identifier within the client
   */
  tenant_key: string;

  /**
   * Connection ID (required for DATABASE tenancy type)
   */
  connection_id?: string | null;

  /**
   * Database name (required for DATABASE tenancy type)
   */
  database_name?: string | null;

  /**
   * List of group names to associate with the tenant
   */
  group_names?: Array<string> | null;

  /**
   * Human-readable tenant name
   */
  tenant_name?: string | null;
}

export interface TenantUpdateParams {
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

Tenants.Batch = Batch;
Tenants.Import = Import;
Tenants.Groups = Groups;

export declare namespace Tenants {
  export {
    type CreateTenant as CreateTenant,
    type Tenant as Tenant,
    type TenantListResponse as TenantListResponse,
    type TenantRetrieveSchemaResponse as TenantRetrieveSchemaResponse,
    type TenantCreateParams as TenantCreateParams,
    type TenantUpdateParams as TenantUpdateParams,
  };

  export {
    Batch as Batch,
    type BatchTenantError as BatchTenantError,
    type BatchTenantSuccess as BatchTenantSuccess,
    type BatchCreateResponse as BatchCreateResponse,
    type BatchUpdateResponse as BatchUpdateResponse,
    type BatchDeleteResponse as BatchDeleteResponse,
    type BatchCreateParams as BatchCreateParams,
    type BatchUpdateParams as BatchUpdateParams,
    type BatchDeleteParams as BatchDeleteParams,
  };

  export {
    Import as Import,
    type ImportTenants as ImportTenants,
    type ImportFromCsvParams as ImportFromCsvParams,
    type ImportFromWarehouseParams as ImportFromWarehouseParams,
  };

  export { Groups as Groups, type GroupRetrieveSchemaResponse as GroupRetrieveSchemaResponse };
}
