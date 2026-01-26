// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class ClientResource extends APIResource {
  /**
   * Get the current user's organization details.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  retrieve(options?: RequestOptions): APIPromise<Client> {
    return this._client.get('/api/v1/org/client', options);
  }

  /**
   * Update the current user's organization details.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  update(body: ClientUpdateParams, options?: RequestOptions): APIPromise<Client> {
    return this._client.patch('/api/v1/org/client', { body, ...options });
  }
}

/**
 * Response schema for a client/organization.
 */
export interface Client {
  id: string;

  can_auto_join_by_domain: boolean;

  created_at: string;

  members_must_have_matching_domain: boolean;

  name: string;

  /**
   * Type of tenancy for a client.
   */
  tenancy_type: TenancyType;

  updated_at: string;

  domain?: string | null;

  logo_url?: string | null;
}

/**
 * Type of tenancy for a client.
 */
export type TenancyType = 'row' | 'database' | 'none';

export interface ClientUpdateParams {
  can_auto_join_by_domain?: boolean | null;

  domain?: string | null;

  logo_url?: string | null;

  members_must_have_matching_domain?: boolean | null;

  name?: string | null;

  /**
   * Type of tenancy for a client.
   */
  tenancy_type?: TenancyType | null;
}

export declare namespace ClientResource {
  export {
    type Client as Client,
    type TenancyType as TenancyType,
    type ClientUpdateParams as ClientUpdateParams,
  };
}
