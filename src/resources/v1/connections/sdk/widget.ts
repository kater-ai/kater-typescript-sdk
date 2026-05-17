// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as CompilerAPI from '../../compiler/compiler';
import { APIPromise } from '../../../../core/api-promise';
import { buildHeaders } from '../../../../internal/headers';
import { RequestOptions } from '../../../../internal/request-options';

/**
 * SDK token management for embedded analytics
 */
export class Widget extends APIResource {
  /**
   * Regenerate SDK widget narrative metadata from post-query state mutation.
   *
   * This endpoint accepts post-query state changes for SDK widgets and returns
   * regenerated narrative metadata based on the transformed row set.
   *
   * The endpoint mirrors the compiler post-query mutation behavior but uses SDK
   * authentication and authorization context.
   *
   * Persistence behavior:
   *
   * - persist.mode="none": Returns metadata without saving state
   * - persist.mode="upsert": Saves state with revision tracking under SDK tenant
   *   scope
   */
  regenerateMetadata(
    params: WidgetRegenerateMetadataParams,
    options?: RequestOptions,
  ): APIPromise<WidgetRegenerateMetadataResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/sdk/widget/render/post-query', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
      __security: {},
    });
  }

  /**
   * Render a single SDK widget from a `RenderedQueryRequestV1` body.
   *
   * The handler:
   *
   * 1. Resolves the SDK filesystem.
   * 2. Calls `share_render_request_resolution(...)` with the SDK auth context.
   *    Tenant key comes from the SDK token's `tenant_key` claim.
   * 3. Awaits `RenderService.render(...)` for the full pipeline.
   * 4. Calls `share_response_metadata_builder(...)` with
   *    `route_label="sdk.widget_render"` and `validate_sort_by=True`.
   * 5. Projects the `RenderResponse` onto `SdkWidgetResponse` (the existing model
   *    from `routes/client/sdk/models.py:156`).
   *
   * Pydantic `extra="forbid"` rejects unknown request fields with HTTP 422.
   */
  render(params: WidgetRenderParams, options?: RequestOptions): APIPromise<WidgetRenderResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/sdk/widget/render', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
      __security: {},
    });
  }
}

/**
 * Response from post-query mutation endpoints.
 */
export interface WidgetRegenerateMetadataResponse {
  /**
   * Auto-generated description text
   */
  auto_description?: string | null;

  /**
   * Auto-generated structured description
   */
  auto_description_structured?: { [key: string]: unknown } | null;

  /**
   * Auto-generated title
   */
  auto_title?: string | null;

  /**
   * Schema for post-query refinements that run after SQL execution on returned
   * result rows
   */
  canonical_post_query_state?: WidgetRegenerateMetadataResponse.CanonicalPostQueryState | null;

  /**
   * Auto-generated footnote text
   */
  footnote?: string | null;

  /**
   * Auto-generated structured footnote
   */
  footnote_structured?: { [key: string]: unknown } | null;

  /**
   * Regenerated insight runs for transformed data
   */
  insight_runs?: Array<WidgetRegenerateMetadataResponse.InsightRun>;

  /**
   * Deterministic hash for narrative caching (null for unavailable)
   */
  post_query_key_id?: string | null;

  /**
   * Saved post-query state ID (null for unavailable responses)
   */
  post_query_state_id?: string | null;

  /**
   * Reason for unavailable status
   */
  reason?: string | null;

  /**
   * Scope metadata for post-query transformation results.
   */
  result_scope?: WidgetRegenerateMetadataResponse.ResultScope | null;

  /**
   * Current revision number (null for unavailable responses)
   */
  revision?: number | null;

  /**
   * Status for error cases ('unavailable', null for success)
   */
  status?: string | null;
}

export namespace WidgetRegenerateMetadataResponse {
  /**
   * Schema for post-query refinements that run after SQL execution on returned
   * result rows
   */
  export interface CanonicalPostQueryState {
    /**
     * Post-query filter definitions that apply to returned result rows
     */
    filters?: Array<CanonicalPostQueryState.Filter> | null;

    /**
     * Post-query sort definitions that apply to returned result rows
     */
    sorts?: Array<CanonicalPostQueryState.Sort> | null;
  }

  export namespace CanonicalPostQueryState {
    /**
     * A post-query filter definition for a specific field occurrence
     */
    export interface Filter {
      /**
       * Filter expression operator
       */
      expression: 'equals' | 'in' | 'between';

      /**
       * Field target using object form with ref and optional modifiers
       */
      field: Filter.Field;

      /**
       * Filter kind that determines UI control type
       */
      kind: 'date' | 'dropdown' | 'multiselect' | 'number_range';

      /**
       * Whether this filter should be enabled by default
       */
      default_enabled?: boolean | null;

      /**
       * Default value for the filter when enabled
       */
      default_value?:
        | string
        | number
        | boolean
        | Array<string | number | boolean>
        | Filter.DateRangeValue
        | Filter.NumberRangeValue
        | null;

      /**
       * Values source configuration for categorical filters
       */
      values?: Filter.Values | null;
    }

    export namespace Filter {
      /**
       * Field target using object form with ref and optional modifiers
       */
      export interface Field {
        /**
         * Reference to the field
         */
        ref: string;

        /**
         * Optional modifiers for the field (e.g. timeframe)
         */
        modifiers?: Array<Field.Modifier> | null;
      }

      export namespace Field {
        /**
         * A normalized modifier applied to a source field occurrence. The first contract
         * supports only timeframe modifiers.
         */
        export interface Modifier {
          /**
           * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
           */
          kind: 'timeframe';

          /**
           * Concrete modifier value. Canonical contexts omit raw timeframe instead of
           * storing value raw.
           */
          value: string;
        }
      }

      /**
       * Date range filter value
       */
      export interface DateRangeValue {
        mode: 'absolute_range' | 'relative_range';
      }

      /**
       * Number range filter value
       */
      export interface NumberRangeValue {
        /**
         * Maximum value (inclusive)
         */
        max: number;

        /**
         * Minimum value (inclusive)
         */
        min: number;
      }

      /**
       * Values source configuration for categorical filters
       */
      export interface Values {
        /**
         * Source of filter values
         */
        source: 'result_distinct';

        /**
         * Maximum number of values to show
         */
        limit?: number;

        /**
         * Whether the filter should be searchable
         */
        searchable?: boolean;

        /**
         * Sort order for values
         */
        sort?: 'asc' | 'desc';
      }
    }

    /**
     * A post-query sort definition for a specific field occurrence
     */
    export interface Sort {
      /**
       * Field target using object form with ref and optional modifiers
       */
      field: Sort.Field;

      /**
       * Default sort direction when enabled
       */
      default_direction?: 'asc' | 'desc' | null;

      /**
       * Whether this sort should be enabled by default
       */
      default_enabled?: boolean | null;

      /**
       * Sort priority for multi-field sorts (lower numbers sort first)
       */
      priority?: number | null;
    }

    export namespace Sort {
      /**
       * Field target using object form with ref and optional modifiers
       */
      export interface Field {
        /**
         * Reference to the field
         */
        ref: string;

        /**
         * Optional modifiers for the field (e.g. timeframe)
         */
        modifiers?: Array<Field.Modifier> | null;
      }

      export namespace Field {
        /**
         * A normalized modifier applied to a source field occurrence. The first contract
         * supports only timeframe modifiers.
         */
        export interface Modifier {
          /**
           * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
           */
          kind: 'timeframe';

          /**
           * Concrete modifier value. Canonical contexts omit raw timeframe instead of
           * storing value raw.
           */
          value: string;
        }
      }
    }
  }

  /**
   * Validated structured output for a completed insight run.
   */
  export interface InsightRun {
    /**
     * Typed execution context attached to an insight run result.
     */
    context?: InsightRun.Context | null;

    findings?: Array<InsightRun.Finding>;

    metadata?: { [key: string]: unknown } | null;

    /**
     * Top-level summary for an insight run.
     */
    summary?: InsightRun.Summary | null;
  }

  export namespace InsightRun {
    /**
     * Typed execution context attached to an insight run result.
     */
    export interface Context {
      /**
       * Execution metadata captured for a completed insight run.
       */
      execution: Context.Execution;

      /**
       * Insight definition metadata attached to a run result.
       */
      insight: Context.Insight;

      /**
       * Host surface metadata for the container that triggered the run.
       */
      host?: Context.Host | null;

      inputs?: Array<Context.Input>;
    }

    export namespace Context {
      /**
       * Execution metadata captured for a completed insight run.
       */
      export interface Execution {
        kater_id: string;

        surface: 'dashboard' | 'preview' | 'chat';

        params?: { [key: string]: unknown };
      }

      /**
       * Insight definition metadata attached to a run result.
       */
      export interface Insight {
        entrypoint: string;

