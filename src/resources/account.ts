// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Account activation and access status
 */
export class Account extends APIResource {
  /**
   * Return Kater activation status for the authenticated organization.
   */
  getStatus(options?: RequestOptions): APIPromise<AccountGetStatusResponse> {
    return this._client.get('/api/account/status', { ...options, __security: { propelAuth: true } });
  }
}

/**
 * Current account access status for the authenticated org.
 */
export interface AccountGetStatusResponse {
  /**
   * Kater activation state
   */
  activation_status: 'trial_requested' | 'active';

  /**
   * Authenticated PropelAuth organization ID
   */
  org_id: string;

  /**
   * Activation guidance message, when gated
   */
  message?: string | null;
}

export declare namespace Account {
  export { type AccountGetStatusResponse as AccountGetStatusResponse };
}
