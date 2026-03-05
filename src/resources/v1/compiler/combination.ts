// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CompilerAPI from './compiler';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

/**
 * Validate, resolve, and compile query templates to SQL
 */
export class Combination extends APIResource {
  /**
   * Preview a single combination: resolve, compile, execute, and build config.
   *
   * Chains existing services to provide a single-call preview for the query gallery.
   * Returns data + WidgetConfig for immediate rendering.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  preview(
    params: CombinationPreviewParams,
    options?: RequestOptions,
  ): APIPromise<CombinationPreviewResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/combination/preview', {
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
 * Response from combination preview with data + resolved config.
 */
export interface CombinationPreviewResponse {
  /**
   * Whether preview succeeded
   */
  success: boolean;

  /**
   * Auto-generated title
   */
  auto_title?: string | null;

  /**
   * Whether the result was served from cache
   */
  cache_hit?: boolean;

  /**
   * Enriched column metadata
   */
  column_map?: Array<CombinationPreviewResponse.ColumnMap>;

  /**
   * Resolved WidgetConfig (from config builder)
   */
  config?: { [key: string]: unknown };

  /**
   * Query result rows
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * Compilation errors (if any)
   */
  errors?: Array<CompilerAPI.CompilerErrorItem>;

  /**
   * Total execution time in milliseconds
   */
  execution_time_ms?: number;

  /**
   * Resolved widget type (e.g. 'axis_metric_by_dimensiondate')
   */
  widget_type?: string | null;
}

export namespace CombinationPreviewResponse {
  /**
   * Maps a UUID column alias to its human-readable name and type.
   */
  export interface ColumnMap {
    /**
     * Field type: dimension, measure, or calculation
     */
    field_type: string;

    /**
     * UUID string used as SQL column alias
     */
    kater_id: string;

    /**
     * Human-readable column name
     */
    name: string;

    /**
     * Aggregation type for measures: sum, count, min, max, avg, unknown. None for
     * non-measures.
     */
    aggregation?: string | null;

    /**
     * Display label
     */
    label?: string | null;
  }
}

export interface CombinationPreviewParams {
  /**
   * Body param: Comma-separated slot selections, same format as
   * ResolveRequest.combination. Example:
   * 'dimension=due_month,measure=compliance_rate'
   */
  combination: string;

  /**
   * Body param: Connection to preview against
   */
  connection_id: string;

  /**
   * Body param: Query template reference (e.g. 'q:compliance_trend.\_base')
   */
  query_ref: string;

  /**
   * Body param: Tenant key for multi-tenant execution. Use 'kater_global_tenant' for
   * no-tenancy clients.
   */
  tenant_key: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export declare namespace Combination {
  export {
    type CombinationPreviewResponse as CombinationPreviewResponse,
    type CombinationPreviewParams as CombinationPreviewParams,
  };
}