        kater_id: string;

        name: string;

        description?: string | null;
      }

      /**
       * Host surface metadata for the container that triggered the run.
       */
      export interface Host {
        dashboard_kater_id?: string | null;

        dashboard_name?: string | null;

        query_kater_id?: string | null;

        query_name?: string | null;

        widget_kater_id?: string | null;
      }

      /**
       * Normalized input metadata attached to an insight run.
       */
      export interface Input {
        dataset_name: string;

        input_name: string;

        row_count: number;

        bindings?: { [key: string]: string };

        /**
         * Query metadata describing the source of an insight input.
         */
        query?: Input.Query | null;
      }

      export namespace Input {
        /**
         * Query metadata describing the source of an insight input.
         */
        export interface Query {
          description?: string | null;

          kater_id?: string | null;

          name?: string | null;

          rendered_query_key?: string | null;
        }
      }
    }

    /**
     * Single analytical finding emitted by an insight run.
     */
    export interface Finding {
      kind: string;

      summary: string;

      confidence?: number | null;

      details?: Array<string>;

      evidence?: Array<Finding.Evidence>;

      follow_ups?: Array<Finding.FollowUp>;

      metadata?: { [key: string]: unknown } | null;

      severity?: 'info' | 'positive' | 'warning' | 'critical' | null;
    }

    export namespace Finding {
      /**
       * Structured evidence attached to a finding.
       */
      export interface Evidence {
        label: string;

        value: string | number | boolean;

        description?: string | null;
      }

      /**
       * Structured action hint emitted by an insight finding.
       */
      export interface FollowUp {
        id: string;

        instructions: string;

        label: string;

        payload?: { [key: string]: unknown } | null;
      }
    }

    /**
     * Top-level summary for an insight run.
     */
    export interface Summary {
      text: string;

      confidence?: number | null;

      severity?: 'info' | 'positive' | 'warning' | 'critical' | null;
    }
  }

  /**
   * Scope metadata for post-query transformation results.
   */
  export interface ResultScope {
    /**
     * Number of base rows before post-query transformation
     */
    base_row_count: number;

    /**
     * Whether more rows are available beyond the current set
     */
    has_more: boolean;

    /**
     * Whether the result is limited by row count restrictions
     */
    is_row_limited: boolean;

    /**
     * Scope of transformation: 'available_rows', etc.
     */
    scope: string;

    /**
     * Number of rows after post-query transformation
     */
    transformed_row_count: number;
  }
}

/**
 * Response from the structured SDK widget render route.
 *
 * Returns a single widget's data + config for SDK consumers, plus a canonical
 * `rendered_query_key` for stable cross-consumer identity. Shape matches
 * CombinationPreviewResponse (minus internal metrics).
 */
export interface WidgetRenderResponse {
  /**
   * Whether the preview succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state for this widget preview
   */
  applied_filter_state?: Array<WidgetRenderResponse.AppliedFilterState>;

  /**
   * Auto-generated title
   */
  auto_title?: string | null;

  /**
   * Column metadata
   */
  column_map?: Array<WidgetRenderResponse.ColumnMap>;

  /**
   * Per-column statistical profiles keyed by kater_id (UUID column alias).
   */
  column_profiles?: { [key: string]: WidgetRenderResponse.ColumnProfiles };

  /**
   * Resolved WidgetConfig
   */
  config?: { [key: string]: unknown };

  /**
   * Backend-owned widget config controls for the query builder panel.
   */
  config_controls?: WidgetRenderResponse.ConfigControls;

  /**
   * Query result rows
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * Default runtime filter state for this widget preview
   */
  default_filter_state?: Array<WidgetRenderResponse.DefaultFilterState>;

  /**
   * Warehouse dialect (e.g. snowflake, postgresql, databricks)
   */
  dialect?: string | null;

  /**
   * Compilation errors
   */
  errors?: Array<CompilerAPI.CompilerErrorItem>;

  /**
   * Resolved effective filter definitions for this widget preview
   */
  filter_definitions?: Array<WidgetRenderResponse.FilterDefinition>;

  /**
   * Whether additional table rows can be fetched with next_cursor
   */
  has_more?: boolean;

  /**
   * Structured runtime insight results for this widget preview.
   */
  insight_runs?: Array<WidgetRenderResponse.InsightRun>;

  /**
   * True when the app-wide row limit was applied and results were truncated
   */
  is_row_limited?: boolean;

  /**
   * Opaque cursor for fetching the next table page
   */
  next_cursor?: string | null;

  /**
   * Number of rows requested per table page
   */
  page_size?: number | null;

  /**
   * Derived post-query filter and sort definitions keyed by occurrence identity.
   */
  post_query_refinements?: { [key: string]: unknown };

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants:
   *
   * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: WidgetRenderResponse.RenderedQueryKey | null;

  /**
   * Total rows represented by this widget result
   */
  row_count?: number;

  /**
   * Compiled SQL query
   */
  sql?: string | null;

  /**
   * Totals row over returned measure columns (UUID alias keys)
   */
  totals_row?: { [key: string]: unknown } | null;

  /**
   * Resolved widget type
   */
  widget_type?: string | null;
}

export namespace WidgetRenderResponse {
  /**
   * Resolved runtime filter state exposed by the V2 API contract.
   */
  export interface AppliedFilterState {
    /**
     * Stable effective runtime filter ID
     */
    effective_kater_id: string;

    /**
     * Whether the filter is enabled at runtime
     */
    enabled: boolean;

    /**
     * Logical filter name
     */
    name: string;

    /**
     * Whether the filter is required
     */
    required: boolean;

    /**
     * Interactive filter control type
     */
    filter_type?: string | null;

    /**
     * Human-readable filter label
     */
    label?: string | null;

    /**
     * Current typed runtime value
     */
    value?:
      | AppliedFilterState.ScalarFilterValue
      | AppliedFilterState.MultiFilterValue
      | AppliedFilterState.NumberRangeFilterValue
      | AppliedFilterState.AbsoluteDateFilterValue
      | AppliedFilterState.AbsoluteRangeFilterValue
      | AppliedFilterState.RelativeRangeFilterValue
      | AppliedFilterState.PresetReferenceFilterValue
      | AppliedFilterState.NullFilterValue
      | null;
  }

  export namespace AppliedFilterState {
    export interface ScalarFilterValue {
      /**
       * Scalar value compatible with Filter V2 runtime payloads
       */
      value: string | number | boolean;

      mode?: 'scalar';
    }

    export interface MultiFilterValue {
      /**
       * List of scalar runtime values
       */
      values: Array<string | number | boolean>;

      mode?: 'multi';
    }

    export interface NumberRangeFilterValue {
      end: number;

      start: number;

      mode?: 'number_range';
    }

    export interface AbsoluteDateFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      value: string;

      mode?: 'absolute_date';
    }

    export interface AbsoluteRangeFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      end: string;

      /**
       * Absolute DATE or TIMESTAMP string
       */
      start: string;

