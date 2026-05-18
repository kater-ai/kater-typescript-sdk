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
import { Combination } from './combination';
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
   * Regenerate narrative metadata from post-query state mutation.
   *
   * This endpoint accepts post-query state changes and returns regenerated narrative
   * metadata (title, description, footnote, insights) based on the transformed row
   * set, without recompiling or executing SQL.
   *
   * The endpoint:
   *
   * 1. Validates the base rendered query key and authorizes access
   * 2. Loads trusted base rows from cache using the rendered query key
   * 3. Applies the canonical post-query state to transform the rows
   * 4. Persists the post-query state when persist.mode="upsert"
   * 5. Regenerates narrative metadata for the transformed dataset
   * 6. Returns canonical state, revision info, and narrative metadata
   *
   * Persistence behavior:
   *
   * - persist.mode="none": Returns metadata without saving state
   * - persist.mode="upsert": Saves state with revision tracking
   *
   * Error responses:
   *
   * - 400: Invalid request, revision conflict, or stale base key
   * - 404: Base rows unavailable or query not found
   * - 403: Unauthorized access to scope or query
   */
  regenerateMetadata(
    params: CompilerRegenerateMetadataParams,
    options?: RequestOptions,
  ): APIPromise<CompilerRegenerateMetadataResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/render/post-query', {
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
 * A reference with optional label and field modifier metadata
 */
export interface RefWithLabel {
  /**
   * Reference using ref(), var(), or expr() syntax
   */
  ref: string;

  /**
   * Editable default modifiers for this field reference. Raw timeframe is
   * represented by omitting the timeframe modifier.
   */
  default_modifiers?: Array<RefWithLabel.DefaultModifier> | null;

  /**
   * Optional label override for this reference
   */
  label?: string | null;

  /**
   * Fixed modifiers for this field reference. Consumers may not override these
   * values.
   */
  modifiers?: Array<RefWithLabel.Modifier> | null;
}

export namespace RefWithLabel {
  /**
   * A normalized modifier applied to a source field occurrence. The first contract
   * supports only timeframe modifiers.
   */
  export interface DefaultModifier {
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
   * Format invariants:
   *
   * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
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
   * Compact dashboard insight summary banner.
   */
  insight_banner?: CompilerCompileDashboardResponse.InsightBanner | null;

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
   * Compact dashboard insight summary banner.
   */
  export interface InsightBanner {
    /**
     * Short paragraph summarizing the strongest insight pattern
     */
    body: string;

    /**
     * Short scannable dashboard insight headline
     */
    headline: string;
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

    follow_ups?: Array<InsightRun.FollowUp>;

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
       * Structured action hint emitted by an insight run or finding.
       */
      export interface FollowUp {
        id: string;

        instructions: string;

        label: string;

        finding_index?: number | null;

        finding_kind?: string | null;

        payload?: { [key: string]: unknown } | null;

        query_description?: string | null;

        query_kater_id?: string | null;

        query_name?: string | null;

        rationale?: string | null;

        readiness?: 'ready' | 'needs_discovery' | null;

        scope?: 'run' | 'finding' | null;

        slot_hints?: { [key: string]: unknown } | null;

        source?: 'authored' | 'llm' | null;
      }
    }

    /**
     * Structured action hint emitted by an insight run or finding.
     */
    export interface FollowUp {
      id: string;

      instructions: string;

      label: string;

      finding_index?: number | null;

      finding_kind?: string | null;

      payload?: { [key: string]: unknown } | null;

      query_description?: string | null;

      query_kater_id?: string | null;

      query_name?: string | null;

      rationale?: string | null;

      readiness?: 'ready' | 'needs_discovery' | null;

      scope?: 'run' | 'finding' | null;

      slot_hints?: { [key: string]: unknown } | null;

      source?: 'authored' | 'llm' | null;
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
     * Format invariants:
     *
     * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
     * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
     * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
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
       * Canonical column type metadata for post-query contracts
       */
      column_type: { [key: string]: unknown };

