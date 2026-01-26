// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as TenantsAPI from './tenants';
import { TenantAddParams, TenantAddResponse, TenantRemoveParams, Tenants } from './tenants';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Groups extends APIResource {
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);

  /**
   * Create a new group.
   *
   * Group names must be unique within the client.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNameExistsError: If a group with this name already exists (409)
   */
  create(body: GroupCreateParams, options?: RequestOptions): APIPromise<GroupDetail> {
    return this._client.post('/api/v1/groups', { body, ...options });
  }

  /**
   * Get a single group by ID.
   *
   * Returns the group with its full tenant list.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNotFoundError: If group doesn't exist (404)
   */
  retrieve(groupID: string, options?: RequestOptions): APIPromise<GroupDetail> {
    return this._client.get(path`/api/v1/groups/${groupID}`, options);
  }

  /**
   * Update a group.
   *
   * Update group name and/or description. Name must remain unique within client.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNotFoundError: If group doesn't exist (404) GroupNameExistsError:
   * If new name conflicts with existing group (409)
   */
  update(groupID: string, body: GroupUpdateParams, options?: RequestOptions): APIPromise<GroupDetail> {
    return this._client.patch(path`/api/v1/groups/${groupID}`, { body, ...options });
  }

  /**
   * List all groups for the client.
   *
   * Returns groups with their tenant counts for efficient display.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  list(options?: RequestOptions): APIPromise<GroupListResponse> {
    return this._client.get('/api/v1/groups', options);
  }

  /**
   * Delete a group.
   *
   * Soft-deletes the group and removes all tenant associations.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: GroupNotFoundError: If group doesn't exist (404)
   */
  delete(groupID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/groups/${groupID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
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

export type GroupListResponse = Array<GroupListResponse.GroupListResponseItem>;

export namespace GroupListResponse {
  /**
   * Response model for a group in list responses (with tenant count).
   */
  export interface GroupListResponseItem {
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
     * Number of tenants in this group
     */
    tenant_count: number;

    /**
     * Last update timestamp
     */
    updated_at: string;
  }
}

export interface GroupCreateParams {
  /**
   * Unique group name within the client
   */
  name: string;

  /**
   * Human-readable group description
   */
  description?: string | null;
}

export interface GroupUpdateParams {
  /**
   * New group description
   */
  description?: string | null;

  /**
   * New group name
   */
  name?: string | null;
}

Groups.Tenants = Tenants;

export declare namespace Groups {
  export {
    type GroupDetail as GroupDetail,
    type GroupListResponse as GroupListResponse,
    type GroupCreateParams as GroupCreateParams,
    type GroupUpdateParams as GroupUpdateParams,
  };

  export {
    Tenants as Tenants,
    type TenantAddResponse as TenantAddResponse,
    type TenantAddParams as TenantAddParams,
    type TenantRemoveParams as TenantRemoveParams,
  };
}
