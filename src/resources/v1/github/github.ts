// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as AdminAPI from './admin';
import { Admin, AdminGetIntegrationStatusResponse } from './admin';
import * as ReposAPI from './repos';
import { RepoListResponse, RepoSelectParams, RepoSelectResponse, Repos, Repository } from './repos';
import * as ScaffoldAPI from './scaffold';
import { Scaffold, ScaffoldGetStatusResponse, ScaffoldTrigger } from './scaffold';
import * as WebhooksAPI from './webhooks';
import { WebhookPingResponse, Webhooks } from './webhooks';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class GitHub extends APIResource {
  repos: ReposAPI.Repos = new ReposAPI.Repos(this._client);
  scaffold: ScaffoldAPI.Scaffold = new ScaffoldAPI.Scaffold(this._client);
  webhooks: WebhooksAPI.Webhooks = new WebhooksAPI.Webhooks(this._client);
  admin: AdminAPI.Admin = new AdminAPI.Admin(this._client);

  /**
   * Checks if the GitHub App is already installed on any organizations/accounts.
   */
  checkInstallations(options?: RequestOptions): APIPromise<GitHubCheckInstallationsResponse> {
    return this._client.get('/api/v1/github/check-installations', options);
  }

  /**
   * Disconnects the GitHub connection.
   */
  disconnect(options?: RequestOptions): APIPromise<GitHubDisconnectResponse> {
    return this._client.post('/api/v1/github/disconnect', options);
  }

  /**
   * Returns the current GitHub connection status for the client.
   */
  getStatus(options?: RequestOptions): APIPromise<GitHubGetStatusResponse> {
    return this._client.get('/api/v1/github/status', options);
  }

  /**
   * Verifies the GitHub connection and updates the last sync timestamp.
   */
  sync(options?: RequestOptions): APIPromise<GitHubSyncResponse> {
    return this._client.post('/api/v1/github/sync', options);
  }
}

/**
 * Response for checking existing installations.
 */
export interface GitHubCheckInstallationsResponse {
  has_existing_installation: boolean;

  installations?: Array<GitHubCheckInstallationsResponse.Installation>;
}

export namespace GitHubCheckInstallationsResponse {
  /**
   * Information about an existing GitHub App installation.
   */
  export interface Installation {
    account_login: string;

    account_type: string;

    installation_id: number;
  }
}

/**
 * Response for disconnecting GitHub.
 */
export interface GitHubDisconnectResponse {
  message: string;

  success: boolean;
}

/**
 * Response for connection status.
 */
export interface GitHubGetStatusResponse {
  connected: boolean;

  default_branch?: string | null;

  last_sync_at?: string | null;

  last_used_at?: string | null;

  owner?: string | null;

  repository?: string | null;

  scaffolding_pr_url?: string | null;

  scaffolding_status?: string | null;

  status?: string | null;
}

/**
 * Response for sync operation.
 */
export interface GitHubSyncResponse {
  last_sync_at: string;

  message: string;

  success: boolean;
}

GitHub.Repos = Repos;
GitHub.Scaffold = Scaffold;
GitHub.Webhooks = Webhooks;
GitHub.Admin = Admin;

export declare namespace GitHub {
  export {
    type GitHubCheckInstallationsResponse as GitHubCheckInstallationsResponse,
    type GitHubDisconnectResponse as GitHubDisconnectResponse,
    type GitHubGetStatusResponse as GitHubGetStatusResponse,
    type GitHubSyncResponse as GitHubSyncResponse,
  };

  export {
    Repos as Repos,
    type Repository as Repository,
    type RepoListResponse as RepoListResponse,
    type RepoSelectResponse as RepoSelectResponse,
    type RepoSelectParams as RepoSelectParams,
  };

  export {
    Scaffold as Scaffold,
    type ScaffoldTrigger as ScaffoldTrigger,
    type ScaffoldGetStatusResponse as ScaffoldGetStatusResponse,
  };

  export { Webhooks as Webhooks, type WebhookPingResponse as WebhookPingResponse };

  export { Admin as Admin, type AdminGetIntegrationStatusResponse as AdminGetIntegrationStatusResponse };
}
