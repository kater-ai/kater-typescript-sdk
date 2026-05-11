// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CompilerAPI from './compiler';
import * as CacheAPI from './cache';
import { Cache } from './cache';
import * as CapabilitiesAPI from './capabilities';
import {
  Capabilities,
  CapabilityCreateParams,
  CapabilityCreateResponse,
  CapabilitySampleParams,
  CapabilitySampleResponse,
} from './capabilities';
import * as CombinationAPI from './combination';
import {
  Combination as CombinationAPICombination,
  CombinationPreviewParams,
  CombinationPreviewResponse,
} from './combination';
import * as ManifestAPI from './manifest';
import { ManifestRegenerateAndCreatePrParams, ManifestRegenerateAndCreatePrResponse } from './manifest';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

/**
 * Validate, resolve, and compile query templates to SQL
 */
export class Compiler extends APIResource {
  cache: CacheAPI.Cache = new CacheAPI.Cache(this._client);
  combination: CombinationAPI.Combination = new CombinationAPI.Combination(this._client);
  manifest: ManifestAPI.Manifest = new ManifestAPI.Manifest(this._client);
  capabilities: CapabilitiesAPI.Capabilities = new CapabilitiesAPI.Capabilities(this._client);

  /**
   * Compile a structured query request to SQL.
   *
   * The structured replacement for `POST /api/v1/compiler/compile`. The handler:
   *
   * 1. Calls `share_render_request_resolution(...)` to construct per-request
   *    services.
   * 2. Calls `RenderService.render(...)` for the full pipeline, then projects the
   *    response into the compile-stage shape (zeroing execute-only fields). This
   *    keeps the compile route's canonical-key path identical to the render route's.
   * 3. Calls `share_response_metadata_builder(...)` with `validate_sort_by=True`.
   * 4. Projects the `RenderResponse` onto `StructuredCompileResponse` (with
   *    execute-only fields zeroed).
   *
   * Failure mode: resolver/compile failures return HTTP 200 with `success=False`,
   * `rendered_query_key=None`, `errors=[...]`. `InvalidSortByError` from the shared
   * metadata builder maps to HTTP 400.
   */
  compile(params: CompilerCompileParams, options?: RequestOptions): APIPromise<CompilerCompileResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/compile/structured', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Compile a dashboard YAML file into fully resolved widget data.
   *
   * Reads a dashboard YAML from the client repo, resolves all data slots, executes
   * queries, applies filters, and returns renderable widget data.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  compileDashboard(
    params: CompilerCompileDashboardParams,
    options?: RequestOptions,
  ): APIPromise<CompilerCompileDashboardResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/dashboard', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Enumerate every valid query configuration for a connection.
   *
   * Generates all valid combinations of optional dimensions, measures, calculations,
   * filters, and variable values, constrained by widget category rules.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  enumerate(
    params: CompilerEnumerateParams,
    options?: RequestOptions,
  ): APIPromise<CompilerEnumerateResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/enumerate', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Execute a structured query request.
   *
   * The structured replacement for `POST /api/v1/compiler/execute`. The handler:
   *
   * 1. Calls `share_render_request_resolution(...)` to construct per-request
   *    services.
   * 2. Awaits `RenderService.render(...)` for the full pipeline (resolve
   *    - compile + execute + widget metadata + canonical key).
   * 3. Calls `share_response_metadata_builder(...)` with `validate_sort_by=True`.
   * 4. Projects the `RenderResponse` onto `StructuredExecuteResponse`.
   *
   * Failure mode: resolver/compile/execute failures return HTTP 200 with
   * `success=False`, `rendered_query_key=None`, `errors=[...]`. `InvalidSortByError`
   * from the shared metadata builder maps to HTTP 400.
   */
  execute(params: CompilerExecuteParams, options?: RequestOptions): APIPromise<CompilerExecuteResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/execute/structured', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Render a query result from a `RenderedQueryRequestV1`.
   *
   * This is the structured replacement for
   * `POST /api/v1/compiler/combination/preview`. The handler:
   *
   * 1. Builds per-request `CredentialService`, `ConnectionService`, and
   *    `CompilerApiService` instances (matching the legacy preview pattern so
   *    consumer migrations need only swap URL paths).
   * 2. Resolves tenant parameters via `resolve_tenant_params(...)`. The request body
   *    itself does not carry a `tenant_key` field today; `NO_TENANT_KEY` is the safe
   *    migration default.
   * 3. Wraps the render call in `stage_span("compiler.render", ...)` and records
   *    pipeline duration in a `finally` block for parity with the legacy preview
   *    observability.
   * 4. Awaits `RenderService.render(...)` exactly once.
   * 5. On success, validates `request.result_window.sort_by` against the compiled
   *    `column_map` (route-boundary enforcement of the PRD's column_key invariant).
   *    Invalid `sort_by` raises `ApiError(400, code="invalid_sort_by")` so the
   *    client receives a clean 400 instead of a successful response with bad
   *    ordering.
   * 6. Projects the `RenderResponse` onto `RenderResponseModel` via
   *    `from_render_response(...)` and returns it.
   *
   * Failure-mode contract: resolver/compile/execute failures produce HTTP 200
   * responses with `success=False` and `rendered_query_key=None`, matching the
   * legacy preview-route behavior so consumers can migrate without changing
   * failure-handling logic. `InvalidSortByError` is the sole HTTP 400 path because
   * it represents a client request validation error rather than a render-pipeline
   * failure.
   *
   * Consumer surfaces this route serves (post Stories 4.4, 5.2, 6.1, 6.4, 6.5):
   * Query Builder preview/save, SDK widget fetch, dashboard slot render, CLI
   * `kater run`, VSCode `runQuery`, chat tool execute.
   */
  render(params: CompilerRenderParams, options?: RequestOptions): APIPromise<CompilerRenderResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/render', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Resolve a query template from a structured field selection.
   *
   * The structured replacement for `POST /api/v1/compiler/resolve`. The handler:
   *
   * 1. Calls `share_render_request_resolution(...)` to construct per-request
   *    services + resolve tenant parameters.
   * 2. Synthesizes a transient `RenderedQueryRequestV1` so the existing
   *    `RenderService` stage hooks are usable.
   * 3. Calls `render_service._load_sources(...)`.
   * 4. Calls `render_service._resolve_selection(...)`. On
   *    `FieldSelectionValidationError` returns a failure response.
   * 5. Calls `share_response_metadata_builder(...)` with `validate_sort_by=False`
   *    (the resolve stage does not produce a `column_map`).
   * 6. Projects the resolver output onto `StructuredResolveResponse`.
   *
   * The route does NOT run compile or execute (Stories 4.4/5.2 issue follow-up
   * structured compile/execute calls when the user advances through their workflow).
   *
   * Consumer surfaces this route serves (post Stories 4.4, 5.2, 6.1, 6.4, 6.5):
   * Query Builder save, SDK pre-fetch, dashboard slot resolve, CLI `kater run`,
   * VSCode `runQuery`, chat tool resolve.
   */
  resolve(params: CompilerResolveParams, options?: RequestOptions): APIPromise<CompilerResolveResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/resolve/structured', {
      query: { source },
      body,
      ...options,
      headers: buildHeaders([
        { ...(xKaterCliID != null ? { 'X-Kater-CLI-ID': xKaterCliID } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Validate a schema file set against a connection.
   *
   * Checks all views, queries, and related schemas for correctness and returns any
   * errors or warnings found.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  validate(params: CompilerValidateParams, options?: RequestOptions): APIPromise<CompilerValidateResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/validate', {
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
 * Chart configuration with variable references
 */
export interface ChartConfig {
  /**
   * Field or variable reference for color grouping
   */
  color_by?: string | null;

  /**
   * Comparison mode for single_value widgets (e.g., previous_period, target)
   */
  comparison?: 'previous_period' | 'target' | null;

  /**
   * Field or variable reference for size
   */
  size?: string | null;

  /**
   * Field or variable reference for stacking
   */
  stack_by?: string | null;

  /**
   * Target value for comparison: target mode
   */
  target_value?: string | null;

  /**
   * Field or variable reference for x-axis
   */
  x_axis?: string | null;

  /**
   * Field or variable reference for y-axis
   */
  y_axis?: string | null;
}

/**
 * A single compiler validation or compilation error.
 */
export interface CompilerErrorItem {
  /**
   * Machine-readable error code
   */
  code: string;

  /**
   * Human-readable error description
   */
  message: string;

  /**
   * Column number in the source file
   */
  column?: number | null;

  /**
   * Source file path where the error occurred
   */
  file?: string | null;

  /**
   * Line number in the source file
   */
  line?: number | null;

  /**
   * Reference to the source element (e.g. view or query name)
   */
  ref?: string | null;

  /**
   * Suggested fix for this error
   */
  remediation?: string | null;
}

/**
 * An inline field definition for dimensions/measures/calculations
 */
export interface InlineField {
  /**
   * Unique identifier for this inline field
   */
  kater_id: string;

  /**
   * Name of the inline field
   */
  name: string;

  /**
   * SQL expression for the field
   */
  sql: string;

  /**
   * Human-readable label
   */
  label?: string | null;
}

/**
 * Compilation manifest with all named objects.
 */
export interface Manifest {
  generated_at: string;

  objects: { [key: string]: ManifestEntry };

  schema_version?: string;
}

/**
 * A single object entry in the manifest.
 */
export interface ManifestEntry {
  kater_id: string;

  name: string;

  type: string;

  label?: string | null;

  parent_id?: string | null;

  source_file?: string | null;
}

/**
 * A reference with optional label override
 */
export interface RefWithLabel {
  /**
   * Reference using ref(), var(), or expr() syntax
   */
  ref: string;

  /**
   * Optional label override for this reference
   */
  label?: string | null;
}

/**
 * A subquery condition for EXISTS/NOT EXISTS filters
 */
export interface SubqueryCondition {
  /**
   * Reference to the source view/table for the subquery
   */
  from: string;

  /**
   * WHERE conditions for the subquery
   */
  where: Array<string>;
}

/**
 * Compile-stage projection from `RenderResponse` (Story 2.1 frozen dataclass).
 *
 * Has NO `combination` / `combination_id` field by contract. The combination-free
 * invariant is asserted by AST-scan tests in `test_compile_route.py`. Execute-only
 * fields (`data`, `cache_hit`, `row_count`) are zeroed because compile does not
 * run execute.
 */
export interface CompilerCompileResponse {
  /**
   * Whether the compile succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state used for compilation.
   */
  applied_filter_state?: Array<CompilerCompileResponse.AppliedFilterState>;

  /**
   * Auto-generated description text.
   */
  auto_description?: string | null;

  /**
   * Auto-generated title.
   */
  auto_title?: string | null;

  /**
   * Compile-stage no-op: always False.
   */
  cache_hit?: boolean;

  /**
   * Column metadata for the compiled output columns.
   */
  column_map?: Array<CompilerCompileResponse.ColumnMap>;

  /**
   * Compile-stage no-op: always empty. `execute` did not run.
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * SQL dialect used.
   */
  dialect?: string | null;

  /**
   * Compilation errors (if any).
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: CompilerCompileResponse.RenderedQueryKey | null;

  /**
   * Compile-stage no-op: always 0.
   */
  row_count?: number;

  /**
   * Generated SQL statement.
   */
  sql?: string | null;

  /**
   * Resolved style config.
   */
  style_config?: { [key: string]: unknown };

  /**
   * Resolved widget config.
   */
  widget_config?: { [key: string]: unknown };

  /**
   * Resolved widget type.
   */
  widget_type?: string | null;
}

export namespace CompilerCompileResponse {
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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

/**
 * Response from dashboard compilation — fully resolved dashboard.
 */
export interface CompilerCompileDashboardResponse {
  /**
   * Dashboard context for widgets
   */
  context: CompilerCompileDashboardResponse.Context;

  /**
   * Dashboard metadata
   */
  dashboard: CompilerCompileDashboardResponse.Dashboard;

  /**
   * Dashboard-level compilation errors
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Slot applicability metadata for each shared dashboard filter
   */
  filter_applicability?: Array<CompilerCompileDashboardResponse.FilterApplicability>;

  /**
   * Shared dashboard filter definitions
   */
  filter_definitions?: Array<CompilerCompileDashboardResponse.FilterDefinition>;

  /**
   * Applied dashboard filter state after defaults and runtime overrides
   */
  filter_state?: Array<CompilerCompileDashboardResponse.FilterState>;

  /**
   * Structured dashboard-root insight execution results
   */
  insight_runs?: Array<CompilerCompileDashboardResponse.InsightRun>;

  /**
   * Fully resolved widgets with data + config
   */
  widgets?: Array<CompilerCompileDashboardResponse.Widget>;
}

export namespace CompilerCompileDashboardResponse {
  /**
   * Dashboard context for widgets
   */
  export interface Context {
    /**
     * Active filter values: {name: {value, label}}
     */
    filters?: { [key: string]: { [key: string]: unknown } } | null;

    /**
     * Active timeframe: {label, start, end}
     */
    timeframe?: { [key: string]: string } | null;

    /**
     * Dashboard topic: {label, time_dimension}
     */
    topic?: { [key: string]: string } | null;
  }

  /**
   * Dashboard metadata
   */
  export interface Dashboard {
    /**
     * Dashboard name
     */
    name: string;

    /**
     * Dashboard description
     */
    description?: string | null;

    /**
     * Dashboard kater_id
     */
    kater_id?: string | null;

    /**
     * Dashboard display label
     */
    label?: string | null;

    /**
     * Dashboard topic reference
     */
    topic?: string | null;
  }

  /**
   * Per-filter mapping from dashboard-shared state to slot query contexts.
   */
  export interface FilterApplicability {
    /**
     * Dashboard-level effective runtime filter ID
     */
    effective_kater_id: string;

    /**
     * Logical shared filter name
     */
    name: string;

    /**
     * Slots and slot-scoped effective IDs that this shared filter applies to
     */
    slots?: Array<FilterApplicability.Slot>;
  }

  export namespace FilterApplicability {
    /**
     * One dashboard slot that a shared filter applies to.
     */
    export interface Slot {
      /**
       * Slot-scoped effective runtime filter ID for this query context
       */
      effective_kater_id: string;

      /**
       * UUID of the slot query
       */
      query_kater_id: string;

      /**
       * Logical slot query name
       */
      query_name: string;

      /**
       * Dashboard data-slot name
       */
      slot_name: string;
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
   * Resolved runtime filter state exposed by the V2 API contract.
   */
  export interface FilterState {
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

  /**
   * Validated structured output for a completed insight run.
   */
  export interface InsightRun {
    findings?: Array<InsightRun.Finding>;

    metadata?: { [key: string]: unknown } | null;

    /**
     * Top-level summary for an insight run.
     */
    summary?: InsightRun.Summary | null;
  }

  export namespace InsightRun {
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
   * A fully resolved widget ready for rendering.
   */
  export interface Widget {
    /**
     * Column metadata (single or multi-query)
     */
    column_map: Array<Widget.UnionMember0> | Array<Array<Widget.UnionMember1>>;

    /**
     * Fully resolved WidgetConfig
     */
    config: { [key: string]: unknown };

    /**
     * Query result data (single or multi-query)
     */
    data: Array<{ [key: string]: unknown }> | Array<Array<{ [key: string]: unknown }>>;

    /**
     * Grid position
     */
    grid: Widget.Grid;

    /**
     * Widget unique identifier
     */
    kater_id: string;

    /**
     * Widget name
     */
    name: string;

    /**
     * Per-column profiles keyed by kater_id. dict for single-query widgets, list of
     * dicts for multi-query widgets (aligned with column_map). Null when no slot was
     * resolved.
     */
    column_profiles?:
      | { [key: string]: Widget.ColumnProfileResponse }
      | Array<{ [key: string]: Widget.ColumnProfileResponse }>
      | null;

    /**
     * Dependency metadata describing which dashboard slots feed this widget
     */
    dependencies?: Widget.Dependencies;

    /**
     * Display mode for multi-query: 'tabs' or 'grid'
     */
    display_mode?: string | null;

    /**
     * Per-widget compilation errors
     */
    errors?: Array<CompilerAPI.CompilerErrorItem>;

    /**
     * Top-level natural key returned by every runtime data and widget path.
     *
     * Format invariants (validation enforced by Story 1.2's hashing helpers):
     *
     * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
     * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
     * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
     */
    rendered_query_key?: Widget.RenderedQueryKey | null;

    /**
     * Total rows represented by the widget result (single or multi-query)
     */
    row_count?: number | Array<number> | null;

    /**
     * Per-slot configs for multi-query containers
     */
    slot_configs?: Array<{ [key: string]: unknown }> | null;

    /**
     * Totals row (single-query: dict | None; multi-query: list aligned with data)
     */
    totals_row?: { [key: string]: unknown } | Array<{ [key: string]: unknown } | null> | null;

    /**
     * Resolved widget type
     */
    widget_type?: string | null;
  }

  export namespace Widget {
    /**
     * Maps a UUID column alias to its human-readable name and type.
     */
    export interface UnionMember0 {
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

    /**
     * Maps a UUID column alias to its human-readable name and type.
     */
    export interface UnionMember1 {
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

    /**
     * Grid position
     */
    export interface Grid {
      h?: number;

      w?: number;

      x?: number;

      y?: number;
    }

    /**
     * Statistical profile for a single result column.
     */
    export interface ColumnProfileResponse {
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
     * Statistical profile for a single result column.
     */
    export interface ColumnProfileResponse {
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
     * Dependency metadata describing which dashboard slots feed this widget
     */
    export interface Dependencies {
      /**
       * Dashboard data slots that feed this widget
       */
      slots?: Array<Dependencies.Slot>;
    }

    export namespace Dependencies {
      /**
       * A dashboard data slot that a widget depends on.
       */
      export interface Slot {
        /**
         * Query kater_id backing the slot
         */
        query_kater_id: string;

        /**
         * Query name backing the slot
         */
        query_name: string;

        /**
         * UUIDs of selected fields for this dependency slot
         */
        selected_field_ids: Array<string>;

        /**
         * Dashboard slot name
         */
        slot_name: string;

        /**
         * Temporal grain overrides for selected fields
         */
        timeframe_overrides: Array<Slot.TimeframeOverride>;

        /**
         * Runtime variable values applied to the slot
         */
        variable_values: Array<Slot.VariableValue>;

        /**
         * @deprecated Legacy combination string (derived, deprecated)
         */
        combination?: string | null;

        /**
         * Pinned query variant used for the slot, if any
         */
        pinned_variant?: string | null;
      }

      export namespace Slot {
        /**
         * Runtime grain choice for a temporal source dimension.
         */
        export interface TimeframeOverride {
          active_timeframe: string;

          source_kater_id: string;
        }

        /**
         * Runtime variable value as supplied in a `RenderedQueryRequestV1`.
         *
         * `variable_kater_id` is preferred. Until every surface exposes it,
         * `(query_kater_id, scope, name)` is the migration fallback identity.
         */
        export interface VariableValue {
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

              field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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
}

/**
 * Response model for query combination enumeration.
 */
export interface CompilerEnumerateResponse {
  /**
   * All valid query configurations
   */
  combinations: Array<CompilerEnumerateResponse.Combination>;

  /**
   * Total number of combinations
   */
  total_count: number;

  /**
   * Default filter state keyed by query_kater_id
   */
  default_filter_state?: { [key: string]: Array<CompilerEnumerateResponse.DefaultFilterState> };

  /**
   * Two-field deprecation block embedded in response payloads.
   */
  deprecation?: CompilerEnumerateResponse.Deprecation | null;

  /**
   * Display labels for slot fields, keyed by query_kater_id then field name
   */
  field_labels?: { [key: string]: { [key: string]: string } };

  /**
   * Rich metadata for slot fields, keyed by query_kater_id then field name
   */
  field_metadata?: { [key: string]: { [key: string]: CompilerEnumerateResponse.FieldMetadataItemResponse } };

  /**
   * Effective filter definitions keyed by query_kater_id
   */
  filter_definitions?: { [key: string]: Array<CompilerEnumerateResponse.FilterDefinition> };

  /**
   * Optional effective filter IDs keyed by query_kater_id
   */
  optional_effective_filter_ids?: { [key: string]: Array<string> };

  /**
   * Required effective filter IDs keyed by query_kater_id
   */
  required_effective_filter_ids?: { [key: string]: Array<string> };

  /**
   * Required slot fields keyed by query_kater_id
   */
  required_fields?: { [key: string]: CompilerEnumerateResponse.RequiredFields };

  /**
   * Variable definitions keyed by query_kater_id
   */
  variable_definitions?: { [key: string]: Array<CompilerEnumerateResponse.VariableDefinition> };
}

export namespace CompilerEnumerateResponse {
  /**
   * A single valid query configuration.
   */
  export interface Combination {
    /**
     * Query template reference (e.g. 'q:COMPLIANCE_OVERVIEW')
     */
    query_ref: string;

    /**
     * Widget category (e.g. 'axis', 'table')
     */
    widget_category: string;

    /**
     * Deterministic UUID v5 for this combination
     */
    combination_id?: string | null;

    /**
     * UUID of the query template
     */
    query_kater_id?: string | null;

    /**
     * Human-readable label for the query
     */
    query_label?: string | null;

    /**
     * Field-to-role mapping (e.g. {'due_month': 'x_axis'})
     */
    roles?: { [key: string]: string };

    /**
     * Selected optional calculation names
     */
    selected_calculations?: Array<string>;

    /**
     * Selected optional dimension names
     */
    selected_dimensions?: Array<string>;

    /**
     * Selected optional measure names
     */
    selected_measures?: Array<string>;

    /**
     * Variable name to value assignments
     */
    variable_assignments?: { [key: string]: unknown };

    /**
     * Resolved widget type (e.g. 'axis_metric_by_dimensiondate')
     */
    widget_type?: string | null;
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
   * Metadata for a single field in a query's enumerate result.
   */
  export interface FieldMetadataItemResponse {
    /**
     * Field type: measure, dimension, dimension_date, or calculation
     */
    field_type: string;

    description?: string | null;

    /**
     * SQL expression (measure sql, calculation formula, derived dimension sql)
     */
    formula?: string | null;

    kater_id?: string | null;

    label?: string | null;

    /**
     * Return data type for calculations, e.g. 'number'
     */
    output_type?: string | null;

    /**
     * Formatted parameter strings for calculations, e.g. ['metric: measure']
     */
    params?: Array<string> | null;

    /**
     * Source file path and line number, e.g. measures/compliance_rate.yaml#L12
     */
    source_path?: string | null;
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
   * Required slot fields for a query (always included in every combination).
   */
  export interface RequiredFields {
    calculations?: Array<string>;

    dimensions?: Array<string>;

    measures?: Array<string>;
  }

  /**
   * A variable's schema exposed to the query-builder UI.
   */
  export interface VariableDefinition {
    /**
     * True = dynamic (entered at run time); False = static (values baked into
     * combinations)
     */
    is_runtime: boolean;

    name: string;

    /**
     * Variable data type, e.g. STRING, INT, DATE, BOOL, STRING[]
     */
    type: string;

    /**
     * kater_id of the dimension column for from_column variables
     */
    allowed_values_column_kater_id?: string | null;

    /**
     * Non-null when is_runtime=False or type has a static list
     */
    allowed_values_static?: Array<VariableDefinition.AllowedValuesStatic> | null;

    /**
     * Serialisable constraints for a variable.
     */
    constraints?: VariableDefinition.Constraints | null;

    default?: string | number | boolean | Array<string | number | boolean> | null;

    description?: string | null;

    label?: string | null;
  }

  export namespace VariableDefinition {
    /**
     * A value with optional display label
     */
    export interface AllowedValuesStatic {
      /**
       * The actual value
       */
      value: string | number | boolean;

      /**
       * Human-readable label for the value
       */
      label?: string | null;
    }

    /**
     * Serialisable constraints for a variable.
     */
    export interface Constraints {
      max?: number | null;

      max_length?: number | null;

      min?: number | null;

      step?: number | null;
    }
  }
}

/**
 * Execute-stage projection from `RenderResponse` (Story 2.1 frozen dataclass).
 *
 * Has NO `combination` / `combination_id` field by contract. Carries every field
 * the legacy `ExecuteResponse` exposes so consumer migrations swap legacy →
 * structured with no response-handling changes.
 */
export interface CompilerExecuteResponse {
  /**
   * Whether execution succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state used for execution.
   */
  applied_filter_state?: Array<CompilerExecuteResponse.AppliedFilterState>;

  /**
   * Auto-generated description text.
   */
  auto_description?: string | null;

  /**
   * Auto-generated title.
   */
  auto_title?: string | null;

  /**
   * Whether the result was served from cache.
   */
  cache_hit?: boolean;

  /**
   * Column metadata for the executed query's output.
   */
  column_map?: Array<CompilerExecuteResponse.ColumnMap>;

  /**
   * Query result rows.
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * SQL dialect used.
   */
  dialect?: string | null;

  /**
   * Compilation/execution errors (if any).
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Total execution duration in milliseconds.
   */
  execution_time_ms?: number;

  /**
   * True when the app-wide row limit was applied.
   */
  is_row_limited?: boolean;

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: CompilerExecuteResponse.RenderedQueryKey | null;

  /**
   * Total rows returned by the executed query.
   */
  row_count?: number;

  /**
   * Generated SQL statement.
   */
  sql?: string | null;

  /**
   * Resolved style config.
   */
  style_config?: { [key: string]: unknown };

  /**
   * Resolved widget config.
   */
  widget_config?: { [key: string]: unknown };

  /**
   * Resolved widget type.
   */
  widget_type?: string | null;
}

export namespace CompilerExecuteResponse {
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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

/**
 * Route-side projection of `RenderResponse` (Story 2.1 frozen dataclass).
 *
 * Has NO `combination` or `combination_id` field by contract. The combination-free
 * invariant is asserted by AST-scan tests in `test_render_route.py`.
 */
export interface CompilerRenderResponse {
  /**
   * Whether the render succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state used for the render.
   */
  applied_filter_state?: Array<CompilerRenderResponse.AppliedFilterState>;

  /**
   * Auto-generated description text.
   */
  auto_description?: string | null;

  /**
   * Structured auto-description payload, if available.
   */
  auto_description_structured?: { [key: string]: unknown } | null;

  /**
   * Auto-generated title.
   */
  auto_title?: string | null;

  /**
   * Whether the result was served from cache.
   */
  cache_hit?: boolean;

  /**
   * Column metadata for the compiled output columns.
   */
  column_map?: Array<CompilerRenderResponse.ColumnMap>;

  /**
   * Per-column statistical profiles keyed by column_key.
   */
  column_profiles?: { [key: string]: CompilerRenderResponse.ColumnProfiles };

  /**
   * Resolved widget config with `style_config` merged under `config.style` for
   * parity with the legacy preview response.
   */
  config?: { [key: string]: unknown };

  /**
   * Resolved config controls metadata.
   */
  config_controls?: { [key: string]: unknown };

  /**
   * Query result rows.
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * Default runtime filter state derived from definitions.
   */
  default_filter_state?: Array<CompilerRenderResponse.DefaultFilterState>;

  /**
   * Warehouse dialect for the compiled SQL.
   */
  dialect?: string | null;

  /**
   * Compilation or pipeline errors (if any).
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Total render duration in milliseconds.
   */
  execution_time_ms?: number;

  /**
   * Resolved effective filter definitions.
   */
  filter_definitions?: Array<CompilerRenderResponse.FilterDefinition>;

  /**
   * Pagination cursor for the next page.
   */
  next_cursor?: string | null;

  /**
   * Page size used by the compiled query.
   */
  page_size?: number | null;

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: CompilerRenderResponse.RenderedQueryKey | null;

  /**
   * Total rows returned by the compiled query.
   */
  row_count?: number;

  /**
   * Compiled SQL (display form).
   */
  sql?: string | null;

  /**
   * Standalone style config (also merged into `config`).
   */
  style_config?: { [key: string]: unknown };

  /**
   * Totals row over returned measure columns (column_key keys).
   */
  totals_row?: { [key: string]: unknown } | null;

  /**
   * Resolved widget type.
   */
  widget_type?: string | null;
}

export namespace CompilerRenderResponse {
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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

/**
 * Resolve-stage projection from `RenderResponse` + `RenderService` internals.
 *
 * Has NO `combination` / `combination_id` field by contract. The combination-free
 * invariant is asserted by AST-scan tests in `test_resolve_route.py`.
 */
export interface CompilerResolveResponse {
  /**
   * Whether the resolve succeeded
   */
  success: boolean;

  /**
   * Applied runtime filter state used for the resolve.
   */
  applied_filter_state?: Array<CompilerResolveResponse.AppliedFilterState>;

  /**
   * Auto-generated description text.
   */
  auto_description?: string | null;

  /**
   * Structured auto-description payload, if available.
   */
  auto_description_structured?: { [key: string]: unknown } | null;

  /**
   * Auto-generated title.
   */
  auto_title?: string | null;

  /**
   * Default runtime filter state derived from definitions.
   */
  default_filter_state?: Array<CompilerResolveResponse.DefaultFilterState>;

  /**
   * Resolver errors (if any).
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Resolved effective filter definitions.
   */
  filter_definitions?: Array<CompilerResolveResponse.FilterDefinition>;

  /**
   * Top-level natural key returned by every runtime data and widget path.
   *
   * Format invariants (validation enforced by Story 1.2's hashing helpers):
   *
   * - `key_id`: `rqk_v1:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v1:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v1:<64 lowercase hex chars>` or null
   */
  rendered_query_key?: CompilerResolveResponse.RenderedQueryKey | null;

  /**
   * The fully resolved query object.
   */
  resolved_query?: { [key: string]: unknown } | null;

  /**
   * Resolved style config.
   */
  style_config?: { [key: string]: unknown };

  /**
   * Resolved widget config.
   */
  widget_config?: { [key: string]: unknown };

  /**
   * Resolved widget type (when available).
   */
  widget_type?: string | null;
}

export namespace CompilerResolveResponse {
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

            field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

          field_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';

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

/**
 * Response model for schema validation.
 */
export interface CompilerValidateResponse {
  /**
   * Whether validation passed without errors
   */
  success: boolean;

  /**
   * Per-connection validation results with dependency graphs
   */
  connection_results?: Array<CompilerValidateResponse.ConnectionResult>;

  /**
   * Validation errors
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Reserved for write-back flows. Compile responses currently return null because
   * compiled SQL and resolved-query artifacts are not written back.
   */
  request_id?: string | null;

  /**
   * Validation warnings
   */
  warnings?: Array<CompilerErrorItem>;
}

export namespace CompilerValidateResponse {
  /**
   * Validation result for a single connection.
   */
  export interface ConnectionResult {
    /**
     * Connection UUID
     */
    connection_id: string;

    /**
     * Connection name
     */
    connection_name: string;

    /**
     * Whether this connection validated without errors
     */
    success: boolean;

    /**
     * Dependency graph between schema objects.
     */
    dependency_graph?: ConnectionResult.DependencyGraph | null;

    /**
     * Validation errors for this connection
     */
    errors?: Array<CompilerAPI.CompilerErrorItem>;

    /**
     * Compilation manifest with all named objects.
     */
    manifest?: CompilerAPI.Manifest | null;

    /**
     * Files auto-fixed due to renamed refs. None when no renames detected.
     */
    ref_fixes?: Array<ConnectionResult.RefFix> | null;

    /**
     * Validation warnings for this connection
     */
    warnings?: Array<CompilerAPI.CompilerErrorItem>;
  }

  export namespace ConnectionResult {
    /**
     * Dependency graph between schema objects.
     */
    export interface DependencyGraph {
      /**
       * Edge relationships with UUID string keys
       */
      edges: { [key: string]: { [key: string]: Array<string> } };

      /**
       * UUID string to node mapping
       */
      nodes: { [key: string]: DependencyGraph.Nodes };
    }

    export namespace DependencyGraph {
      /**
       * A node in the dependency graph.
       */
      export interface Nodes {
        /**
         * Source file path
         */
        file: string;

        /**
         * Fully qualified name (e.g. 'dim_customer.region')
         */
        fqn: string;

        /**
         * UUID of the schema object
         */
        kater_id: string;

        /**
         * Line number in source file
         */
        line: number;

        /**
         * Node type: QUERY, VIEW, DIMENSION, MEASURE, FILTER, EXPRESSION
         */
        node_type: string;

        /**
         * Column number in source file
         */
        column?: number;
      }
    }

    /**
     * A file that was modified by auto-fix with its replacements.
     */
    export interface RefFix {
      /**
       * Path to the modified file
       */
      file_path: string;

      /**
       * Full updated file content after fixes
       */
      new_content: string;

      /**
       * Individual ref replacements made in this file
       */
      replacements: Array<RefFix.Replacement>;
    }

    export namespace RefFix {
      /**
       * A single ref replacement within a file.
       */
      export interface Replacement {
        /**
         * Path to the file containing the replaced ref
         */
        file_path: string;

        /**
         * Line number where the replacement occurred
         */
        line_number: number;

        /**
         * Updated reference string
         */
        new_ref: string;

        /**
         * Original reference string
         */
        old_ref: string;
      }
    }
  }
}

export interface CompilerCompileParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Dashboard context block in `RenderedQueryRequestV1`.
   */
  dashboard: CompilerCompileParams.Dashboard | null;

  /**
   * Body param: Structured field selection: source field IDs plus optional grain
   * overrides.
   */
  field_selection: CompilerCompileParams.FieldSelection;

  /**
   * Body param
   */
  filter_state: Array<CompilerCompileParams.FilterState>;

  /**
   * Body param
   */
  pinned_variant: string | null;

  /**
   * Body param: Presentation config block in `RenderedQueryRequestV1`.
   */
  presentation: CompilerCompileParams.Presentation;

  /**
   * Body param
   */
  query_kater_id: string;

  /**
   * Body param: Result window block in `RenderedQueryRequestV1` (consumers do not
   * supply backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
   */
  result_window: CompilerCompileParams.ResultWindow;

  /**
   * Body param: Request clock block in `RenderedQueryRequestV1`. Either field may be
   * `null` on the request; the backend resolves both before canonicalization (the
   * canonical `temporal` block requires non-null `timezone` and `as_of`).
   */
  temporal: CompilerCompileParams.Temporal;

  /**
   * Body param
   */
  variables: Array<CompilerCompileParams.Variable>;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CompilerCompileParams {
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
  }

  /**
   * Structured field selection: source field IDs plus optional grain overrides.
   */
  export interface FieldSelection {
    selected_field_ids: Array<string>;

    timeframe_overrides?: Array<FieldSelection.TimeframeOverride>;
  }

  export namespace FieldSelection {
    /**
     * Runtime grain choice for a temporal source dimension.
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

export interface CompilerCompileDashboardParams {
  /**
   * Body param: Connection to compile against
   */
  connection_id: string;

  /**
   * Body param: Relative path within the connection (e.g.
   * 'dashboards/compliance_overview')
   */
  dashboard_path: string;

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
   * Body param: Optional V2 runtime filter-state payload keyed by dashboard filter
   * IDs.
   */
  filter_state?: Array<CompilerCompileDashboardParams.FilterState> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CompilerCompileDashboardParams {
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

export interface CompilerEnumerateParams {
  /**
   * Body param: Connection to enumerate against
   */
  connection_id: string;

  /**
   * Body param: Tenant key for multi-tenant clients. Use 'kater_global_tenant' for
   * no-tenancy clients or when no tenant isolation is needed.
   */
  tenant_key: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Optional query UUIDs to limit enumeration. If omitted, enumerates
   * all queries.
   */
  query_ids?: Array<string> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export interface CompilerExecuteParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Dashboard context block in `RenderedQueryRequestV1`.
   */
  dashboard: CompilerExecuteParams.Dashboard | null;

  /**
   * Body param: Structured field selection: source field IDs plus optional grain
   * overrides.
   */
  field_selection: CompilerExecuteParams.FieldSelection;

  /**
   * Body param
   */
  filter_state: Array<CompilerExecuteParams.FilterState>;

  /**
   * Body param
   */
  pinned_variant: string | null;

  /**
   * Body param: Presentation config block in `RenderedQueryRequestV1`.
   */
  presentation: CompilerExecuteParams.Presentation;

  /**
   * Body param
   */
  query_kater_id: string;

  /**
   * Body param: Result window block in `RenderedQueryRequestV1` (consumers do not
   * supply backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
   */
  result_window: CompilerExecuteParams.ResultWindow;

  /**
   * Body param: Request clock block in `RenderedQueryRequestV1`. Either field may be
   * `null` on the request; the backend resolves both before canonicalization (the
   * canonical `temporal` block requires non-null `timezone` and `as_of`).
   */
  temporal: CompilerExecuteParams.Temporal;

  /**
   * Body param
   */
  variables: Array<CompilerExecuteParams.Variable>;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CompilerExecuteParams {
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
  }

  /**
   * Structured field selection: source field IDs plus optional grain overrides.
   */
  export interface FieldSelection {
    selected_field_ids: Array<string>;

    timeframe_overrides?: Array<FieldSelection.TimeframeOverride>;
  }

  export namespace FieldSelection {
    /**
     * Runtime grain choice for a temporal source dimension.
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

export interface CompilerRenderParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Dashboard context block in `RenderedQueryRequestV1`.
   */
  dashboard: CompilerRenderParams.Dashboard | null;

  /**
   * Body param: Structured field selection: source field IDs plus optional grain
   * overrides.
   */
  field_selection: CompilerRenderParams.FieldSelection;

  /**
   * Body param
   */
  filter_state: Array<CompilerRenderParams.FilterState>;

  /**
   * Body param
   */
  pinned_variant: string | null;

  /**
   * Body param: Presentation config block in `RenderedQueryRequestV1`.
   */
  presentation: CompilerRenderParams.Presentation;

  /**
   * Body param
   */
  query_kater_id: string;

  /**
   * Body param: Result window block in `RenderedQueryRequestV1` (consumers do not
   * supply backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
   */
  result_window: CompilerRenderParams.ResultWindow;

  /**
   * Body param: Request clock block in `RenderedQueryRequestV1`. Either field may be
   * `null` on the request; the backend resolves both before canonicalization (the
   * canonical `temporal` block requires non-null `timezone` and `as_of`).
   */
  temporal: CompilerRenderParams.Temporal;

  /**
   * Body param
   */
  variables: Array<CompilerRenderParams.Variable>;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CompilerRenderParams {
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
  }

  /**
   * Structured field selection: source field IDs plus optional grain overrides.
   */
  export interface FieldSelection {
    selected_field_ids: Array<string>;

    timeframe_overrides?: Array<FieldSelection.TimeframeOverride>;
  }

  export namespace FieldSelection {
    /**
     * Runtime grain choice for a temporal source dimension.
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

export interface CompilerResolveParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Structured field selection: source field IDs plus optional grain
   * overrides.
   */
  field_selection: CompilerResolveParams.FieldSelection;

  /**
   * Body param
   */
  query_kater_id: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param
   */
  auto_fix?: boolean;

  /**
   * Body param: Dashboard context block in `RenderedQueryRequestV1`.
   */
  dashboard?: CompilerResolveParams.Dashboard | null;

  /**
   * Body param
   */
  filter_state?: Array<CompilerResolveParams.FilterState>;

  /**
   * Body param
   */
  pinned_variant?: string | null;

  /**
   * Body param: Presentation config block in `RenderedQueryRequestV1`.
   */
  presentation?: CompilerResolveParams.Presentation;

  /**
   * Body param: Request clock block in `RenderedQueryRequestV1`. Either field may be
   * `null` on the request; the backend resolves both before canonicalization (the
   * canonical `temporal` block requires non-null `timezone` and `as_of`).
   */
  temporal?: CompilerResolveParams.Temporal;

  /**
   * Body param
   */
  variables?: Array<CompilerResolveParams.Variable>;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export namespace CompilerResolveParams {
  /**
   * Structured field selection: source field IDs plus optional grain overrides.
   */
  export interface FieldSelection {
    selected_field_ids: Array<string>;

    timeframe_overrides?: Array<FieldSelection.TimeframeOverride>;
  }

  export namespace FieldSelection {
    /**
     * Runtime grain choice for a temporal source dimension.
     */
    export interface TimeframeOverride {
      active_timeframe: string;

      source_kater_id: string;
    }
  }

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

export interface CompilerValidateParams {
  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Automatically fix broken refs caused by renames. Defaults to True.
   */
  auto_fix?: boolean;

  /**
   * Body param: Optional connection IDs to validate. If omitted, validates all
   * connections.
   */
  connection_ids?: Array<string> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

Compiler.Cache = Cache;
Compiler.Combination = CombinationAPICombination;
Compiler.Capabilities = Capabilities;

export declare namespace Compiler {
  export {
    type ChartConfig as ChartConfig,
    type CompilerErrorItem as CompilerErrorItem,
    type InlineField as InlineField,
    type Manifest as Manifest,
    type ManifestEntry as ManifestEntry,
    type RefWithLabel as RefWithLabel,
    type SubqueryCondition as SubqueryCondition,
    type CompilerCompileResponse as CompilerCompileResponse,
    type CompilerCompileDashboardResponse as CompilerCompileDashboardResponse,
    type CompilerEnumerateResponse as CompilerEnumerateResponse,
    type CompilerExecuteResponse as CompilerExecuteResponse,
    type CompilerRenderResponse as CompilerRenderResponse,
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerCompileDashboardParams as CompilerCompileDashboardParams,
    type CompilerEnumerateParams as CompilerEnumerateParams,
    type CompilerExecuteParams as CompilerExecuteParams,
    type CompilerRenderParams as CompilerRenderParams,
    type CompilerResolveParams as CompilerResolveParams,
    type CompilerValidateParams as CompilerValidateParams,
  };

  export { Cache as Cache };

  export {
    CombinationAPICombination as Combination,
    type CombinationPreviewResponse as CombinationPreviewResponse,
    type CombinationPreviewParams as CombinationPreviewParams,
  };

  export {
    type ManifestRegenerateAndCreatePrResponse as ManifestRegenerateAndCreatePrResponse,
    type ManifestRegenerateAndCreatePrParams as ManifestRegenerateAndCreatePrParams,
  };

  export {
    Capabilities as Capabilities,
    type CapabilityCreateResponse as CapabilityCreateResponse,
    type CapabilitySampleResponse as CapabilitySampleResponse,
    type CapabilityCreateParams as CapabilityCreateParams,
    type CapabilitySampleParams as CapabilitySampleParams,
  };
}
