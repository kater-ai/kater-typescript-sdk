// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Admin extends APIResource {
  /**
   * Returns the GitHub integration status for a specific client. Admin access
   * required.
   */
  getIntegrationStatus(
    clientID: string,
    options?: RequestOptions,
  ): APIPromise<AdminGetIntegrationStatusResponse> {
    return this._client.get(path`/api/v1/github/admin/status/${clientID}`, options);
  }
}

/**
 * Response for client GitHub integration status.
 */
export interface AdminGetIntegrationStatusResponse {
  client_id: string;

  connected: boolean;

  oauth_completed: boolean;

  connection_status?: string | null;

  created_at?: string | null;

  github_username?: string | null;

  installation_id?: number | null;

  last_sync_at?: string | null;

  repository?: string | null;

  repository_selection_pending?: boolean;

  scaffolding_branch?: string | null;

  scaffolding_pr_url?: string | null;

  scaffolding_status?: string | null;

  updated_at?: string | null;
}

export declare namespace Admin {
  export { type AdminGetIntegrationStatusResponse as AdminGetIntegrationStatusResponse };
}
