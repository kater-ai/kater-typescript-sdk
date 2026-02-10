// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as TenantsAPI from './tenants';
import { Tenants } from './tenants';

export class Groups extends APIResource {
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);
}

/**
 * Response model for a single group (with full tenant list).
 */
export interface GroupDetail {
  /**
   * Group ID
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Group description
   */
  description: string | null;

  /**
   * Group name
   */
  name: string;

  /**
   * Tenants in this group
   */
  tenants: Array<GroupDetail.Tenant>;

  /**
   * Last update timestamp
   */
  updated_at: string;
}

export namespace GroupDetail {
  /**
   * Tenant information in group responses.
   */
  export interface Tenant {
    /**
     * Tenant ID
     */
    id: string;

    /**
     * Human-readable tenant name
     */
    name: string | null;

    /**
     * Unique tenant identifier
     */
    tenant_key: string;
  }
}

Groups.Tenants = Tenants;

export declare namespace Groups {
  export { type GroupDetail as GroupDetail };

  export { Tenants as Tenants };
}
