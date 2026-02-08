// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Views extends APIResource {
  /**
   * Get the YAML content of a specific view file.
   */
  retrieve(
    fileName: string,
    params: ViewRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<ViewRetrieveResponse> {
    const { connection_id, sync_id } = params;
    return this._client.get(
      path`/api/v1/connections/${connection_id}/sync/${sync_id}/views/${fileName}`,
      options,
    );
  }

  /**
   * List all view YAML files created by a schema sync.
   */
  list(syncID: string, params: ViewListParams, options?: RequestOptions): APIPromise<ViewListResponse> {
    const { connection_id } = params;
    return this._client.get(path`/api/v1/connections/${connection_id}/sync/${syncID}/views`, options);
  }
}

/**
 * Response for a single view file's content.
 */
export interface ViewRetrieveResponse {
  /**
   * Branch the file was read from
   */
  branch: string;

  /**
   * YAML file content
   */
  content: string;

  /**
   * File name (e.g., 'customers.yaml')
   */
  name: string;

  /**
   * Full path relative to connection folder
   */
  path: string;
}

/**
 * Response for listing view files in a sync.
 */
export interface ViewListResponse {
  /**
   * Branch the files were read from
   */
  branch: string;

  /**
   * List of view files
   */
  files: Array<ViewListResponse.File>;

  /**
   * True if reading from PR branch, False if from main
   */
  is_pr_branch: boolean;
}

export namespace ViewListResponse {
  /**
   * A single view file in the sync.
   */
  export interface File {
    /**
     * File name (e.g., 'customers.yaml')
     */
    name: string;

    /**
     * Full path relative to connection folder
     */
    path: string;
  }
}

export interface ViewRetrieveParams {
  connection_id: string;

  sync_id: string;
}

export interface ViewListParams {
  connection_id: string;
}

export declare namespace Views {
  export {
    type ViewRetrieveResponse as ViewRetrieveResponse,
    type ViewListResponse as ViewListResponse,
    type ViewRetrieveParams as ViewRetrieveParams,
    type ViewListParams as ViewListParams,
  };
}
