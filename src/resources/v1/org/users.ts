// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as MeAPI from '../me';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Users extends APIResource {
  /**
   * Create a new user in the current organization.
   *
   * Creates the user in PropelAuth and adds them to this organization. The user will
   * receive an email to confirm their email address.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  create(body: UserCreateParams, options?: RequestOptions): APIPromise<MeAPI.ClientUser> {
    return this._client.post('/api/v1/org/users', { body, ...options });
  }

  /**
   * Get a specific user in the current organization.
   *
   * RLS: Filtered to current client, can see any user (ClientRLSDB).
   */
  retrieve(userID: string, options?: RequestOptions): APIPromise<MeAPI.ClientUser> {
    return this._client.get(path`/api/v1/org/users/${userID}`, options);
  }

  /**
   * Update a user in the current organization.
   *
   * Different PropelAuth methods are called depending on what's being updated:
   *
   * - Email changes require re-confirmation
   * - Password changes take effect immediately
   * - Profile fields (name, username, picture) are updated together
   * - Role changes affect organization permissions
   *
   * RLS: Filtered to current client, can update any user (ClientRLSDB).
   */
  update(userID: string, body: UserUpdateParams, options?: RequestOptions): APIPromise<MeAPI.ClientUser> {
    return this._client.patch(path`/api/v1/org/users/${userID}`, { body, ...options });
  }

  /**
   * List all users in the current organization.
   *
   * RLS: Filtered to current client, sees all users (ClientRLSDB).
   */
  list(options?: RequestOptions): APIPromise<UserListResponse> {
    return this._client.get('/api/v1/org/users', options);
  }

  /**
   * Soft delete a user from the current organization.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  delete(userID: string, options?: RequestOptions): APIPromise<UserDeleteResponse> {
    return this._client.delete(path`/api/v1/org/users/${userID}`, options);
  }
}

/**
 * Response schema for listing client users.
 */
export interface UserListResponse {
  total: number;

  users: Array<MeAPI.ClientUser>;
}

/**
 * Response schema for delete operations.
 */
export interface UserDeleteResponse {
  message: string;

  success: boolean;
}

export interface UserCreateParams {
  email: string;

  password: string;

  first_name?: string | null;

  last_name?: string | null;

  /**
   * Role of a user within a client organization.
   */
  role?: MeAPI.ClientUserRole;

  username?: string | null;
}

export interface UserUpdateParams {
  email?: string | null;

  first_name?: string | null;

  last_name?: string | null;

  password?: string | null;

  picture_url?: string | null;

  /**
   * Role of a user within a client organization.
   */
  role?: MeAPI.ClientUserRole | null;

  username?: string | null;
}

export declare namespace Users {
  export {
    type UserListResponse as UserListResponse,
    type UserDeleteResponse as UserDeleteResponse,
    type UserCreateParams as UserCreateParams,
    type UserUpdateParams as UserUpdateParams,
  };
}
