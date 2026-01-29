// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ReposAPI from './repos';
import { RepoListResponse, RepoSelectParams, RepoSelectResponse, Repos, Repository } from './repos';
import * as ScaffoldAPI from './scaffold';
import { Scaffold, ScaffoldTrigger } from './scaffold';
import * as WebhooksAPI from './webhooks';
import { WebhookReceiveParams, WebhookReceiveResponse, Webhooks } from './webhooks';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class GitHub extends APIResource {
  repos: ReposAPI.Repos = new ReposAPI.Repos(this._client);
  scaffold: ScaffoldAPI.Scaffold = new ScaffoldAPI.Scaffold(this._client);
  webhooks: WebhooksAPI.Webhooks = new WebhooksAPI.Webhooks(this._client);

  /**
   * Handles the OAuth callback from GitHub after user authorization.
   */
  callback(query: GitHubCallbackParams, options?: RequestOptions): APIPromise<unknown> {
    return this._client.get('/api/v1/github/callback', { query, ...options });
  }

  /**
   * Initiates the GitHub App installation flow.
   */
  connect(
    query: GitHubConnectParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<GitHubConnectResponse> {
    return this._client.get('/api/v1/github/connect', { query, ...options });
  }

  /**
   * Generates a shareable GitHub App installation link.
   */
  getInstallationLink(options?: RequestOptions): APIPromise<GitHubGetInstallationLinkResponse> {
    return this._client.get('/api/v1/github/installation-link', options);
  }

  /**
   * Returns the current GitHub connection status for the client.
   */
  getStatus(options?: RequestOptions): APIPromise<GitHubGetStatusResponse> {
    return this._client.get('/api/v1/github/status', options);
  }
}

export type GitHubCallbackResponse = unknown;

/**
 * Response for starting OAuth flow.
 */
export interface GitHubConnectResponse {
  authorization_url: string;

  state: string;
}

/**
 * Response for installation link generation.
 */
export interface GitHubGetInstallationLinkResponse {
  app_name: string;

  installation_url: string;
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

export interface GitHubCallbackParams {
  /**
   * State token for CSRF validation
   */
  state: string;

  /**
   * OAuth authorization code
   */
  code?: string | null;

  /**
   * OAuth error code from GitHub
   */
  error?: string | null;

  /**
   * OAuth error description
   */
  error_description?: string | null;

  /**
   * GitHub App installation ID
   */
  installation_id?: number | null;
}

export interface GitHubConnectParams {
  /**
   * Frontend path to redirect to after OAuth success (e.g., '/' or
   * '/settings/github')
   */
  return_to?: string | null;
}

GitHub.Repos = Repos;
GitHub.Scaffold = Scaffold;
GitHub.Webhooks = Webhooks;

export declare namespace GitHub {
  export {
    type GitHubCallbackResponse as GitHubCallbackResponse,
    type GitHubConnectResponse as GitHubConnectResponse,
    type GitHubGetInstallationLinkResponse as GitHubGetInstallationLinkResponse,
    type GitHubGetStatusResponse as GitHubGetStatusResponse,
    type GitHubCallbackParams as GitHubCallbackParams,
    type GitHubConnectParams as GitHubConnectParams,
  };

  export {
    Repos as Repos,
    type Repository as Repository,
    type RepoListResponse as RepoListResponse,
    type RepoSelectResponse as RepoSelectResponse,
    type RepoSelectParams as RepoSelectParams,
  };

  export { Scaffold as Scaffold, type ScaffoldTrigger as ScaffoldTrigger };

  export {
    Webhooks as Webhooks,
    type WebhookReceiveResponse as WebhookReceiveResponse,
    type WebhookReceiveParams as WebhookReceiveParams,
  };
}
