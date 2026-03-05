// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CompilerAPI from './compiler';
import * as CacheAPI from './cache';
import { Cache } from './cache';
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

  /**
   * Compile a resolved query to SQL.
   *
   * Takes a previously resolved query and generates the final SQL statement for the
   * target dialect.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  compile(params: CompilerCompileParams, options?: RequestOptions): APIPromise<CompilerCompileResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/compile', {
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
   * Execute a query with transparent caching.
   *
   * Compiles the resolved query to SQL, checks the cache for existing results,
   * executes against the warehouse on cache miss, and stores the result for future
   * requests. Cache failures are invisible to the caller.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  execute(params: CompilerExecuteParams, options?: RequestOptions): APIPromise<CompilerExecuteResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/execute', {
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
   * Resolve a query template with user-selected parameters.
   *
   * Takes a query reference and variable selections, returns the fully resolved
   * query object ready for compilation.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   */
  resolve(params: CompilerResolveParams, options?: RequestOptions): APIPromise<CompilerResolveResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/resolve', {
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
 * Response model for SQL compilation.
 */
export interface CompilerCompileResponse {
  /**
   * SQL dialect used (e.g. 'snowflake')
   */
  dialect: string;

  /**
   * Whether compilation succeeded
   */
  success: boolean;

  /**
   * Maps UUID column aliases to human-readable names and types
   */
  column_map?: Array<CompilerCompileResponse.ColumnMap>;

  /**
   * Compilation errors
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Compilation manifest with all named objects.
   */
  manifest?: Manifest | null;

  /**
   * Compilation metadata from the compiler.
   */
  metadata?: CompilerCompileResponse.Metadata | null;

  /**
   * Write-back request ID. Non-null when files were dispatched to CLI via WebSocket.
   */
  request_id?: string | null;

  /**
   * Generated SQL statement
   */
  sql?: string | null;
}

export namespace CompilerCompileResponse {
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
   * Compilation metadata from the compiler.
   */
  export interface Metadata {
    /**
     * SQL dialect used (e.g. 'snowflake')
     */
    dialect: string;

    /**
     * Reference to the compiled query
     */
    query_ref: string;

    /**
     * Dimension names used in compilation
     */
    dimensions_used?: Array<string>;

    /**
     * Filter names used in compilation
     */
    filters_used?: Array<string>;

    /**
     * Measure names used in compilation
     */
    measures_used?: Array<string>;

    /**
     * View names used in compilation
     */
    views_used?: Array<string>;
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
   * Resolved filter definitions with current values
   */
  filters?: Array<CompilerCompileDashboardResponse.Filter>;

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
   * A resolved dashboard filter with current value and presets.
   */
  export interface Filter {
    /**
     * Filter type: date_range, multi_select, select
     */
    filter_type: string;

    /**
     * Filter name
     */
    name: string;

    /**
     * Whether null (All) is allowed
     */
    allow_null?: boolean;

    /**
     * Whether filter auto-applies to queries
     */
    auto_apply?: boolean;

    /**
     * Current filter value
     */
    current_value?: string | Array<string> | null;

    /**
     * Default value specification
     */
    default?: { [key: string]: string } | null;

    /**
     * Field reference for data-driven filters
     */
    field?: string | null;

    /**
     * Label for null/All option
     */
    null_label?: string | null;

    /**
     * Available presets
     */
    presets?: Array<{ [key: string]: string }> | null;
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
     * Display mode for multi-query: 'tabs' or 'grid'
     */
    display_mode?: string | null;

    /**
     * Per-widget compilation errors
     */
    errors?: Array<CompilerAPI.CompilerErrorItem>;

    /**
     * Per-slot configs for multi-query containers
     */
    slot_configs?: Array<{ [key: string]: unknown }> | null;

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
     * Maps a UUID column alias to its human-readable name and type.
     */
    export interface UnionMember1 {
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
     * Grid position
     */
    export interface Grid {
      h?: number;

      w?: number;

      x?: number;

      y?: number;
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
     * Selected optional filter names
     */
    selected_filters?: Array<string>;

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
}

/**
 * Response model for query execution.
 */
export interface CompilerExecuteResponse {
  /**
   * SQL dialect used
   */
  dialect: string;

  /**
   * Whether execution succeeded
   */
  success: boolean;

  /**
   * Whether the result was served from cache
   */
  cache_hit?: boolean;

  /**
   * Maps UUID column aliases to human-readable names
   */
  column_map?: Array<CompilerExecuteResponse.ColumnMap>;

