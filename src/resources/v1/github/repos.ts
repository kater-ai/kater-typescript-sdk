// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Repos extends APIResource {
  /**
   * List repositories accessible to the GitHub App installation.
   */
  list(options?: RequestOptions): APIPromise<RepoListResponse> {
    return this._client.get('/api/v1/github/repos', options);
  }

  /**
   * Select a repository for the Kater workspace.
   */
  select(repoID: number, body: RepoSelectParams, options?: RequestOptions): APIPromise<RepoSelectResponse> {
    return this._client.post(path`/api/v1/github/repos/${repoID}/select`, { body, ...options });
  }
}

/**
 * Repository information response.
 */
export interface Repository {
  id: number;

  default_branch: string;

  full_name: string;

  has_kater_structure: boolean;

  html_url: string;

  is_empty: boolean;

  name: string;

  owner: string;

  private: boolean;
}

/**
 * List of repositories response.
 */
export interface RepoListResponse {
  repositories: Array<Repository>;

  total_count: number;
}

/**
 * Repository selection response.
 */
export interface RepoSelectResponse {
  has_existing_structure: boolean;

  message: string;

  needs_scaffolding: boolean;

  /**
   * Repository information response.
   */
  repository: Repository;

  success: boolean;
}

export interface RepoSelectParams {
  use_existing_structure?: boolean;
}

export declare namespace Repos {
  export {
    type Repository as Repository,
    type RepoListResponse as RepoListResponse,
    type RepoSelectResponse as RepoSelectResponse,
    type RepoSelectParams as RepoSelectParams,
  };
}