      /**
       * Canonical data type metadata for this output column
       */
      data_type: UnionMember0.DataType;

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
      modifiers?: Array<UnionMember0.Modifier>;

      /**
       * Stable source field UUID for this output occurrence.
       */
      source_kater_id?: string | null;

      /**
       * Source field label
       */
      source_label?: string | null;
    }

    export namespace UnionMember0 {
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
     * Maps a UUID column alias to its human-readable name and type.
     */
    export interface UnionMember1 {
      /**
       * Canonical column type metadata for post-query contracts
       */
      column_type: { [key: string]: unknown };

      /**
       * Canonical data type metadata for this output column
       */
      data_type: UnionMember1.DataType;

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
      modifiers?: Array<UnionMember1.Modifier>;

      /**
       * Stable source field UUID for this output occurrence.
       */
      source_kater_id?: string | null;

      /**
       * Source field label
       */
      source_label?: string | null;
    }

    export namespace UnionMember1 {
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
         * Selected field occurrences for this dependency slot
         */
        selected_fields: Array<Slot.SelectedField>;

        /**
         * Dashboard slot name
         */
        slot_name: string;

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

        /**
         * Backward-compatible selected source field UUIDs.
         */
        selected_field_ids?: Array<string>;

        /**
         * Backward-compatible timeframe overrides.
         */
        timeframe_overrides?: Array<Slot.TimeframeOverride>;
      }

      export namespace Slot {
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

        /**
         * A timeframe modifier override for a specific source field.
         */
        export interface TimeframeOverride {
          active_timeframe: string;

          source_kater_id: string;
        }
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
   * Format invariants:
   *
   * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
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

/**
 * Response from post-query mutation endpoints.
 */
export interface CompilerRegenerateMetadataResponse {
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
  canonical_post_query_state?: CompilerRegenerateMetadataResponse.CanonicalPostQueryState | null;

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
  insight_runs?: Array<CompilerRegenerateMetadataResponse.InsightRun>;

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
  result_scope?: CompilerRegenerateMetadataResponse.ResultScope | null;

  /**
   * Current revision number (null for unavailable responses)
   */
  revision?: number | null;

  /**
   * Status for error cases ('unavailable', null for success)
   */
  status?: string | null;
}

export namespace CompilerRegenerateMetadataResponse {
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
        | Filter.NumberRangeValue
        | Filter.AbsoluteDateRangeValue
        | Filter.RelativeDateRangeValueOutput
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
       * Absolute date range filter value
       */
      export interface AbsoluteDateRangeValue {
        end: string;

        mode: 'absolute_range';

        start: string;
      }

      /**
       * Relative date range filter value
       */
      export interface RelativeDateRangeValueOutput {
        /**
         * Relative date offset for date ranges
         */
        end: RelativeDateRangeValueOutput.End;

        mode: 'relative_range';

        /**
         * Relative date offset for date ranges
         */
        start: RelativeDateRangeValueOutput.Start;
      }

      export namespace RelativeDateRangeValueOutput {
        /**
         * Relative date offset for date ranges
         */
        export interface End {
          /**
           * Offset amount (negative = past, positive = future)
           */
          amount: number;

          /**
           * Time unit for the offset
           */
          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        /**
         * Relative date offset for date ranges
         */
        export interface Start {
          /**
           * Offset amount (negative = past, positive = future)
           */
          amount: number;

          /**
           * Time unit for the offset
           */
          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }
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

    follow_ups?: Array<InsightRun.FollowUp>;

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
       * Structured action hint emitted by an insight run or finding.
       */
      export interface FollowUp {
        id: string;

        instructions: string;

        label: string;

        finding_index?: number | null;

        finding_kind?: string | null;

        payload?: { [key: string]: unknown } | null;

        query_description?: string | null;

        query_kater_id?: string | null;

        query_name?: string | null;

        rationale?: string | null;

        readiness?: 'ready' | 'needs_discovery' | null;

        scope?: 'run' | 'finding' | null;

        slot_hints?: { [key: string]: unknown } | null;

        source?: 'authored' | 'llm' | null;
      }
    }