  /**
   * Query result rows as list of column-value dicts
   */
  data?: Array<{ [key: string]: unknown }>;

  /**
   * Compilation errors (if any)
   */
  errors?: Array<CompilerErrorItem>;

  /**
   * Total execution time in milliseconds
   */
  execution_time_ms?: number;

  /**
   * Compilation metadata from the compiler.
   */
  metadata?: CompilerExecuteResponse.Metadata | null;

  /**
   * Number of rows returned
   */
  row_count?: number;

  /**
   * Generated SQL statement
   */
  sql?: string | null;
}

export namespace CompilerExecuteResponse {
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
   * Compilation metadata from the compiler.
   */
  export interface Metadata {
    /**
     * SQL dialect used (e.g. 'snowflake')
     */
    dialect: string;

    /**
     * Reference to the compiled query
     */
    query_ref: string;

    /**
     * Dimension names used in compilation
     */
    dimensions_used?: Array<string>;

    /**
     * Filter names used in compilation
     */
    filters_used?: Array<string>;

    /**
     * Measure names used in compilation
     */
    measures_used?: Array<string>;

    /**
     * View names used in compilation
     */
    views_used?: Array<string>;
  }
}

/**
 * Response model for a resolved query.
 */
export interface CompilerResolveResponse {
  /**
   * The fully resolved query object
   */
  resolved_query: CompilerResolveResponse.ResolvedQuery;

  /**
   * Dependency graph between schema objects.
   */
  dependency_graph?: CompilerResolveResponse.DependencyGraph | null;

  /**
   * Compilation manifest with all named objects.
   */
  manifest?: Manifest | null;

  /**
   * Files auto-fixed due to renamed refs. None when no renames detected.
   */
  ref_fixes?: Array<CompilerResolveResponse.RefFix> | null;

  /**
   * Write-back request ID. Non-null when ref-fix files were dispatched to CLI via
   * WebSocket.
   */
  request_id?: string | null;
}

export namespace CompilerResolveResponse {
  /**
   * The fully resolved query object
   */
  export interface ResolvedQuery {
    /**
     * Unique identifier for this resolved query instance
     */
    kater_id: string;

    /**
     * Name from the leaf query in the inheritance chain
     */
    name: string;

    /**
     * Reference to the original query template this was resolved from
     */
    source_query: string;

    /**
     * Reference to the topic this query uses (always known after inheritance
     * resolution)
     */
    topic: string;

    /**
     * Widget category that determines data shape constraints
     */
    widget_category: 'axis' | 'funnel' | 'heatmap' | 'image' | 'kpi_card' | 'pie' | 'table' | 'text';

    /**
     * Usage guidance for AI processing
     */
    ai_context?: string | null;

    /**
     * Merged required + selected optional calculations
     */
    calculations?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Chart recommendations preserved for evaluation
     */
    chart_hints?: Array<ResolvedQuery.ChartHint1Output | ResolvedQuery.ChartHint2Output> | null;

    /**
     * Custom properties
     */
    custom_properties?: { [key: string]: unknown } | null;

    /**
     * Description of the query
     */
    description?: string | null;

    /**
     * Merged required + selected optional dimensions
     */
    dimensions?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Widget types within the declared widget_category that must NOT render this query
     */
    disallowed_widget_types?: Array<
      | 'axis_metric_by_dimension'
      | 'axis_metric_by_dimensiondate'
      | 'axis_metric_by_dimensiondate_sliced_by_dimension'
      | 'axis_scatter_plot'
      | 'funnel_funnel_chart'
      | 'heatmap_heatmap'
      | 'image_image_grid'
      | 'image_single_image'
      | 'kpi_measure_with_dimension_expression'
      | 'kpi_measure_with_secondary_metric'
      | 'kpi_single_measure_compared_to_prev_period_sparkline'
      | 'kpi_single_value'
      | 'pie_pie_chart'
      | 'table_data_table'
      | 'table_fancy_subtotal_table'
      | 'table_key_value_list'
      | 'table_styled_table'
      | 'text_data_readout_with_sparkline'
      | 'text_narrative_text'
    > | null;

    /**
     * Merged required + selected optional filters
     */
    filters?: Array<
      | ResolvedQuery.InlineFormulaFilter
      | string
      | ResolvedQuery.InlineExistsFilter1
      | ResolvedQuery.InlineExistsFilter2
    > | null;

