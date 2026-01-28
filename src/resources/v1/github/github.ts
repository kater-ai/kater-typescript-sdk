// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ReposAPI from './repos';
import { RepoListResponse, RepoSelectParams, RepoSelectResponse, Repos, Repository } from './repos';
import * as ScaffoldAPI from './scaffold';
import { Scaffold, ScaffoldTrigger } from './scaffold';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class GitHub extends APIResource {
  repos: ReposAPI.Repos = new ReposAPI.Repos(this._client);
  scaffold: ScaffoldAPI.Scaffold = new ScaffoldAPI.Scaffold(this._client);

  /**
   * Returns the current GitHub connection status for the client.
   */
  getStatus(options?: RequestOptions): APIPromise<GitHubGetStatusResponse> {
    return this._client.get('/api/v1/github/status', options);
  }
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

GitHub.Repos = Repos;
GitHub.Scaffold = Scaffold;

export declare namespace GitHub {
  export { type GitHubGetStatusResponse as GitHubGetStatusResponse };

  export {
    Repos as Repos,
    type Repository as Repository,
    type RepoListResponse as RepoListResponse,
    type RepoSelectResponse as RepoSelectResponse,
    type RepoSelectParams as RepoSelectParams,
  };

  export { Scaffold as Scaffold, type ScaffoldTrigger as ScaffoldTrigger };
}
