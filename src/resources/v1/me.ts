// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';

export class Me extends APIResource {}

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
