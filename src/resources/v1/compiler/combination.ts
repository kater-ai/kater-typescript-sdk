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
   *
   * Migration: this is the legacy combination-string path. The target consumer
   * surface is `POST /api/v1/compiler/render` (delivered by the remove-combos
   * prerequisite PRD at `_bmad-output/epics/demo/patch/remove-combos/prd.md`). The
   * new `rendered_query_key` field on the response is shared between both paths to
   * enable cross-consumer state during the migration window.
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
 *
 * Legacy migration surface: this response is produced by the legacy
 * combination-string path (`POST /api/v1/compiler/combination/preview`). The
 * target consumer surface is the structured render endpoint
 * (`POST /api/v1/compiler/render`, delivered by the remove-combos prerequisite at
 * `_bmad-output/epics/demo/patch/remove-combos/prd.md`), which accepts a
 * `RenderedQueryRequestV1` instead of a `combination` string. Both paths return
 * the same `rendered_query_key` for equivalent logical inputs (verified by the
 * deferred parity test once the structured render endpoint lands).
 */
export interface CombinationPreviewResponse {
  /**
   * Whether preview succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state used for the preview
   */
  applied_filter_state?: Array<CombinationPreviewResponse.AppliedFilterState>;

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
   * Per-column statistical profiles keyed by kater_id (UUID column alias).
   */
  column_profiles?: { [key: string]: CombinationPreviewResponse.ColumnProfiles };

  /**
   * Resolved WidgetConfig (from config builder)
   */
  config?: { [key: string]: unknown };

  /**
   * Query result rows
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * Default runtime filter state derived from filter definitions
   */
  default_filter_state?: Array<CombinationPreviewResponse.DefaultFilterState>;

  /**
   * Two-field deprecation block embedded in response payloads.
   */
  deprecation?: CombinationPreviewResponse.Deprecation | null;

  /**
   * Compilation errors (if any)
   */
  errors?: Array<CompilerAPI.CompilerErrorItem>;

  /**
   * Total execution time in milliseconds
   */
  execution_time_ms?: number;

  /**
   * Resolved effective filter definitions for this preview
   */
  filter_definitions?: Array<CombinationPreviewResponse.FilterDefinition>;

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: CombinationPreviewResponse.RenderedQueryKey | null;

  /**
   * Total rows represented by this preview
   */
  row_count?: number;

  /**
   * Totals row over returned measure columns (UUID alias keys)
   */
  totals_row?: { [key: string]: unknown } | null;

  /**
   * Resolved widget type (e.g. 'axis_metric_by_dimensiondate')
   */
  widget_type?: string | null;
}

export namespace CombinationPreviewResponse {
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
     * Interactive filter kind
     */
    kind?: string | null;

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
       * Single scalar runtime value
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
     * Canonical data type metadata for this output column
     */
    data_type: ColumnMap.DataType;

    /**
     * Field type: dimension, measure, or calculation
     */
    field_type: string;

    /**
     * Authored source field UUID
     */
    kater_id: string;

    /**
     * Human-readable column name
     */
    name: string;

    /**
     * Concrete active timeframe for temporal dimensions, e.g. raw, month, quarter.
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
     * Display label
     */
    label?: string | null;

    /**
     * Authored source field UUID for derived timeframe columns.
     */
    source_kater_id?: string | null;
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
     * Interactive filter kind
     */
    kind?: string | null;

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
       * Single scalar runtime value
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
   * Two-field deprecation block embedded in response payloads.
   */
  export interface Deprecation {
    message: string;

    replacement: string;
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
     * Optional UI help text
     */
    help_text?: string | null;

    /**
     * Interactive filter kind
     */
    kind?: string | null;

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
       * Single scalar runtime value
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
         * Single scalar runtime value
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
         * Selectable scalar value
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
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  export interface RenderedQueryKey {
    /**
     * rqk_cache_agg_v1:<sha256-hex> or null when not eligible
     */
    aggregate_cache_key_id: string | null;

    /**
     * The canonical sub-document. Hashing this produces `key_id`.
     */
    canonical: RenderedQueryKey.Canonical;

    /**
     * rqk_cache_exact_v1:<sha256-hex>
     */
    exact_cache_key_id: string;

    /**
     * rqk_v1:<sha256-hex>
     */
    key_id: string;

    version: 1;
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
       * Selected date-grain identity lives in `fields.*.active_timeframe` and
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

        version: 1;
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
           * `source_kater_id` is required (not nullable) here so two timeframe variants of
           * the same temporal source dimension produce different cache projections.
           */
          export interface Dimension {
            active_timeframe: string | null;

            column_key: string;

            source_kater_id: string;
          }

          /**
           * Filter entry inside an exact or aggregate cache projection.
           */
          export interface Filter {
            effective_kater_id: string;

            enabled: boolean;

            expression: string;

            field_active_timeframe: string | null;

            field_column_key: string | null;

            field_kater_id: string | null;

            field_source_kater_id: string | null;

            normalized_value: string | null;
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

            field_active_timeframe: string | null;

            field_column_key: string | null;

            field_kater_id: string | null;

            field_source_kater_id: string | null;

            normalized_value: string | null;
          }

          /**
           * Column entry inside the exact cache projection.
           */
          export interface OutputColumn {
            active_timeframe: string | null;

            column_key: string;

            field_type: 'dimension' | 'measure' | 'calculation';

            kater_id: string;

            source_kater_id: string | null;
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

        key_schema: 'RenderedQueryKeyV1';

        key_version: 1;

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
      }

      export namespace Fields {
        /**
         * A selected/active source field entry — strict subset of the field item.
         */
        export interface ActiveField {
          active_timeframe: string | null;

          field_type: 'dimension' | 'measure' | 'calculation';

          kater_id: string;
        }

        /**
         * An output column entry in `canonical.fields.output_columns`.
         */
        export interface OutputColumn {
          /**
           * Concrete temporal grain (e.g. 'raw', 'month'); null for non-temporal
           */
          active_timeframe: string | null;

          aggregation: 'sum' | 'count' | 'min' | 'max' | 'avg' | 'unknown' | null;

          /**
           * SQL result alias / row payload key
           */
          column_key: string;

          field_type: 'dimension' | 'measure' | 'calculation';

          /**
           * Authored source field UUID
           */
          kater_id: string;

          label: string | null;

          name: string;

          /**
           * Zero-based output column position
           */
          output_index: number;

          role: string | null;

          slot: 'required' | 'optional';

          /**
           * Source field UUID when derived from an authored field
           */
          source_kater_id: string | null;
        }

        /**
         * A selected/active source field entry — strict subset of the field item.
         */
        export interface SelectedField {
          active_timeframe: string | null;

          field_type: 'dimension' | 'measure' | 'calculation';

          kater_id: string;
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

          field_active_timeframe: string | null;

          field_column_key: string | null;

          field_kater_id: string | null;

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
       * Selected date-grain identity lives in `fields.*.active_timeframe` and
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
   * Body param: UUID of the query template
   */
  query_id: string;

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
   * Body param: Optional V2 runtime filter-state payload keyed by effective filter
   * ID.
   */
  filter_state?: Array<CombinationPreviewParams.FilterState> | null;

  /**
   * Body param: Optional pinned variant name (e.g. '\_base').
   */
  pinned_variant?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CombinationPreviewParams {
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
       * Single scalar runtime value
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
}

export declare namespace Combination {
  export {
    type CombinationPreviewResponse as CombinationPreviewResponse,
    type CombinationPreviewParams as CombinationPreviewParams,
  };
}
