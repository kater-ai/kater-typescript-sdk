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