    /**
     * Structured action hint emitted by an insight run or finding.
     */
    export interface FollowUp {
      id: string;

      instructions: string;

      label: string;

      finding_index?: number | null;

      finding_kind?: string | null;

      payload?: { [key: string]: unknown } | null;

      query_description?: string | null;

      query_kater_id?: string | null;

      query_name?: string | null;

      rationale?: string | null;

      readiness?: 'ready' | 'needs_discovery' | null;

      scope?: 'run' | 'finding' | null;

      slot_hints?: { [key: string]: unknown } | null;

      source?: 'authored' | 'llm' | null;
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
   * Format invariants:
   *
   * - `key_id`: `rqk_v2:<64 lowercase hex chars>`
   * - `exact_cache_key_id`: `rqk_cache_exact_v2:<64 lowercase hex chars>`
   * - `aggregate_cache_key_id`: `rqk_cache_agg_v2:<64 lowercase hex chars>` or null
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
   * Body param: Structured field selection expressed as semantic field occurrences.
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
   * Body param: Structured field selection expressed as semantic field occurrences.
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

export interface CompilerRegenerateMetadataParams {
  /**
   * Body param: Persistence behavior configuration
   */
  persist: CompilerRegenerateMetadataParams.Persist;

  /**
   * Body param: Canonical post-query filters, sorts, and refinements
   */
  post_query_state: CompilerRegenerateMetadataParams.PostQueryState;

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

export namespace CompilerRegenerateMetadataParams {
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
        | Filter.NumberRangeValue
        | Filter.AbsoluteDateRangeValue
        | Filter.RelativeDateRangeValueInput
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
       * Absolute date range filter value
       */
      export interface AbsoluteDateRangeValue {
        end: string;

        mode: 'absolute_range';

        start: string;
      }

      /**
       * Relative date range filter value
       */
      export interface RelativeDateRangeValueInput {
        /**
         * Relative date offset for date ranges
         */
        end: RelativeDateRangeValueInput.End;

        mode: 'relative_range';

        /**
         * Relative date offset for date ranges
         */
        start: RelativeDateRangeValueInput.Start;
      }

      export namespace RelativeDateRangeValueInput {
        /**
         * Relative date offset for date ranges
         */
        export interface End {
          /**
           * Offset amount (negative = past, positive = future)
           */
          amount: number;

          /**
           * Time unit for the offset
           */
          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }

        /**
         * Relative date offset for date ranges
         */
        export interface Start {
          /**
           * Offset amount (negative = past, positive = future)
           */
          amount: number;

          /**
           * Time unit for the offset
           */
          unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
        }
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
   * Body param: Structured field selection expressed as semantic field occurrences.
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

export interface CompilerResolveParams {
  /**
   * Body param
   */
  connection_id: string;

  /**
   * Body param: Structured field selection expressed as semantic field occurrences.
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
Compiler.Combination = Combination;
Compiler.Capabilities = Capabilities;

export declare namespace Compiler {
  export {
    type ChartConfig as ChartConfig,
    type CompilerErrorItem as CompilerErrorItem,
    type Manifest as Manifest,
    type ManifestEntry as ManifestEntry,
    type RefWithLabel as RefWithLabel,
    type SubqueryCondition as SubqueryCondition,
    type CompilerCompileResponse as CompilerCompileResponse,
    type CompilerCompileDashboardResponse as CompilerCompileDashboardResponse,
    type CompilerExecuteResponse as CompilerExecuteResponse,
    type CompilerRegenerateMetadataResponse as CompilerRegenerateMetadataResponse,
    type CompilerRenderResponse as CompilerRenderResponse,
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerCompileDashboardParams as CompilerCompileDashboardParams,
    type CompilerExecuteParams as CompilerExecuteParams,
    type CompilerRegenerateMetadataParams as CompilerRegenerateMetadataParams,
    type CompilerRenderParams as CompilerRenderParams,
    type CompilerResolveParams as CompilerResolveParams,
    type CompilerValidateParams as CompilerValidateParams,
  };

  export { Cache as Cache };

  export { Combination as Combination };

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