    /**
     * Ordered list of query refs that were merged during inheritance resolution
     */
    inheritance_chain?: Array<string> | null;

    /**
     * Human-readable label with var() values substituted
     */
    label?: string | null;

    /**
     * Maximum number of rows to return
     */
    limit?: number | null;

    /**
     * Merged required + selected optional measures
     */
    measures?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    order_by?: ResolvedQuery.OrderBy | null;

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    resolved_chart?: ResolvedQuery.ResolvedChart | null;

    /**
     * Full variable definitions with bound values
     */
    resolved_variables?: Array<ResolvedQuery.ResolvedVariable> | null;

    /**
     * Resolved select_from entries with CTE metadata
     */
    select_from?: Array<ResolvedQuery.SelectFrom> | null;
  }

  export namespace ResolvedQuery {
    /**
     * A chart recommendation rule
     */
    export interface ChartHint1Output {
      /**
       * Chart configuration with variable references
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Type of chart visualization
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';

      /**
       * Conditions based on variable values - can be single value (string) or multiple
       * values (array)
       */
      when: { [key: string]: string | Array<string> };
    }

    /**
     * A chart recommendation rule
     */
    export interface ChartHint2Output {
      default: ChartHint2Output.Default;
    }

    export namespace ChartHint2Output {
      export interface Default {
        /**
         * Chart configuration with variable references
         */
        config: CompilerAPI.ChartConfig;

        /**
         * Type of chart visualization
         */
        recommend:
          | 'line'
          | 'bar'
          | 'stacked_bar'
          | 'area'
          | 'pie'
          | 'donut'
          | 'scatter'
          | 'table'
          | 'heatmap'
          | 'single_value';
      }
    }