      mode?: 'absolute_range';
    }

    export interface RelativeRangeFilterValue {
      end: RelativeRangeFilterValue.RelativeOffsetBoundary | RelativeRangeFilterValue.RelativeAnchorBoundary;

      start:
        | RelativeRangeFilterValue.RelativeOffsetBoundary
        | RelativeRangeFilterValue.RelativeAnchorBoundary;

      mode?: 'relative_range';
    }

    export namespace RelativeRangeFilterValue {
      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }

      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }
    }

    export interface PresetReferenceFilterValue {
      /**
       * Stable preset key matching presets[].name
       */
      preset: string;

      mode?: 'preset';
    }

    export interface NullFilterValue {
      mode?: 'null';
    }
  }

  /**
   * Maps a UUID column alias to its human-readable name and type.
   */
  export interface ColumnMap {
    /**
     * Canonical column type metadata for post-query contracts
     */
    column_type: { [key: string]: unknown };

    /**
     * Canonical data type metadata for this output column
     */
    data_type: ColumnMap.DataType;

    /**
     * Field type: dimension, measure, or calculation
     */
    field_type: string;

    /**
     * Source field name
     */
    source_name: string;

    /**
     * Backward-compatible timeframe modifier value.
     */
    active_timeframe?: string | null;

    /**
     * Aggregation type for measures: sum, count, min, max, avg, unknown. None for
     * non-measures.
     */
    aggregation?: string | null;

    /**
     * SQL result alias for this concrete output column.
     */
    column_key?: string | null;

    /**
     * Backend-provided display label
     */
    display_label?: string | null;

    /**
     * Normalized modifiers for this output occurrence. Raw timeframe is represented by
     * an empty array.
     */
    modifiers?: Array<ColumnMap.Modifier>;

    /**
     * Stable source field UUID for this output occurrence.
     */
    source_kater_id?: string | null;

    /**
     * Source field label
     */
    source_label?: string | null;
  }

  export namespace ColumnMap {
    /**
     * Canonical data type metadata for this output column
     */
    export interface DataType {
      /**
       * The canonical data type kind
       */
      kind: 'Bool' | 'Text' | 'Number' | 'Datetime' | 'Complex' | 'Unknown';

      /**
       * Whether the field can be null
       */
      nullable: boolean;

      /**
       * Vendor-specific type extension
       */
      extension?: DataType.Extension | null;

      /**
       * Optional coarse metadata for the canonical type
       */
      params?: unknown;
    }

    export namespace DataType {
      /**
       * Vendor-specific type extension
       */
      export interface Extension {
        /**
         * Database engine/dialect
         */
        engine: string;

        /**
         * Original type name in the source database
         */
        orig_type: string;

        /**
         * Additional vendor-specific options
         */
        options?: { [key: string]: unknown } | null;

        /**
         * Raw DDL for the type
         */
        raw_ddl?: string | null;
      }
    }

    /**
     * A normalized modifier applied to a source field occurrence. The first contract
     * supports only timeframe modifiers.
     */
    export interface Modifier {
      /**
       * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
       */
      kind: 'timeframe';

      /**
       * Concrete modifier value. Canonical contexts omit raw timeframe instead of
       * storing value raw.
       */
      value: string;
    }
  }

  /**
   * Statistical profile for a single result column.
   */
  export interface ColumnProfiles {
    /**
     * Distinct non-null values for dimension columns. Null for measures and
     * calculations.
     */
    cardinality?: number | null;

    /**
     * Coefficient of variation (|stdev / mean|).
     */
    cv?: number | null;

    /**
     * True if any value lies outside [q1 - 1.5*IQR, q3 + 1.5*IQR].
     */
    has_outliers?: boolean;

    /**
     * Interquartile range (q3 - q1).
     */
    iqr?: number | null;

    /**
     * Maximum numeric value.
     */
    max?: number | null;

    /**
     * Arithmetic mean.
     */
    mean?: number | null;

    /**
     * Minimum numeric value. Null when the column has no numeric data.
     */
    min?: number | null;

    /**
     * Number of null values in the column.
     */
    null_count?: number;

    /**
     * Fraction of null values (0.0-1.0).
     */
    null_pct?: number;

    /**
     * First quartile (25th percentile).
     */
    q1?: number | null;

    /**
     * Third quartile (75th percentile).
     */
    q3?: number | null;

    /**
     * Population standard deviation.
     */
    stdev?: number | null;
  }

  /**
   * Backend-owned widget config controls for the query builder panel.
   */
  export interface ConfigControls {
    /**
     * Chart config controls keyed by field name
     */
    chart?: { [key: string]: ConfigControls.Chart };
  }

  export namespace ConfigControls {
    /**
     * Backend-owned metadata for a widget config control.
     */
    export interface Chart {
      /**
       * Selectable options for the control when applicable
       */
      options?: Array<Chart.Option>;
    }

    export namespace Chart {
      /**
       * Single select option for a backend-owned widget config control.
       */
      export interface Option {
        /**
         * Human-readable display label
         */
        label: string;

        /**
         * Underlying config value
         */
        value: string;
      }
    }
  }

  /**
   * Resolved runtime filter state exposed by the V2 API contract.
   */
  export interface DefaultFilterState {
    /**
     * Stable effective runtime filter ID
     */
    effective_kater_id: string;

    /**
     * Whether the filter is enabled at runtime
     */
    enabled: boolean;

    /**
     * Logical filter name
     */
    name: string;

    /**
     * Whether the filter is required
     */
    required: boolean;

    /**
     * Interactive filter control type
     */
    filter_type?: string | null;

    /**
     * Human-readable filter label
     */
    label?: string | null;

    /**
     * Current typed runtime value
     */
    value?:
      | DefaultFilterState.ScalarFilterValue
      | DefaultFilterState.MultiFilterValue
      | DefaultFilterState.NumberRangeFilterValue
      | DefaultFilterState.AbsoluteDateFilterValue
      | DefaultFilterState.AbsoluteRangeFilterValue
      | DefaultFilterState.RelativeRangeFilterValue
      | DefaultFilterState.PresetReferenceFilterValue
      | DefaultFilterState.NullFilterValue
      | null;
  }

  export namespace DefaultFilterState {
    export interface ScalarFilterValue {
      /**
       * Scalar value compatible with Filter V2 runtime payloads
       */
      value: string | number | boolean;

      mode?: 'scalar';
    }

    export interface MultiFilterValue {
      /**
       * List of scalar runtime values
       */
      values: Array<string | number | boolean>;

      mode?: 'multi';
    }

    export interface NumberRangeFilterValue {
      end: number;

      start: number;

      mode?: 'number_range';
    }

    export interface AbsoluteDateFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      value: string;

      mode?: 'absolute_date';
    }

    export interface AbsoluteRangeFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      end: string;

      /**
       * Absolute DATE or TIMESTAMP string
       */
      start: string;

      mode?: 'absolute_range';
    }

    export interface RelativeRangeFilterValue {
      end: RelativeRangeFilterValue.RelativeOffsetBoundary | RelativeRangeFilterValue.RelativeAnchorBoundary;

      start:
        | RelativeRangeFilterValue.RelativeOffsetBoundary
        | RelativeRangeFilterValue.RelativeAnchorBoundary;

      mode?: 'relative_range';
    }

    export namespace RelativeRangeFilterValue {
      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }

      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }
    }

    export interface PresetReferenceFilterValue {
      /**
       * Stable preset key matching presets[].name
       */
      preset: string;

      mode?: 'preset';
    }

    export interface NullFilterValue {
      mode?: 'null';
    }
  }

  /**
   * Resolved effective filter definition exposed by the V2 API contract.
   */
  export interface FilterDefinition {
    /**
     * Canonical data type
     */
    data_type: string;

    /**
     * Stable effective runtime filter ID
     */
    effective_kater_id: string;

    /**
     * Structured filter expression
     */
    expression: string;

    /**
     * Target field ref
     */
    field: string;

    /**
     * Concrete declaration ID from the merged definition
     */
    kater_id: string;

    /**
     * Filter mode: static or parameterized
     */
    mode: string;

    /**
     * Logical filter name
     */
    name: string;

    /**
     * Whether the filter is always active
     */
    required: boolean;

    /**
     * Filter scope: model, topic, dashboard, or query
     */
    scope: string;

    /**
     * AI-facing filter context
     */
    ai_context?: string | null;

    /**
     * Whether null is allowed
     */
    allow_null_value?: boolean | null;

    /**
     * Concrete declaration IDs that contributed to this effective filter
     */
    declaration_kater_ids?: Array<string>;

    /**
     * Default enabled state
     */
    default_enabled?: boolean | null;

    /**
     * Default runtime value payload
     */
    default_value?:
      | FilterDefinition.ScalarFilterValue
      | FilterDefinition.MultiFilterValue
      | FilterDefinition.NumberRangeFilterValue
      | FilterDefinition.AbsoluteDateFilterValue
      | FilterDefinition.AbsoluteRangeFilterValue
      | FilterDefinition.RelativeRangeFilterValue
      | FilterDefinition.PresetReferenceFilterValue
      | FilterDefinition.NullFilterValue
      | null;

    /**
     * Filter description
     */
    description?: string | null;

    /**
     * Interactive filter control type
     */
    filter_type?: string | null;

    /**
     * Optional UI help text
     */
    help_text?: string | null;

    /**
     * Human-readable filter label
     */
    label?: string | null;

    /**
     * Null option label
     */
    null_label?: string | null;

    /**
     * Owner IDs from model/topic/dashboard/query precedence order
     */
    owner_chain?: Array<string>;

    /**
     * Optional input placeholder
     */
    placeholder?: string | null;

    /**
     * Filter preset definitions
     */
    presets?: Array<FilterDefinition.Preset> | null;

    /**
     * Static filter value payload
     */
    static_value?:
      | string
      | number
      | boolean
      | Array<string | number | boolean>
      | FilterDefinition.NumberRangeFilterValue
      | FilterDefinition.AbsoluteDateFilterValue
      | FilterDefinition.AbsoluteRangeFilterValue
      | FilterDefinition.RelativeRangeFilterValue
      | null;

    /**
     * Selectable values metadata
     */
    values?:
      | FilterDefinition.StaticFilterValuesSource
      | FilterDefinition.DynamicDistinctFilterValuesSource
      | null;
  }

  export namespace FilterDefinition {
    export interface ScalarFilterValue {
      /**
       * Scalar value compatible with Filter V2 runtime payloads
       */
      value: string | number | boolean;

      mode?: 'scalar';
    }

    export interface MultiFilterValue {
      /**
       * List of scalar runtime values
       */
      values: Array<string | number | boolean>;

      mode?: 'multi';
    }

    export interface NumberRangeFilterValue {
      end: number;

      start: number;

      mode?: 'number_range';
    }

    export interface AbsoluteDateFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      value: string;

      mode?: 'absolute_date';
    }

    export interface AbsoluteRangeFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      end: string;

      /**
       * Absolute DATE or TIMESTAMP string
       */
      start: string;

      mode?: 'absolute_range';
    }

    export interface RelativeRangeFilterValue {
      end: RelativeRangeFilterValue.RelativeOffsetBoundary | RelativeRangeFilterValue.RelativeAnchorBoundary;

      start:
        | RelativeRangeFilterValue.RelativeOffsetBoundary
        | RelativeRangeFilterValue.RelativeAnchorBoundary;

      mode?: 'relative_range';
    }

    export namespace RelativeRangeFilterValue {
      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }

      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }
    }

    export interface PresetReferenceFilterValue {
      /**
       * Stable preset key matching presets[].name
       */
      preset: string;

      mode?: 'preset';
    }

    export interface NullFilterValue {
      mode?: 'null';
    }

    export interface Preset {
      /**
       * Human-readable preset label
       */
      label: string;

      /**
       * Stable preset key
       */
      name: string;

      /**
       * Typed preset value payload
       */
      value:
        | Preset.ScalarFilterValue
        | Preset.MultiFilterValue
        | Preset.NumberRangeFilterValue
        | Preset.AbsoluteDateFilterValue
        | Preset.AbsoluteRangeFilterValue
        | Preset.RelativeRangeFilterValue
        | Preset.PresetReferenceFilterValue
        | Preset.NullFilterValue;
    }

    export namespace Preset {
      export interface ScalarFilterValue {
        /**
         * Scalar value compatible with Filter V2 runtime payloads
         */
        value: string | number | boolean;

        mode?: 'scalar';
      }

      export interface MultiFilterValue {
        /**
         * List of scalar runtime values
         */
        values: Array<string | number | boolean>;

        mode?: 'multi';
      }

      export interface NumberRangeFilterValue {
        end: number;

        start: number;

        mode?: 'number_range';
      }

      export interface AbsoluteDateFilterValue {
        /**
         * Absolute DATE or TIMESTAMP string
         */
        value: string;

        mode?: 'absolute_date';
      }

      export interface AbsoluteRangeFilterValue {
        /**
         * Absolute DATE or TIMESTAMP string
         */
        end: string;

        /**
         * Absolute DATE or TIMESTAMP string
         */
        start: string;

        mode?: 'absolute_range';
      }

      export interface RelativeRangeFilterValue {
        end:
          | RelativeRangeFilterValue.RelativeOffsetBoundary
          | RelativeRangeFilterValue.RelativeAnchorBoundary;

        start:
          | RelativeRangeFilterValue.RelativeOffsetBoundary
          | RelativeRangeFilterValue.RelativeAnchorBoundary;

        mode?: 'relative_range';
      }

      export namespace RelativeRangeFilterValue {
        export interface RelativeOffsetBoundary {
          amount: number;

          direction: 'ago' | 'ahead';

          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        export interface RelativeAnchorBoundary {
          anchor: 'today' | 'now';
        }

        export interface RelativeOffsetBoundary {
          amount: number;

          direction: 'ago' | 'ahead';

          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        export interface RelativeAnchorBoundary {
          anchor: 'today' | 'now';
        }
      }

      export interface PresetReferenceFilterValue {
        /**
         * Stable preset key matching presets[].name
         */
        preset: string;

        mode?: 'preset';
      }

      export interface NullFilterValue {
        mode?: 'null';
      }
    }

    export interface NumberRangeFilterValue {
      end: number;

      start: number;

      mode?: 'number_range';
    }

    export interface AbsoluteDateFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      value: string;

      mode?: 'absolute_date';
    }

    export interface AbsoluteRangeFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      end: string;

      /**
       * Absolute DATE or TIMESTAMP string
       */
      start: string;

      mode?: 'absolute_range';
    }

    export interface RelativeRangeFilterValue {
      end: RelativeRangeFilterValue.RelativeOffsetBoundary | RelativeRangeFilterValue.RelativeAnchorBoundary;

      start:
        | RelativeRangeFilterValue.RelativeOffsetBoundary
        | RelativeRangeFilterValue.RelativeAnchorBoundary;

      mode?: 'relative_range';
    }

    export namespace RelativeRangeFilterValue {
      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }

      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }
    }

    export interface StaticFilterValuesSource {
      /**
       * Inline selectable items
       */
      items: Array<StaticFilterValuesSource.Item>;

      source?: 'static';
    }

    export namespace StaticFilterValuesSource {
      export interface Item {
        /**
         * Scalar value compatible with Filter V2 runtime payloads
         */
        value: string | number | boolean;

        /**
         * Optional selectable value label
         */
        label?: string | null;
      }
    }

    export interface DynamicDistinctFilterValuesSource {
      /**
       * Maximum number of values to request
       */
      limit?: number | null;

      /**
       * Supported sort order for dynamic distinct value loading
       */
      sort?: 'asc' | 'desc' | null;

      source?: 'dynamic_distinct';
    }
  }

  /**
   * Validated structured output for a completed insight run.
   */
  export interface InsightRun {
    /**
     * Typed execution context attached to an insight run result.
     */
    context?: InsightRun.Context | null;

    findings?: Array<InsightRun.Finding>;

    metadata?: { [key: string]: unknown } | null;

    /**
     * Top-level summary for an insight run.
     */
    summary?: InsightRun.Summary | null;
  }

  export namespace InsightRun {
    /**
     * Typed execution context attached to an insight run result.
     */
    export interface Context {
      /**
       * Execution metadata captured for a completed insight run.
       */
      execution: Context.Execution;

      /**
       * Insight definition metadata attached to a run result.
       */
      insight: Context.Insight;

      /**
       * Host surface metadata for the container that triggered the run.
       */
      host?: Context.Host | null;

      inputs?: Array<Context.Input>;
    }

    export namespace Context {
      /**
       * Execution metadata captured for a completed insight run.
       */
      export interface Execution {
        kater_id: string;

        surface: 'dashboard' | 'preview' | 'chat';

        params?: { [key: string]: unknown };
      }

      /**
       * Insight definition metadata attached to a run result.
       */
      export interface Insight {
        entrypoint: string;

        kater_id: string;

        name: string;

        description?: string | null;
      }

      /**
       * Host surface metadata for the container that triggered the run.
       */
      export interface Host {
        dashboard_kater_id?: string | null;

        dashboard_name?: string | null;

        query_kater_id?: string | null;

        query_name?: string | null;

        widget_kater_id?: string | null;
      }

      /**
       * Normalized input metadata attached to an insight run.
       */
      export interface Input {
        dataset_name: string;

        input_name: string;

        row_count: number;

        bindings?: { [key: string]: string };

        /**
         * Query metadata describing the source of an insight input.
         */
        query?: Input.Query | null;
      }

      export namespace Input {
        /**
         * Query metadata describing the source of an insight input.
         */
        export interface Query {
          description?: string | null;

          kater_id?: string | null;

          name?: string | null;

          rendered_query_key?: string | null;
        }
      }
    }

    /**
     * Single analytical finding emitted by an insight run.
     */
    export interface Finding {
      kind: string;

      summary: string;

      confidence?: number | null;

      details?: Array<string>;

      evidence?: Array<Finding.Evidence>;

      follow_ups?: Array<Finding.FollowUp>;

      metadata?: { [key: string]: unknown } | null;

      severity?: 'info' | 'positive' | 'warning' | 'critical' | null;
    }

    export namespace Finding {
      /**
       * Structured evidence attached to a finding.
       */
      export interface Evidence {
        label: string;

        value: string | number | boolean;

        description?: string | null;
      }

      /**
       * Structured action hint emitted by an insight finding.
       */
      export interface FollowUp {
        id: string;

        instructions: string;

        label: string;

        payload?: { [key: string]: unknown } | null;
      }
    }

    /**
     * Top-level summary for an insight run.
     */
    export interface Summary {
      text: string;

      confidence?: number | null;

      severity?: 'info' | 'positive' | 'warning' | 'critical' | null;
    }
  }

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants:
   *
   * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
   */
  export interface RenderedQueryKey {
    /**
     * rqk_cache_agg_v2:<sha256-hex> or null when not eligible
     */
    aggregate_cache_key_id: string | null;

    /**
     * The canonical sub-document. Hashing this produces `key_id`.
     */
    canonical: RenderedQueryKey.Canonical;

    /**
     * rqk_cache_exact_v2:<sha256-hex>
     */
    exact_cache_key_id: string;

    /**
     * rqk_v2:<sha256-hex>
     */
    key_id: string;

    version: 2;
  }

  export namespace RenderedQueryKey {
    /**
     * The canonical sub-document. Hashing this produces `key_id`.
     */
    export interface Canonical {
      /**
       * Cache projection sub-document of `canonical`. The projection itself contains no
       * derived cache key IDs — those IDs are derived from it and live at the top level.
       */
      cache_projection: Canonical.CacheProjection;

      /**
       * Identifies the canonicalization contract that produced this key.
       *
       * Changes to any of these values mean the meaning of the key has changed and
       * consumers must treat it as a new key.
       */
      contract: Canonical.Contract;

      /**
       * Null-filled for standalone query execution; populated for dashboard widgets.
       */
      dashboard: Canonical.Dashboard;

      /**
       * Selected, active, and output field lists that participate in compile and widget
       * roles. Ordering rules: selected/active are sorted by stable identity;
       * output_columns preserves output order.
       */
      fields: Canonical.Fields;

      /**
       * Effective filter state (model + topic + dashboard + query, after resolution).
       */
      filters: Canonical.Filters;

      /**
       * Non-data inputs that affect widget config, narrative, chart rendering, and SDK
       * rendering behavior. `display`, `chart`, and `style` are the only free-form JSON
       * sections in the canonical key.
       */
      presentation: Canonical.Presentation;

      /**
       * Anchors the rendered result to the query template and its selected field shape.
       */
      query: Canonical.Query;

      /**
       * Identifies the returned window of rows. `sort_by`, when present, is a
       * column_key.
       */
      result_window: Canonical.ResultWindow;

      /**
       * Identifies the exact Kater source bundle used to resolve and compile.
       */
      source: Canonical.Source;

      /**
       * Request clock context — makes date-relative filters deterministic.
       *
       * Selected date-grain identity lives in `fields.*.modifiers` and
       * `fields.output_columns[].column_key`, not here.
       */
      temporal: Canonical.Temporal;

      /**
       * Hard tenant identity boundary.
       */
      tenant: Canonical.Tenant;

      variables: Array<Canonical.Variable>;
    }

    export namespace Canonical {
      /**
       * Cache projection sub-document of `canonical`. The projection itself contains no
       * derived cache key IDs — those IDs are derived from it and live at the top level.
       */
      export interface CacheProjection {
        /**
         * Projection used to derive `aggregate_cache_key_id`. Null when not eligible.
         */
        aggregate: CacheProjection.Aggregate | null;

        /**
         * Projection used to derive `exact_cache_key_id`.
         */
        exact: CacheProjection.Exact;

        version: 2;
      }

      export namespace CacheProjection {
        /**
         * Projection used to derive `aggregate_cache_key_id`. Null when not eligible.
         */
        export interface Aggregate {
          client_id: string;

          connection_kater_id: string;

          dimensions: Array<Aggregate.Dimension>;

          filters: Array<Aggregate.Filter>;

          measures: Array<Aggregate.Measure>;

          query_kater_id: string;

          resolved_query_fingerprint: string;

          source_fingerprint: string;

          tenant_database: string | null;

          tenant_key: string;

          variables: Array<Aggregate.Variable>;
        }

        export namespace Aggregate {
          /**
           * Dimension entry inside the aggregate cache projection.
           *
           * `source_kater_id` plus normalized modifiers identify the projected source
           * dimension in cache projections.
           */
          export interface Dimension {
            column_key: string;

            modifiers: Array<Dimension.Modifier>;

            source_kater_id: string;
          }

          export namespace Dimension {
            /**
             * A normalized modifier applied to a source field occurrence. The first contract
             * supports only timeframe modifiers.
             */
            export interface Modifier {
              /**
               * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
               */
              kind: 'timeframe';

              /**
               * Concrete modifier value. Canonical contexts omit raw timeframe instead of
               * storing value raw.
               */
              value: string;
            }
          }

          /**
           * Filter entry inside an exact or aggregate cache projection.
           */
          export interface Filter {
            effective_kater_id: string;

            enabled: boolean;

            expression: string;

            field_column_key: string | null;

            field_kater_id: string | null;

            field_modifiers: Array<Filter.FieldModifier> | null;

            field_source_kater_id: string | null;

            normalized_value: string | null;
          }

          export namespace Filter {
            /**
             * A normalized modifier applied to a source field occurrence. The first contract
             * supports only timeframe modifiers.
             */
            export interface FieldModifier {
              /**
               * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
               */
              kind: 'timeframe';

              /**
               * Concrete modifier value. Canonical contexts omit raw timeframe instead of
               * storing value raw.
               */
              value: string;
            }
          }

          /**
           * Measure entry inside the aggregate cache projection.
           *
           * `aggregation` is required (no None): an eligible aggregate cache always has a
           * concrete aggregation function.
           */
          export interface Measure {
            aggregation: 'sum' | 'count' | 'min' | 'max' | 'avg' | 'unknown';

            column_key: string;

            kater_id: string;

            modifiers?: Array<Measure.Modifier>;

            source_kater_id?: string | null;
          }

          export namespace Measure {
            /**
             * A normalized modifier applied to a source field occurrence. The first contract
             * supports only timeframe modifiers.
             */
            export interface Modifier {
              /**
               * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
               */
              kind: 'timeframe';

              /**
               * Concrete modifier value. Canonical contexts omit raw timeframe instead of
               * storing value raw.
               */
              value: string;
            }
          }

          /**
           * Variable entry inside an exact or aggregate cache projection.
           */
          export interface Variable {
            name: string;

            normalized_value: string;

            query_kater_id: string;

            variable_kater_id: string | null;
          }
        }

        /**
         * Projection used to derive `exact_cache_key_id`.
         */
        export interface Exact {
          client_id: string;

          connection_kater_id: string;

          filters: Array<Exact.Filter>;

          output_columns: Array<Exact.OutputColumn>;

          query_kater_id: string;

          resolved_query_fingerprint: string;

          /**
           * Result window subset inside the exact cache projection.
           *
           * Mirrors `RenderedQueryResultWindowV1` field-for-field today; kept distinct so
           * cache-only changes do not perturb the canonical block hash, and so codegen emits
           * a TypeScript type local to the cache projection per the PRD shape.
           */
          result_window: Exact.ResultWindow;

          source_fingerprint: string;

          tenant_database: string | null;

          tenant_key: string;

          variables: Array<Exact.Variable>;
        }

        export namespace Exact {
          /**
           * Filter entry inside an exact or aggregate cache projection.
           */
          export interface Filter {
            effective_kater_id: string;

            enabled: boolean;

            expression: string;

            field_column_key: string | null;

            field_kater_id: string | null;

            field_modifiers: Array<Filter.FieldModifier> | null;

            field_source_kater_id: string | null;

            normalized_value: string | null;
          }

          export namespace Filter {
            /**
             * A normalized modifier applied to a source field occurrence. The first contract
             * supports only timeframe modifiers.
             */
            export interface FieldModifier {
              /**
               * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
               */
              kind: 'timeframe';

              /**
               * Concrete modifier value. Canonical contexts omit raw timeframe instead of
               * storing value raw.
               */
              value: string;
            }
          }

          /**
           * Column entry inside the exact cache projection.
           */
          export interface OutputColumn {
            column_key: string;

            field_type: 'dimension' | 'measure' | 'calculation';

            kater_id: string;

            modifiers: Array<OutputColumn.Modifier>;

            source_kater_id: string | null;
          }

          export namespace OutputColumn {
            /**
             * A normalized modifier applied to a source field occurrence. The first contract
             * supports only timeframe modifiers.
             */
            export interface Modifier {
              /**
               * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
               */
              kind: 'timeframe';

              /**
               * Concrete modifier value. Canonical contexts omit raw timeframe instead of
               * storing value raw.
               */
              value: string;
            }
          }

          /**
           * Result window subset inside the exact cache projection.
           *
           * Mirrors `RenderedQueryResultWindowV1` field-for-field today; kept distinct so
           * cache-only changes do not perturb the canonical block hash, and so codegen emits
           * a TypeScript type local to the cache projection per the PRD shape.
           */
          export interface ResultWindow {
            cursor: string | null;

            effective_limit: number | null;

            max_row_limit: number | null;

            page_size: number | null;

            query_limit: number | null;

            sort_by: string | null;

            sort_order: 'asc' | 'desc' | null;
          }

          /**
           * Variable entry inside an exact or aggregate cache projection.
           */
          export interface Variable {
            name: string;

            normalized_value: string;

            query_kater_id: string;

            variable_kater_id: string | null;
          }
        }
      }

      /**
       * Identifies the canonicalization contract that produced this key.
       *
       * Changes to any of these values mean the meaning of the key has changed and
       * consumers must treat it as a new key.
       */
      export interface Contract {
        compiler_version: string;

        filter_state_version: 2;

        key_schema: 'RenderedQueryKeyV2';

        key_version: 2;

        widget_config_version: string;
      }

      /**
       * Null-filled for standalone query execution; populated for dashboard widgets.
       */
      export interface Dashboard {
        dashboard_filter_state: Array<Dashboard.DashboardFilterState>;

        dashboard_kater_id: string | null;

        dashboard_name: string | null;

        slot_name: string | null;

        widget_kater_id: string | null;

        widget_name: string | null;
      }

      export namespace Dashboard {
        /**
         * Shared dashboard filter state mapped to slot-specific effective filters.
         */
        export interface DashboardFilterState {
          applied_slot_effective_kater_ids: Array<string>;

          dashboard_effective_kater_id: string;

          enabled: boolean;

          normalized_value: string | null;

          value: string | number | boolean | Array<unknown> | { [key: string]: unknown } | null;
        }
      }

      /**
       * Selected, active, and output field lists that participate in compile and widget
       * roles. Ordering rules: selected/active are sorted by stable identity;
       * output_columns preserves output order.
       */
      export interface Fields {
        active_fields: Array<Fields.ActiveField>;

        output_columns: Array<Fields.OutputColumn>;

        selected_fields: Array<Fields.SelectedField>;

        required_fields?: Array<Fields.RequiredField>;
      }

      export namespace Fields {
        /**
         * A selected/active source field entry — strict subset of the field item.
         */
        export interface ActiveField {
          field_type: 'dimension' | 'measure' | 'calculation';

          modifiers: Array<ActiveField.Modifier>;

          source_kater_id: string;
        }

        export namespace ActiveField {
          /**
           * A normalized modifier applied to a source field occurrence. The first contract
           * supports only timeframe modifiers.
           */
          export interface Modifier {
            /**
             * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
             */
            kind: 'timeframe';

            /**
             * Concrete modifier value. Canonical contexts omit raw timeframe instead of
             * storing value raw.
             */
            value: string;
          }
        }

        /**
         * An output column entry in `canonical.fields.output_columns`.
         */
        export interface OutputColumn {
          aggregation: 'sum' | 'count' | 'min' | 'max' | 'avg' | 'unknown' | null;

          /**
           * SQL result alias / row payload key
           */
          column_key: string;

          display_label: string | null;

          field_type: 'dimension' | 'measure' | 'calculation';

          /**
           * Normalized modifiers for this output occurrence
           */
          modifiers: Array<OutputColumn.Modifier>;

          /**
           * Zero-based output column position
           */
          output_index: number;

          role: string | null;

          slot: 'required' | 'optional';

          /**
           * Stable source field UUID for this output occurrence
           */
          source_kater_id: string;

          source_label: string | null;

          source_name: string;

          /**
           * Backward-compatible timeframe modifier value.
           */
          active_timeframe?: string | null;

          /**
           * Data type specification
           */
          data_type?: OutputColumn.DataType;

          /**
           * Backward-compatible alias for source_kater_id.
           */
          kater_id?: string | null;

          /**
           * Backward-compatible display label.
           */
          label?: string | null;

          /**
           * Backward-compatible alias for source_name.
           */
          name?: string | null;
        }

        export namespace OutputColumn {
          /**
           * A normalized modifier applied to a source field occurrence. The first contract
           * supports only timeframe modifiers.
           */
          export interface Modifier {
            /**
             * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
             */
            kind: 'timeframe';

            /**
             * Concrete modifier value. Canonical contexts omit raw timeframe instead of
             * storing value raw.
             */
            value: string;
          }

          /**
           * Data type specification
           */
          export interface DataType {
            /**
             * The canonical data type kind
             */
            kind: 'Bool' | 'Text' | 'Number' | 'Datetime' | 'Complex' | 'Unknown';

            /**
             * Whether the field can be null
             */
            nullable: boolean;

            /**
             * Vendor-specific type extension
             */
            extension?: DataType.Extension | null;

            /**
             * Optional coarse metadata for the canonical type
             */
            params?: unknown;
          }

          export namespace DataType {
            /**
             * Vendor-specific type extension
             */
            export interface Extension {
              /**
               * Database engine/dialect
               */
              engine: string;

              /**
               * Original type name in the source database
               */
              orig_type: string;

              /**
               * Additional vendor-specific options
               */
              options?: { [key: string]: unknown } | null;

              /**
               * Raw DDL for the type
               */
              raw_ddl?: string | null;
            }
          }
        }

        /**
         * A selected/active source field entry — strict subset of the field item.
         */
        export interface SelectedField {
          field_type: 'dimension' | 'measure' | 'calculation';

          modifiers: Array<SelectedField.Modifier>;

          source_kater_id: string;
        }

        export namespace SelectedField {
          /**
           * A normalized modifier applied to a source field occurrence. The first contract
           * supports only timeframe modifiers.
           */
          export interface Modifier {
            /**
             * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
             */
            kind: 'timeframe';

            /**
             * Concrete modifier value. Canonical contexts omit raw timeframe instead of
             * storing value raw.
             */
            value: string;
          }
        }

        /**
         * A selected/active source field entry — strict subset of the field item.
         */
        export interface RequiredField {
          field_type: 'dimension' | 'measure' | 'calculation';

          modifiers: Array<RequiredField.Modifier>;

          source_kater_id: string;
        }

        export namespace RequiredField {
          /**
           * A normalized modifier applied to a source field occurrence. The first contract
           * supports only timeframe modifiers.
           */
          export interface Modifier {
            /**
             * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
             */
            kind: 'timeframe';

            /**
             * Concrete modifier value. Canonical contexts omit raw timeframe instead of
             * storing value raw.
             */
            value: string;
          }
        }
      }

      /**
       * Effective filter state (model + topic + dashboard + query, after resolution).
       */
      export interface Filters {
        effective_filters: Array<Filters.EffectiveFilter>;
      }

      export namespace Filters {
        /**
         * An effective filter entry in `canonical.filters.effective_filters`.
         */
        export interface EffectiveFilter {
          data_type: string;

          declaration_kater_ids: Array<string>;

          effective_kater_id: string;

          enabled: boolean;

          expression: string;

          field_column_key: string | null;

          field_kater_id: string | null;

          field_modifiers: Array<EffectiveFilter.FieldModifier> | null;

          field_source_kater_id: string | null;

          label: string | null;

          mode: 'static' | 'parameterized';

          name: string;

          normalized_value: string | null;

          owner_chain: Array<string>;

          required: boolean;

          scope: 'model' | 'topic' | 'dashboard' | 'query';

          value: string | number | boolean | Array<unknown> | { [key: string]: unknown } | null;
        }

        export namespace EffectiveFilter {
          /**
           * A normalized modifier applied to a source field occurrence. The first contract
           * supports only timeframe modifiers.
           */
          export interface FieldModifier {
            /**
             * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
             */
            kind: 'timeframe';

            /**
             * Concrete modifier value. Canonical contexts omit raw timeframe instead of
             * storing value raw.
             */
            value: string;
          }
        }
      }

      /**
       * Non-data inputs that affect widget config, narrative, chart rendering, and SDK
       * rendering behavior. `display`, `chart`, and `style` are the only free-form JSON
       * sections in the canonical key.
       */
      export interface Presentation {
        chart: {
          [key: string]:
            | string
            | number
            | number
            | boolean
            | null
            | Array<unknown>
            | { [key: string]: unknown };
        };

        config_fingerprint: string;

        display: {
          [key: string]:
            | string
            | number
            | number
            | boolean
            | null
            | Array<unknown>
            | { [key: string]: unknown };
        };

        /**
         * Widget role -> column_key (not human-readable field name)
         */
        roles: { [key: string]: string };

        style: {
          [key: string]:
            | string
            | number
            | number
            | boolean
            | null
            | Array<unknown>
            | { [key: string]: unknown };
        };

        widget_category: string;

        widget_type: string | null;
      }

      /**
       * Anchors the rendered result to the query template and its selected field shape.
       */
      export interface Query {
        pinned_variant: string | null;

        query_kater_id: string;

        resolved_query_fingerprint: string;

        /**
         * Provenance only — consumers must not treat as identity
         */
        source_query_ref: string;
      }

      /**
       * Identifies the returned window of rows. `sort_by`, when present, is a
       * column_key.
       */
      export interface ResultWindow {
        cursor: string | null;

        effective_limit: number | null;

        max_row_limit: number | null;

        page_size: number | null;

        query_limit: number | null;

        sort_by: string | null;

        sort_order: 'asc' | 'desc' | null;
      }

      /**
       * Identifies the exact Kater source bundle used to resolve and compile.
       */
      export interface Source {
        connection_config_fingerprint: string;

        connection_kater_id: string;

        dependency_graph_fingerprint: string | null;

        manifest_fingerprint: string | null;

        source_fingerprint: string;

        source_kind: 'saved_repo' | 'branch' | 'dev_session';

        source_ref: string | null;

        theme_fingerprint: string | null;

        widget_registry_fingerprint: string;
      }

      /**
       * Request clock context — makes date-relative filters deterministic.
       *
       * Selected date-grain identity lives in `fields.*.modifiers` and
       * `fields.output_columns[].column_key`, not here.
       */
      export interface Temporal {
        /**
         * ISO timestamp resolved once at the start of canonicalization
         */
        as_of: string;

        timezone: string;
      }

      /**
       * Hard tenant identity boundary.
       */
      export interface Tenant {
        client_id: string;

        tenancy_mode: 'none' | 'row' | 'database';

        tenant_attribute_fingerprint: string | null;

        tenant_database: string | null;

        tenant_key: string;
      }

      /**
       * A variable applied to compile or post-assembly runtime substitution.
       */
      export interface Variable {
        is_runtime: boolean;

        name: string;

        /**
         * Deterministic string used for hashing and cache projection
         */
        normalized_value: string;

        query_kater_id: string;

        scope: 'query' | 'global';

        source: 'default' | 'request' | 'pinned_variant' | 'dashboard';

        /**
         * Display/debug value (free-form JSON)
         */
        value: string | number | boolean | Array<unknown> | { [key: string]: unknown } | null;

        variable_kater_id: string | null;
      }
    }
  }
}

