// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Manifest extends APIResource {
  /**
   * Regenerate manifest through compiler validation and open a PR.
   *
   * This endpoint is remote-source only. It regenerates compiler artifacts from the
   * selected connection, then creates a GitHub PR with updated
   * `.kater/manifest.yaml` (and dependency graph when requested).
   */
  regenerateAndCreatePr(
    params: ManifestRegenerateAndCreatePrParams,
    options?: RequestOptions,
  ): APIPromise<ManifestRegenerateAndCreatePrResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/manifest/recovery-pr', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }
}

/**
 * Response model for manifest recovery PR creation.
 */
export interface ManifestRegenerateAndCreatePrResponse {
  /**
   * Remote branch name used for the PR
   */
  branch_name: string;

  /**
   * Created pull request number
   */
  pr_number: number;

  /**
   * Created pull request URL
   */
  pr_url: string;
}

export interface ManifestRegenerateAndCreatePrParams {
  /**
   * Body param: Connection kater_id to regenerate and commit manifest for
   */
  connection_id: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Also include .kater/dependency_graph.yaml in the PR when available.
   */
  include_dependency_graph?: boolean;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export declare namespace Manifest {
  export {
    type ManifestRegenerateAndCreatePrResponse as ManifestRegenerateAndCreatePrResponse,
    type ManifestRegenerateAndCreatePrParams as ManifestRegenerateAndCreatePrParams,
  };
}
