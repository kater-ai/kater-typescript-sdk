// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Me extends APIResource {
  /**
   * Get the current authenticated user's information.
   *
   * Returns the user's profile within their active organization. This endpoint only
   * requires authentication - no special permissions needed.
   *
   * RLS: Filtered to current user's data only (RLSDB).
   */
  retrieve(options?: RequestOptions): APIPromise<ClientUser> {
    return this._client.get('/api/v1/me', options);
  }
}

/**
 * Response schema for a client user.
 */
export interface ClientUser {
  id: string;

  client_id: string;

  created_at: string;

  email: string;

  email_confirmed: boolean;

  /**
   * Role of a user within a client organization.
   */
  role: ClientUserRole;

  updated_at: string;

  first_name?: string | null;

  last_name?: string | null;

  picture_url?: string | null;

  propel_auth_created_at?: string | null;

  propel_auth_last_active_at?: string | null;

  username?: string | null;
}

/**
 * Role of a user within a client organization.
 */
export type ClientUserRole = 'Admin' | 'Developer' | 'Viewer';

export declare namespace Me {
  export { type ClientUser as ClientUser, type ClientUserRole as ClientUserRole };
}