export interface WidgetRegenerateMetadataParams {
  /**
   * Body param: Persistence behavior configuration
   */
  persist: WidgetRegenerateMetadataParams.Persist;

  /**
   * Body param: Canonical post-query filters, sorts, and refinements
   */
  post_query_state: WidgetRegenerateMetadataParams.PostQueryState;

  /**
   * Body param: Query kater_id this state applies to
   */
  query_kater_id: string;

  /**
   * Body param: Base rendered query key ID (without post-query state)
   */
  rendered_query_key_id: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Existing post-query state ID for updates
   */
  post_query_state_id?: string | null;

  /**
   * Body param: Expected revision for conflict detection
   */
  revision?: number | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace WidgetRegenerateMetadataParams {
  /**
   * Persistence behavior configuration
   */
  export interface Persist {
    /**
     * Persistence mode: 'none' or 'upsert'
     */
    mode: string;

    /**
     * Scope definition for post-query state persistence.
     */
    scope?: Persist.Scope | null;

    /**
     * Type of scope (e.g., 'chat_message_widget', 'query_builder_draft')
     */
    scope_type?: string | null;
  }

  export namespace Persist {
    /**
     * Scope definition for post-query state persistence.
     */
    export interface Scope {
      /**
       * Chat thread ID for chat_message_widget scope
       */
      chat_thread_id?: string | null;

      /**
       * Message ID for chat_message_widget scope
       */
      message_id?: string | null;

      /**
       * Session ID for query_builder_draft scope
       */
      session_id?: string | null;

      /**
       * Widget instance ID for chat_message_widget scope
       */
      widget_instance_id?: string | null;
    }
  }

  /**
   * Canonical post-query filters, sorts, and refinements
   */
  export interface PostQueryState {
    /**
     * Post-query filter definitions that apply to returned result rows
     */
    filters?: Array<PostQueryState.Filter> | null;

    /**
     * Post-query sort definitions that apply to returned result rows
     */
    sorts?: Array<PostQueryState.Sort> | null;
  }

  export namespace PostQueryState {
    /**
     * A post-query filter definition for a specific field occurrence
     */
    export interface Filter {
      /**
       * Filter expression operator
       */
      expression: 'equals' | 'in' | 'between';

      /**
       * Field target using object form with ref and optional modifiers
       */
      field: Filter.Field;

      /**
       * Filter kind that determines UI control type
       */
      kind: 'date' | 'dropdown' | 'multiselect' | 'number_range';

      /**
       * Whether this filter should be enabled by default
       */
      default_enabled?: boolean | null;

      /**
       * Default value for the filter when enabled
       */
      default_value?:
        | string
        | number
        | boolean
        | Array<string | number | boolean>
        | Filter.DateRangeValue
        | Filter.NumberRangeValue
        | null;

      /**
       * Values source configuration for categorical filters
       */
      values?: Filter.Values | null;
    }

    export namespace Filter {
      /**
       * Field target using object form with ref and optional modifiers
       */
      export interface Field {
        /**
         * Reference to the field
         */
        ref: string;

        /**
         * Optional modifiers for the field (e.g. timeframe)
         */
        modifiers?: Array<Field.Modifier> | null;
      }

      export namespace Field {
        /**
         * A normalized modifier applied to a source field occurrence. The first contract
         * supports only timeframe modifiers.
         */
        export interface Modifier {
          /**
           * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
           */
          kind: 'timeframe';

          /**
           * Concrete modifier value. Canonical contexts omit raw timeframe instead of
           * storing value raw.
           */
          value: string;
        }
      }

      /**
       * Date range filter value
       */
      export interface DateRangeValue {
        mode: 'absolute_range' | 'relative_range';
      }

      /**
       * Number range filter value
       */
      export interface NumberRangeValue {
        /**
         * Maximum value (inclusive)
         */
        max: number;

        /**
         * Minimum value (inclusive)
         */
        min: number;
      }

      /**
       * Values source configuration for categorical filters
       */
      export interface Values {
        /**
         * Source of filter values
         */
        source: 'result_distinct';

        /**
         * Maximum number of values to show
         */
        limit?: number;

        /**
         * Whether the filter should be searchable
         */
        searchable?: boolean;

        /**
         * Sort order for values
         */
        sort?: 'asc' | 'desc';
      }
    }

    /**
     * A post-query sort definition for a specific field occurrence
     */
    export interface Sort {
      /**
       * Field target using object form with ref and optional modifiers
       */
      field: Sort.Field;

      /**
       * Default sort direction when enabled
       */
      default_direction?: 'asc' | 'desc' | null;

      /**
       * Whether this sort should be enabled by default
       */
      default_enabled?: boolean | null;

      /**
       * Sort priority for multi-field sorts (lower numbers sort first)
       */
      priority?: number | null;
    }

    export namespace Sort {
      /**
       * Field target using object form with ref and optional modifiers
       */
      export interface Field {
        /**
         * Reference to the field
         */
        ref: string;

        /**
         * Optional modifiers for the field (e.g. timeframe)
         */
        modifiers?: Array<Field.Modifier> | null;
      }

      export namespace Field {
        /**
         * A normalized modifier applied to a source field occurrence. The first contract
         * supports only timeframe modifiers.
         */
        export interface Modifier {
          /**
           * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
           */
          kind: 'timeframe';

          /**
           * Concrete modifier value. Canonical contexts omit raw timeframe instead of
           * storing value raw.
           */
          value: string;
        }
      }
    }
  }
}

export interface WidgetRenderParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Dashboard context block in `RenderedQueryRequestV1`.
   */
  dashboard: WidgetRenderParams.Dashboard | null;

