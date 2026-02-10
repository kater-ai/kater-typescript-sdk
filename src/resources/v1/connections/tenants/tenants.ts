// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as GroupsAPI from './groups';
import { GroupRetrieveSchemaResponse, Groups } from './groups';
import { APIPromise } from '../../../../core/api-promise';
import { RequestOptions } from '../../../../internal/request-options';

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
  retrieveSchema(options?: RequestOptions): APIPromise<TenantRetrieveSchemaResponse> {
    return this._client.get('/api/v1/tenants/schema', options);
  }
}

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

Tenants.Groups = Groups;

export declare namespace Tenants {
  export { type TenantRetrieveSchemaResponse as TenantRetrieveSchemaResponse };

  export { Groups as Groups, type GroupRetrieveSchemaResponse as GroupRetrieveSchemaResponse };
}
