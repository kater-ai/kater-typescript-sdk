// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class ClientResource extends APIResource {}

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

export declare namespace ClientResource {
  export { type Client as Client, type TenancyType as TenancyType };
}
