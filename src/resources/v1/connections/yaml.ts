// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Yaml extends APIResource {
  /**
   * Commit updated YAML to a new branch and create a PR.
   */
  commitYaml(
    connectionID: string,
    body: YamlCommitYamlParams,
    options?: RequestOptions,
  ): APIPromise<YamlCommitYamlResponse> {
    return this._client.post(path`/api/v1/connections/${connectionID}/yaml`, { body, ...options });
  }

  /**
   * Read connection.yaml from the main branch of the repo.
   */
  retrieveYaml(connectionID: string, options?: RequestOptions): APIPromise<YamlRetrieveYamlResponse> {
    return this._client.get(path`/api/v1/connections/${connectionID}/yaml`, options);
  }
}

/**
 * Response for YAML commit endpoint.
 */
export interface YamlCommitYamlResponse {
  /**
   * Whether the PR was auto-merged
   */
  merged: boolean;

  /**
   * GitHub PR number
   */
  pr_number: number;

  /**
   * GitHub PR URL
   */
  pr_url: string;
}

/**
 * Response for reading connection.yaml from repo.
 */
export interface YamlRetrieveYamlResponse {
  /**
   * Folder name in the repo (e.g. 'prod_db_connection')
   */
  folder_name: string;

  /**
   * Raw YAML content of connection.yaml
   */
  yaml_content: string;
}

export interface YamlCommitYamlParams {
  /**
   * Updated YAML content
   */
  yaml_content: string;

  /**
   * If true, auto-merge the PR after creation
   */
  auto_merge?: boolean;
}

export declare namespace Yaml {
  export {
    type YamlCommitYamlResponse as YamlCommitYamlResponse,
    type YamlRetrieveYamlResponse as YamlRetrieveYamlResponse,
    type YamlCommitYamlParams as YamlCommitYamlParams,
  };
}