    /**
     * An inline filter using a SQL/expression formula
     */
    export interface InlineFormulaFilter {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * SQL expression for the filter condition
       */
      sql: string;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter1 {
      /**
       * EXISTS subquery condition
       */
      exists: CompilerAPI.SubqueryCondition;

      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * Human-readable label
       */
      label?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      not_exists?: CompilerAPI.SubqueryCondition | null;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter2 {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * NOT EXISTS subquery condition
       */
      not_exists: CompilerAPI.SubqueryCondition;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      exists?: CompilerAPI.SubqueryCondition | null;

      /**
       * Human-readable label
       */
      label?: string | null;
    }

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    export interface OrderBy {
      /**
       * Fields to sort in ascending order (lowest/oldest first)
       */
      asc?: Array<string> | null;

      /**
       * Fields to sort in descending order (highest/newest first)
       */
      desc?: Array<string> | null;
    }

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    export interface ResolvedChart {
      /**
       * Chart configuration
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Recommended chart type
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';
    }

    /**
     * A variable definition with its bound value
     */
    export interface ResolvedVariable {
      /**
       * The concrete value bound for this resolution
       */
      bound_value: string | number | boolean | Array<string | number | boolean>;

      /**
       * Default value for this variable
       */
      default: string | number | boolean | Array<string | number | boolean>;

      /**
       * Unique identifier for this variable
       */
      kater_id: string;

      /**
       * Variable name identifier
       */
      name: string;

      /**
       * Data type of the variable
       */
      type:
        | 'STRING'
        | 'INT'
        | 'FLOAT'
        | 'DATE'
        | 'TIMESTAMP'
        | 'BOOL'
        | 'STRING[]'
        | 'INT[]'
        | 'FLOAT[]'
        | 'DATE[]'
        | 'DIMENSION'
        | 'MEASURE'
        | 'CALCULATION'
        | 'FILTER';

      /**
       * Allowed values configuration
       */
      allowed_values?:
        | ResolvedVariable.VariableAllowedValues1
        | ResolvedVariable.VariableAllowedValues2
        | null;

      /**
       * Constraints for variable types
       */
      constraints?: ResolvedVariable.Constraints | null;

      /**
       * Description of the variable's purpose
       */
      description?: string | null;

      /**
       * True if bound_value equals the default value
       */
      is_default?: boolean | null;

      /**
       * True if this is a runtime variable (not resolved at compile time). Runtime
       * variables have var() placeholders left in compiled SQL for literal substitution
       * at execution time.
       */
      is_runtime?: boolean | null;

      /**
       * Human-readable label for the variable
       */
      label?: string | null;
    }

    export namespace ResolvedVariable {
      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues1 {
        /**
         * Static list of allowed values with optional labels
         */
        static: Array<VariableAllowedValues1.Static>;
      }

      export namespace VariableAllowedValues1 {
        /**
         * A value with optional display label
         */
        export interface Static {
          /**
           * The actual value
           */
          value: string | number | boolean;

          /**
           * Human-readable label for the value
           */
          label?: string | null;
        }
      }

      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues2 {
        /**
         * Reference to column for dynamic values
         */
        from_column: string;

        /**
         * Cache time-to-live in seconds
         */
        cache_ttl?: number;

        /**
         * Maximum number of values to retrieve
         */
        limit?: number;

        /**
         * Sort order for values
         */
        order_by?: 'asc' | 'desc';
      }

      /**
       * Constraints for variable types
       */
      export interface Constraints {
        /**
         * Maximum allowed value
         */
        max?: number | null;

        /**
         * Maximum length for STRING variables
         */
        max_length?: number | null;

        /**
         * Minimum allowed value
         */
        min?: number | null;

        /**
         * Step increment for numeric input
         */
        step?: number | null;
      }
    }

    /**
     * A resolved select_from entry with CTE metadata
     */
    export interface SelectFrom {
      /**
       * CTE alias used in the WITH clause (e.g., **sf_compliance_rate**base)
       */
      cte_alias: string;

      /**
       * Columns produced by the CTE, available as q:query_name.field_name in the parent
       */
      output_columns: Array<SelectFrom.OutputColumn>;

      /**
       * Reference to the source query
       */
      ref: string;

      /**
       * Variable overrides passed to the referenced query
       */
      variables?: { [key: string]: string | number | boolean } | null;
    }

    export namespace SelectFrom {
      /**
       * A column produced by a select_from CTE
       */
      export interface OutputColumn {
        /**
         * The SQL column alias in the CTE output
         */
        column_alias: string;

        /**
         * The field name used in q:query_name.field_name references
         */
        field_name: string;

        /**
         * Original type of the field in the source query
         */
        source_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';
      }
    }
  }

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
   * Write-back request ID. Non-null when files were dispatched to CLI via WebSocket.
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
   * Body param: Connection to compile against
   */
  connection_id: string;

  /**
   * Body param: Previously resolved query object from /resolve
   */
  resolved_query: CompilerCompileParams.ResolvedQuery;

  /**
   * Body param: Tenant key for multi-tenant compilation. Use 'kater_global_tenant'
   * for no-tenancy clients or to bypass tenant isolation. For database tenancy, maps
   * to the tenant's database. For row tenancy, used as the row-level filter value.
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

export namespace CompilerCompileParams {
  /**
   * Previously resolved query object from /resolve
   */
  export interface ResolvedQuery {
    /**
     * Unique identifier for this resolved query instance
     */
    kater_id: string;

    /**
     * Name from the leaf query in the inheritance chain
     */
    name: string;

    /**
     * Reference to the original query template this was resolved from
     */
    source_query: string;

    /**
     * Reference to the topic this query uses (always known after inheritance
     * resolution)
     */
    topic: string;

    /**
     * Widget category that determines data shape constraints
     */
    widget_category: 'axis' | 'funnel' | 'heatmap' | 'image' | 'kpi_card' | 'pie' | 'table' | 'text';

    /**
     * Usage guidance for AI processing
     */
    ai_context?: string | null;

    /**
     * Merged required + selected optional calculations
     */
    calculations?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Chart recommendations preserved for evaluation
     */
    chart_hints?: Array<ResolvedQuery.ChartHint1Input | ResolvedQuery.ChartHint2Input> | null;

    /**
     * Custom properties
     */
    custom_properties?: { [key: string]: unknown } | null;

    /**
     * Description of the query
     */
    description?: string | null;

    /**
     * Merged required + selected optional dimensions
     */
    dimensions?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Widget types within the declared widget_category that must NOT render this query
     */
    disallowed_widget_types?: Array<
      | 'axis_metric_by_dimension'
      | 'axis_metric_by_dimensiondate'
      | 'axis_metric_by_dimensiondate_sliced_by_dimension'
      | 'axis_scatter_plot'
      | 'funnel_funnel_chart'
      | 'heatmap_heatmap'
      | 'image_image_grid'
      | 'image_single_image'
      | 'kpi_measure_with_dimension_expression'
      | 'kpi_measure_with_secondary_metric'
      | 'kpi_single_measure_compared_to_prev_period_sparkline'
      | 'kpi_single_value'
      | 'pie_pie_chart'
      | 'table_data_table'
      | 'table_fancy_subtotal_table'
      | 'table_key_value_list'
      | 'table_styled_table'
      | 'text_data_readout_with_sparkline'
      | 'text_narrative_text'
    > | null;

    /**
     * Merged required + selected optional filters
     */
    filters?: Array<
      | ResolvedQuery.InlineFormulaFilter
      | string
      | ResolvedQuery.InlineExistsFilter1
      | ResolvedQuery.InlineExistsFilter2
    > | null;

    /**
     * Ordered list of query refs that were merged during inheritance resolution
     */
    inheritance_chain?: Array<string> | null;

    /**
     * Human-readable label with var() values substituted
     */
    label?: string | null;

    /**
     * Maximum number of rows to return
     */
    limit?: number | null;

    /**
     * Merged required + selected optional measures
     */
    measures?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    order_by?: ResolvedQuery.OrderBy | null;

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    resolved_chart?: ResolvedQuery.ResolvedChart | null;

    /**
     * Full variable definitions with bound values
     */
    resolved_variables?: Array<ResolvedQuery.ResolvedVariable> | null;

    /**
     * Resolved select_from entries with CTE metadata
     */
    select_from?: Array<ResolvedQuery.SelectFrom> | null;
  }

  export namespace ResolvedQuery {
    /**
     * A chart recommendation rule
     */
    export interface ChartHint1Input {
      /**
       * Chart configuration with variable references
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Type of chart visualization
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';

      /**
       * Conditions based on variable values - can be single value (string) or multiple
       * values (array)
       */
      when: { [key: string]: string | Array<string> };
    }

    /**
     * A chart recommendation rule
     */
    export interface ChartHint2Input {
      default: ChartHint2Input.Default;
    }

    export namespace ChartHint2Input {
      export interface Default {
        /**
         * Chart configuration with variable references
         */
        config: CompilerAPI.ChartConfig;

        /**
         * Type of chart visualization
         */
        recommend:
          | 'line'
          | 'bar'
          | 'stacked_bar'
          | 'area'
          | 'pie'
          | 'donut'
          | 'scatter'
          | 'table'
          | 'heatmap'
          | 'single_value';
      }
    }

    /**
     * An inline filter using a SQL/expression formula
     */
    export interface InlineFormulaFilter {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * SQL expression for the filter condition
       */
      sql: string;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter1 {
      /**
       * EXISTS subquery condition
       */
      exists: CompilerAPI.SubqueryCondition;

      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * Human-readable label
       */
      label?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      not_exists?: CompilerAPI.SubqueryCondition | null;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter2 {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * NOT EXISTS subquery condition
       */
      not_exists: CompilerAPI.SubqueryCondition;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      exists?: CompilerAPI.SubqueryCondition | null;

      /**
       * Human-readable label
       */
      label?: string | null;
    }

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    export interface OrderBy {
      /**
       * Fields to sort in ascending order (lowest/oldest first)
       */
      asc?: Array<string> | null;

      /**
       * Fields to sort in descending order (highest/newest first)
       */
      desc?: Array<string> | null;
    }

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    export interface ResolvedChart {
      /**
       * Chart configuration
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Recommended chart type
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';
    }

    /**
     * A variable definition with its bound value
     */
    export interface ResolvedVariable {
      /**
       * The concrete value bound for this resolution
       */
      bound_value: string | number | boolean | Array<string | number | boolean>;

      /**
       * Default value for this variable
       */
      default: string | number | boolean | Array<string | number | boolean>;

      /**
       * Unique identifier for this variable
       */
      kater_id: string;

      /**
       * Variable name identifier
       */
      name: string;

      /**
       * Data type of the variable
       */
      type:
        | 'STRING'
        | 'INT'
        | 'FLOAT'
        | 'DATE'
        | 'TIMESTAMP'
        | 'BOOL'
        | 'STRING[]'
        | 'INT[]'
        | 'FLOAT[]'
        | 'DATE[]'
        | 'DIMENSION'
        | 'MEASURE'
        | 'CALCULATION'
        | 'FILTER';

      /**
       * Allowed values configuration
       */
      allowed_values?:
        | ResolvedVariable.VariableAllowedValues1
        | ResolvedVariable.VariableAllowedValues2
        | null;

      /**
       * Constraints for variable types
       */
      constraints?: ResolvedVariable.Constraints | null;

      /**
       * Description of the variable's purpose
       */
      description?: string | null;

      /**
       * True if bound_value equals the default value
       */
      is_default?: boolean | null;

      /**
       * True if this is a runtime variable (not resolved at compile time). Runtime
       * variables have var() placeholders left in compiled SQL for literal substitution
       * at execution time.
       */
      is_runtime?: boolean | null;

      /**
       * Human-readable label for the variable
       */
      label?: string | null;
    }

    export namespace ResolvedVariable {
      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues1 {
        /**
         * Static list of allowed values with optional labels
         */
        static: Array<VariableAllowedValues1.Static>;
      }

      export namespace VariableAllowedValues1 {
        /**
         * A value with optional display label
         */
        export interface Static {
          /**
           * The actual value
           */
          value: string | number | boolean;

          /**
           * Human-readable label for the value
           */
          label?: string | null;
        }
      }

      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues2 {
        /**
         * Reference to column for dynamic values
         */
        from_column: string;

        /**
         * Cache time-to-live in seconds
         */
        cache_ttl?: number;

        /**
         * Maximum number of values to retrieve
         */
        limit?: number;

        /**
         * Sort order for values
         */
        order_by?: 'asc' | 'desc';
      }

      /**
       * Constraints for variable types
       */
      export interface Constraints {
        /**
         * Maximum allowed value
         */
        max?: number | null;

        /**
         * Maximum length for STRING variables
         */
        max_length?: number | null;

        /**
         * Minimum allowed value
         */
        min?: number | null;

        /**
         * Step increment for numeric input
         */
        step?: number | null;
      }
    }

    /**
     * A resolved select_from entry with CTE metadata
     */
    export interface SelectFrom {
      /**
       * CTE alias used in the WITH clause (e.g., **sf_compliance_rate**base)
       */
      cte_alias: string;

      /**
       * Columns produced by the CTE, available as q:query_name.field_name in the parent
       */
      output_columns: Array<SelectFrom.OutputColumn>;

      /**
       * Reference to the source query
       */
      ref: string;

      /**
       * Variable overrides passed to the referenced query
       */
      variables?: { [key: string]: string | number | boolean } | null;
    }

    export namespace SelectFrom {
      /**
       * A column produced by a select_from CTE
       */
      export interface OutputColumn {
        /**
         * The SQL column alias in the CTE output
         */
        column_alias: string;

        /**
         * The field name used in q:query_name.field_name references
         */
        field_name: string;

        /**
         * Original type of the field in the source query
         */
        source_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';
      }
    }
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
   * Body param: Optional filter overrides from UI
   */
  filters?: { [key: string]: string | Array<string> | null } | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
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
   * Body param: Optional query refs to limit enumeration. If omitted, enumerates all
   * queries.
   */
  query_refs?: Array<string> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export interface CompilerExecuteParams {
  /**
   * Body param: Connection to execute against
   */
  connection_id: string;

  /**
   * Body param: Previously resolved query object from /resolve
   */
  resolved_query: CompilerExecuteParams.ResolvedQuery;

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

export namespace CompilerExecuteParams {
  /**
   * Previously resolved query object from /resolve
   */
  export interface ResolvedQuery {
    /**
     * Unique identifier for this resolved query instance
     */
    kater_id: string;

    /**
     * Name from the leaf query in the inheritance chain
     */
    name: string;

    /**
     * Reference to the original query template this was resolved from
     */
    source_query: string;

    /**
     * Reference to the topic this query uses (always known after inheritance
     * resolution)
     */
    topic: string;

    /**
     * Widget category that determines data shape constraints
     */
    widget_category: 'axis' | 'funnel' | 'heatmap' | 'image' | 'kpi_card' | 'pie' | 'table' | 'text';

    /**
     * Usage guidance for AI processing
     */
    ai_context?: string | null;

    /**
     * Merged required + selected optional calculations
     */
    calculations?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Chart recommendations preserved for evaluation
     */
    chart_hints?: Array<ResolvedQuery.ChartHint1Input | ResolvedQuery.ChartHint2Input> | null;

    /**
     * Custom properties
     */
    custom_properties?: { [key: string]: unknown } | null;

    /**
     * Description of the query
     */
    description?: string | null;

    /**
     * Merged required + selected optional dimensions
     */
    dimensions?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Widget types within the declared widget_category that must NOT render this query
     */
    disallowed_widget_types?: Array<
      | 'axis_metric_by_dimension'
      | 'axis_metric_by_dimensiondate'
      | 'axis_metric_by_dimensiondate_sliced_by_dimension'
      | 'axis_scatter_plot'
      | 'funnel_funnel_chart'
      | 'heatmap_heatmap'
      | 'image_image_grid'
      | 'image_single_image'
      | 'kpi_measure_with_dimension_expression'
      | 'kpi_measure_with_secondary_metric'
      | 'kpi_single_measure_compared_to_prev_period_sparkline'
      | 'kpi_single_value'
      | 'pie_pie_chart'
      | 'table_data_table'
      | 'table_fancy_subtotal_table'
      | 'table_key_value_list'
      | 'table_styled_table'
      | 'text_data_readout_with_sparkline'
      | 'text_narrative_text'
    > | null;

    /**
     * Merged required + selected optional filters
     */
    filters?: Array<
      | ResolvedQuery.InlineFormulaFilter
      | string
      | ResolvedQuery.InlineExistsFilter1
      | ResolvedQuery.InlineExistsFilter2
    > | null;

    /**
     * Ordered list of query refs that were merged during inheritance resolution
     */
    inheritance_chain?: Array<string> | null;

    /**
     * Human-readable label with var() values substituted
     */
    label?: string | null;

    /**
     * Maximum number of rows to return
     */
    limit?: number | null;

    /**
     * Merged required + selected optional measures
     */
    measures?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    order_by?: ResolvedQuery.OrderBy | null;

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    resolved_chart?: ResolvedQuery.ResolvedChart | null;

    /**
     * Full variable definitions with bound values
     */
    resolved_variables?: Array<ResolvedQuery.ResolvedVariable> | null;

    /**
     * Resolved select_from entries with CTE metadata
     */
    select_from?: Array<ResolvedQuery.SelectFrom> | null;
  }

  export namespace ResolvedQuery {
    /**
     * A chart recommendation rule
     */
    export interface ChartHint1Input {
      /**
       * Chart configuration with variable references
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Type of chart visualization
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';

      /**
       * Conditions based on variable values - can be single value (string) or multiple
       * values (array)
       */
      when: { [key: string]: string | Array<string> };
    }

    /**
     * A chart recommendation rule
     */
    export interface ChartHint2Input {
      default: ChartHint2Input.Default;
    }

    export namespace ChartHint2Input {
      export interface Default {
        /**
         * Chart configuration with variable references
         */
        config: CompilerAPI.ChartConfig;

        /**
         * Type of chart visualization
         */
        recommend:
          | 'line'
          | 'bar'
          | 'stacked_bar'
          | 'area'
          | 'pie'
          | 'donut'
          | 'scatter'
          | 'table'
          | 'heatmap'
          | 'single_value';
      }
    }

    /**
     * An inline filter using a SQL/expression formula
     */
    export interface InlineFormulaFilter {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * SQL expression for the filter condition
       */
      sql: string;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter1 {
      /**
       * EXISTS subquery condition
       */
      exists: CompilerAPI.SubqueryCondition;

      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * Human-readable label
       */
      label?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      not_exists?: CompilerAPI.SubqueryCondition | null;
    }

    /**
     * An inline filter using EXISTS or NOT EXISTS with a subquery
     */
    export interface InlineExistsFilter2 {
      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * NOT EXISTS subquery condition
       */
      not_exists: CompilerAPI.SubqueryCondition;

      /**
       * Description of the filter
       */
      description?: string | null;

      /**
       * A subquery condition for EXISTS/NOT EXISTS filters
       */
      exists?: CompilerAPI.SubqueryCondition | null;

      /**
       * Human-readable label
       */
      label?: string | null;
    }

    /**
     * Sort order specification for query results. Use desc for descending
     * (highest/newest first) and asc for ascending (lowest/oldest first).
     */
    export interface OrderBy {
      /**
       * Fields to sort in ascending order (lowest/oldest first)
       */
      asc?: Array<string> | null;

      /**
       * Fields to sort in descending order (highest/newest first)
       */
      desc?: Array<string> | null;
    }

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    export interface ResolvedChart {
      /**
       * Chart configuration
       */
      config: CompilerAPI.ChartConfig;

      /**
       * Recommended chart type
       */
      recommend:
        | 'line'
        | 'bar'
        | 'stacked_bar'
        | 'area'
        | 'pie'
        | 'donut'
        | 'scatter'
        | 'table'
        | 'heatmap'
        | 'single_value';
    }

    /**
     * A variable definition with its bound value
     */
    export interface ResolvedVariable {
      /**
       * The concrete value bound for this resolution
       */
      bound_value: string | number | boolean | Array<string | number | boolean>;

      /**
       * Default value for this variable
       */
      default: string | number | boolean | Array<string | number | boolean>;

      /**
       * Unique identifier for this variable
       */
      kater_id: string;

      /**
       * Variable name identifier
       */
      name: string;

      /**
       * Data type of the variable
       */
      type:
        | 'STRING'
        | 'INT'
        | 'FLOAT'
        | 'DATE'
        | 'TIMESTAMP'
        | 'BOOL'
        | 'STRING[]'
        | 'INT[]'
        | 'FLOAT[]'
        | 'DATE[]'
        | 'DIMENSION'
        | 'MEASURE'
        | 'CALCULATION'
        | 'FILTER';

      /**
       * Allowed values configuration
       */
      allowed_values?:
        | ResolvedVariable.VariableAllowedValues1
        | ResolvedVariable.VariableAllowedValues2
        | null;

      /**
       * Constraints for variable types
       */
      constraints?: ResolvedVariable.Constraints | null;

      /**
       * Description of the variable's purpose
       */
      description?: string | null;

      /**
       * True if bound_value equals the default value
       */
      is_default?: boolean | null;

      /**
       * True if this is a runtime variable (not resolved at compile time). Runtime
       * variables have var() placeholders left in compiled SQL for literal substitution
       * at execution time.
       */
      is_runtime?: boolean | null;

      /**
       * Human-readable label for the variable
       */
      label?: string | null;
    }

    export namespace ResolvedVariable {
      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues1 {
        /**
         * Static list of allowed values with optional labels
         */
        static: Array<VariableAllowedValues1.Static>;
      }

      export namespace VariableAllowedValues1 {
        /**
         * A value with optional display label
         */
        export interface Static {
          /**
           * The actual value
           */
          value: string | number | boolean;

          /**
           * Human-readable label for the value
           */
          label?: string | null;
        }
      }

      /**
       * Allowed values for a variable - either static list or from column
       */
      export interface VariableAllowedValues2 {
        /**
         * Reference to column for dynamic values
         */
        from_column: string;

        /**
         * Cache time-to-live in seconds
         */
        cache_ttl?: number;

        /**
         * Maximum number of values to retrieve
         */
        limit?: number;

        /**
         * Sort order for values
         */
        order_by?: 'asc' | 'desc';
      }

      /**
       * Constraints for variable types
       */
      export interface Constraints {
        /**
         * Maximum allowed value
         */
        max?: number | null;

        /**
         * Maximum length for STRING variables
         */
        max_length?: number | null;

        /**
         * Minimum allowed value
         */
        min?: number | null;

        /**
         * Step increment for numeric input
         */
        step?: number | null;
      }
    }

    /**
     * A resolved select_from entry with CTE metadata
     */
    export interface SelectFrom {
      /**
       * CTE alias used in the WITH clause (e.g., **sf_compliance_rate**base)
       */
      cte_alias: string;

      /**
       * Columns produced by the CTE, available as q:query_name.field_name in the parent
       */
      output_columns: Array<SelectFrom.OutputColumn>;

      /**
       * Reference to the source query
       */
      ref: string;

      /**
       * Variable overrides passed to the referenced query
       */
      variables?: { [key: string]: string | number | boolean } | null;
    }

    export namespace SelectFrom {
      /**
       * A column produced by a select_from CTE
       */
      export interface OutputColumn {
        /**
         * The SQL column alias in the CTE output
         */
        column_alias: string;

        /**
         * The field name used in q:query_name.field_name references
         */
        field_name: string;

        /**
         * Original type of the field in the source query
         */
        source_type: 'dimension' | 'dimension_date' | 'measure' | 'calculation';
      }
    }
  }
}

export interface CompilerResolveParams {
  /**
   * Body param: Connection to resolve against
   */
  connection_id: string;

  /**
   * Body param: Reference to the query template (e.g. 'ref(MY_QUERY)')
   */
  query_ref: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Automatically fix broken refs caused by renames. Defaults to True.
   */
  auto_fix?: boolean;

  /**
   * Body param: Comma-separated slot selections and variable assignments. Reserved
   * keys: measure, dimension, filter, calculation. All other keys are variable
   * assignments. Example: 'measure=Compliance
   * Rate,dimension=Department,breakdown=region'
   */
  combination?: string;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
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
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerCompileDashboardParams as CompilerCompileDashboardParams,
    type CompilerEnumerateParams as CompilerEnumerateParams,
    type CompilerExecuteParams as CompilerExecuteParams,
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
}
