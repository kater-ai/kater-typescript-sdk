// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Tenants extends APIResource {
  /**
   * Add tenants to a group.
   *
   * Accepts a list of tenant IDs. Returns detailed results showing which tenants
   * were added, which were already members, and which don't exist.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNotFoundError: If group doesn't exist (404)
   */
  add(groupID: string, body: TenantAddParams, options?: RequestOptions): APIPromise<TenantAddResponse> {
    return this._client.post(path`/api/v1/groups/${groupID}/tenants`, { body, ...options });
  }

  /**
   * Remove a tenant from a group.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNotFoundError: If group doesn't exist (404) TenantNotFoundError: If
   * tenant is not a member of the group (404)
   */
  remove(tenantID: string, params: TenantRemoveParams, options?: RequestOptions): APIPromise<void> {
    const { group_id } = params;
    return this._client.delete(path`/api/v1/groups/${group_id}/tenants/${tenantID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Response model for add tenants operation.
 */
export interface TenantAddResponse {
  /**
   * Tenant IDs that were successfully added
   */
  added: Array<string>;

  /**
   * Tenant IDs that were already members
   */
  already_in_group: Array<string>;

  /**
   * Tenant IDs that don't exist
   */
  not_found: Array<string>;
}

export interface TenantAddParams {
  /**
   * List of tenant IDs to add to the group
   */
  tenant_ids: Array<string>;
}

export interface TenantRemoveParams {
  group_id: string;
}

export declare namespace Tenants {
  export {
    type TenantAddResponse as TenantAddResponse,
    type TenantAddParams as TenantAddParams,
    type TenantRemoveParams as TenantRemoveParams,
  };
}
