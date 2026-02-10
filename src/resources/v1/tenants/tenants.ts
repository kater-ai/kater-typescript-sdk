// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as BatchAPI from './batch';
import { Batch, BatchTenantError, BatchTenantSuccess } from './batch';
import * as ImportAPI from './import';
import { Import, ImportFromCsvParams, ImportFromWarehouseParams, ImportTenants } from './import';

export class Tenants extends APIResource {
  batch: BatchAPI.Batch = new BatchAPI.Batch(this._client);
  import: ImportAPI.Import = new ImportAPI.Import(this._client);
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

Tenants.Batch = Batch;
Tenants.Import = Import;

export declare namespace Tenants {
  export { type CreateTenant as CreateTenant, type Tenant as Tenant };

  export {
    Batch as Batch,
    type BatchTenantError as BatchTenantError,
    type BatchTenantSuccess as BatchTenantSuccess,
  };

  export {
    Import as Import,
    type ImportTenants as ImportTenants,
    type ImportFromCsvParams as ImportFromCsvParams,
    type ImportFromWarehouseParams as ImportFromWarehouseParams,
  };
}