  /**
   * Body param: Structured field selection expressed as semantic field occurrences.
   */
  field_selection: WidgetRenderParams.FieldSelection;

  /**
   * Body param
   */
  filter_state: Array<WidgetRenderParams.FilterState>;

  /**
   * Body param
   */
  pinned_variant: string | null;

  /**
   * Body param: Presentation config block in `RenderedQueryRequestV1`.
   */
  presentation: WidgetRenderParams.Presentation;

  /**
   * Body param
   */
  query_kater_id: string;

  /**
   * Body param: Result window block in `RenderedQueryRequestV1` (consumers do not
   * supply backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
   */
  result_window: WidgetRenderParams.ResultWindow;

  /**
   * Body param: Request clock block in `RenderedQueryRequestV1`. Either field may be
   * `null` on the request; the backend resolves both before canonicalization (the
   * canonical `temporal` block requires non-null `timezone` and `as_of`).
   */
  temporal: WidgetRenderParams.Temporal;

  /**
   * Body param
   */
  variables: Array<WidgetRenderParams.Variable>;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace WidgetRenderParams {
  /**
   * Dashboard context block in `RenderedQueryRequestV1`.
   */
  export interface Dashboard {
    dashboard_filter_state: Array<Dashboard.DashboardFilterState>;

    dashboard_kater_id: string | null;

    slot_name: string | null;

    widget_kater_id: string | null;
  }

  export namespace Dashboard {
    export interface DashboardFilterState {
      /**
       * Stable effective runtime filter ID
       */
      effective_kater_id: string;

      /**
       * Requested enabled state override for this effective filter
       */
      enabled?: boolean | null;

      /**
       * Requested runtime value override for this effective filter
       */
      value?:
        | DashboardFilterState.ScalarFilterValue
        | DashboardFilterState.MultiFilterValue
        | DashboardFilterState.NumberRangeFilterValue
        | DashboardFilterState.AbsoluteDateFilterValue
        | DashboardFilterState.AbsoluteRangeFilterValue
        | DashboardFilterState.RelativeRangeFilterValue
        | DashboardFilterState.PresetReferenceFilterValue
        | DashboardFilterState.NullFilterValue
        | null;
    }

    export namespace DashboardFilterState {
      export interface ScalarFilterValue {
        /**
         * Scalar value compatible with Filter V2 runtime payloads
         */
        value: string | number | boolean;

        mode?: 'scalar';
      }

      export interface MultiFilterValue {
        /**
         * List of scalar runtime values
         */
        values: Array<string | number | boolean>;

        mode?: 'multi';
      }

      export interface NumberRangeFilterValue {
        end: number;

        start: number;

        mode?: 'number_range';
      }

      export interface AbsoluteDateFilterValue {
        /**
         * Absolute DATE or TIMESTAMP string
         */
        value: string;

        mode?: 'absolute_date';
      }

      export interface AbsoluteRangeFilterValue {
        /**
         * Absolute DATE or TIMESTAMP string
         */
        end: string;

        /**
         * Absolute DATE or TIMESTAMP string
         */
        start: string;

        mode?: 'absolute_range';
      }

      export interface RelativeRangeFilterValue {
        end:
          | RelativeRangeFilterValue.RelativeOffsetBoundary
          | RelativeRangeFilterValue.RelativeAnchorBoundary;

        start:
          | RelativeRangeFilterValue.RelativeOffsetBoundary
          | RelativeRangeFilterValue.RelativeAnchorBoundary;

        mode?: 'relative_range';
      }

      export namespace RelativeRangeFilterValue {
        export interface RelativeOffsetBoundary {
          amount: number;

          direction: 'ago' | 'ahead';

          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        export interface RelativeAnchorBoundary {
          anchor: 'today' | 'now';
        }

        export interface RelativeOffsetBoundary {
          amount: number;

          direction: 'ago' | 'ahead';

          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        export interface RelativeAnchorBoundary {
          anchor: 'today' | 'now';
        }
      }

      export interface PresetReferenceFilterValue {
        /**
         * Stable preset key matching presets[].name
         */
        preset: string;

        mode?: 'preset';
      }

      export interface NullFilterValue {
        mode?: 'null';
      }
    }
  }

  /**
   * Structured field selection expressed as semantic field occurrences.
   */
  export interface FieldSelection {
    selected_fields: Array<FieldSelection.SelectedField>;

    /**
     * Backward-compatible source field UUIDs. New consumers should use selected_fields
     * instead.
     */
    selected_field_ids?: Array<string>;

    /**
     * Backward-compatible timeframe overrides. New consumers should encode timeframes
     * as selected_fields modifiers.
     */
    timeframe_overrides?: Array<FieldSelection.TimeframeOverride>;
  }

  export namespace FieldSelection {
    /**
     * Semantic identity for an active output field: source_kater_id plus normalized
     * modifiers.
     */
    export interface SelectedField {
      /**
       * Normalized modifiers sorted by kind. Raw timeframe is represented by an empty
       * array.
       */
      modifiers: Array<SelectedField.Modifier>;

      /**
       * Stable UUID of the source field this occurrence projects.
       */
      source_kater_id: string;
    }

    export namespace SelectedField {
      /**
       * A normalized modifier applied to a source field occurrence. The first contract
       * supports only timeframe modifiers.
       */
      export interface Modifier {
        /**
         * Modifier kind. Unknown kinds are invalid until the shared contract is extended.
         */
        kind: 'timeframe';

        /**
         * Concrete modifier value. Canonical contexts omit raw timeframe instead of
         * storing value raw.
         */
        value: string;
      }
    }

    /**
     * A timeframe modifier override for a specific source field.
     */
    export interface TimeframeOverride {
      active_timeframe: string;

      source_kater_id: string;
    }
  }

  export interface FilterState {
    /**
     * Stable effective runtime filter ID
     */
    effective_kater_id: string;

    /**
     * Requested enabled state override for this effective filter
     */
    enabled?: boolean | null;

    /**
     * Requested runtime value override for this effective filter
     */
    value?:
      | FilterState.ScalarFilterValue
      | FilterState.MultiFilterValue
      | FilterState.NumberRangeFilterValue
      | FilterState.AbsoluteDateFilterValue
      | FilterState.AbsoluteRangeFilterValue
      | FilterState.RelativeRangeFilterValue
      | FilterState.PresetReferenceFilterValue
      | FilterState.NullFilterValue
      | null;
  }

  export namespace FilterState {
    export interface ScalarFilterValue {
      /**
       * Scalar value compatible with Filter V2 runtime payloads
       */
      value: string | number | boolean;

      mode?: 'scalar';
    }

    export interface MultiFilterValue {
      /**
       * List of scalar runtime values
       */
      values: Array<string | number | boolean>;

      mode?: 'multi';
    }

    export interface NumberRangeFilterValue {
      end: number;

      start: number;

      mode?: 'number_range';
    }

    export interface AbsoluteDateFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      value: string;

      mode?: 'absolute_date';
    }

    export interface AbsoluteRangeFilterValue {
      /**
       * Absolute DATE or TIMESTAMP string
       */
      end: string;

      /**
       * Absolute DATE or TIMESTAMP string
       */
      start: string;

      mode?: 'absolute_range';
    }

    export interface RelativeRangeFilterValue {
      end: RelativeRangeFilterValue.RelativeOffsetBoundary | RelativeRangeFilterValue.RelativeAnchorBoundary;

      start:
        | RelativeRangeFilterValue.RelativeOffsetBoundary
        | RelativeRangeFilterValue.RelativeAnchorBoundary;

      mode?: 'relative_range';
    }

    export namespace RelativeRangeFilterValue {
      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }

      export interface RelativeOffsetBoundary {
        amount: number;

        direction: 'ago' | 'ahead';

        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }

      export interface RelativeAnchorBoundary {
        anchor: 'today' | 'now';
      }
    }

    export interface PresetReferenceFilterValue {
      /**
       * Stable preset key matching presets[].name
       */
      preset: string;

      mode?: 'preset';
    }

    export interface NullFilterValue {
      mode?: 'null';
    }
  }

  /**
   * Presentation config block in `RenderedQueryRequestV1`.
   */
  export interface Presentation {
    chart?: {
      [key: string]: string | number | number | boolean | null | Array<unknown> | { [key: string]: unknown };
    };

    display?: {
      [key: string]: string | number | number | boolean | null | Array<unknown> | { [key: string]: unknown };
    };

    style?: {
      [key: string]: string | number | number | boolean | null | Array<unknown> | { [key: string]: unknown };
    };
  }

  /**
   * Result window block in `RenderedQueryRequestV1` (consumers do not supply
   * backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
   */
  export interface ResultWindow {
    cursor: string | null;

    page_size: number | null;

    sort_by: string | null;

    sort_order: 'asc' | 'desc' | null;
  }

  /**
   * Request clock block in `RenderedQueryRequestV1`. Either field may be `null` on
   * the request; the backend resolves both before canonicalization (the canonical
   * `temporal` block requires non-null `timezone` and `as_of`).
   */
  export interface Temporal {
    as_of: string | null;

    timezone: string | null;
  }

  /**
   * Runtime variable value as supplied in a `RenderedQueryRequestV1`.
   *
   * `variable_kater_id` is preferred. Until every surface exposes it,
   * `(query_kater_id, scope, name)` is the migration fallback identity.
   */
  export interface Variable {
    /**
     * Variable name within scope
     */
    name: string;

    /**
     * Owning query UUID
     */
    query_kater_id: string;

    scope: 'query' | 'global';

    /**
     * Free-form JSON variable value
     */
    value: string | number | boolean | Array<unknown> | { [key: string]: unknown } | null;

    /**
     * Stable variable UUID; fall back to (query_kater_id, scope, name) when null
     */
    variable_kater_id: string | null;
  }
}

export declare namespace Widget {
  export {
    type WidgetRegenerateMetadataResponse as WidgetRegenerateMetadataResponse,
    type WidgetRenderResponse as WidgetRenderResponse,
    type WidgetRegenerateMetadataParams as WidgetRegenerateMetadataParams,
    type WidgetRenderParams as WidgetRenderParams,
  };
}
