// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Groups extends APIResource {
  /**
   * Get all tenant groups as a TenantGroupSchema object.
   *
   * Returns tenant groups in the YAML-compatible schema format. Supports content
   * negotiation: JSON by default, YAML with Accept: application/yaml.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  getTenantGroupsSchema(options?: RequestOptions): APIPromise<GroupGetTenantGroupsSchemaResponse> {
    return this._client.get('/api/v1/tenants/groups/schema', options);
  }
}

/**
 * Schema for tenant group configuration files
 */
export interface GroupGetTenantGroupsSchemaResponse {
  /**
   * Array of tenant group configurations
   */
  tenant_groups: Array<GroupGetTenantGroupsSchemaResponse.TenantGroup>;
}

export namespace GroupGetTenantGroupsSchemaResponse {
  export interface TenantGroup {
    /**
     * Unique Kater identifier
     */
    kater_id: string;

    /**
     * Name identifier
     */
    name: string;

    /**
     * Description text
     */
    description?: string | null;
  }
}

export declare namespace Groups {
  export { type GroupGetTenantGroupsSchemaResponse as GroupGetTenantGroupsSchemaResponse };
}
