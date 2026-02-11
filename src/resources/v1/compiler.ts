// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompilerAPI from './compiler';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Compiler extends APIResource {
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
   * Field or variable reference for size
   */
  size?: string | null;

  /**
   * Field or variable reference for stacking
   */
  stack_by?: string | null;

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
   * Generated SQL statement
   */
  sql?: string | null;
}

export namespace CompilerCompileResponse {
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
    widget_category: 'axis' | 'pie' | 'single_value' | 'heatmap' | 'table' | 'static';

    /**
     * Usage guidance for AI processing
     */
    ai_context?: string | null;

    /**
     * Optional subset of widget types within the declared widget_category that may
     * render this query
     */
    allowed_widget_types?: Array<
      | 'kpi_card'
      | 'line_chart'
      | 'bar_chart'
      | 'pie_chart'
      | 'donut_chart'
      | 'area_chart'
      | 'scatter_chart'
      | 'data_table'
      | 'card_grid'
      | 'heatmap'
      | 'gauge'
      | 'text'
      | 'image'
    > | null;

    /**
     * Merged required + selected optional calculations
     */
    calculations?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Chart recommendations preserved for evaluation
     */
    chart_hints?: Array<ResolvedQuery.ChartHint1 | ResolvedQuery.ChartHint2Output> | null;

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
     * Merged required + selected optional filters
     */
    filters?: Array<
      | ResolvedQuery.InlineFieldFilter
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
     * Access grants required to use this query
     */
    required_access_grants?: Array<string> | null;

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    resolved_chart?: ResolvedQuery.ResolvedChart | null;

    /**
     * Full variable definitions with bound values
     */
    resolved_variables?: Array<ResolvedQuery.ResolvedVariable> | null;
  }

  export namespace ResolvedQuery {
    /**
     * A chart recommendation rule
     */
    export interface ChartHint1 {
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
     * An inline filter using field + operator + values
     */
    export interface InlineFieldFilter {
      /**
       * Reference to the field to filter on
       */
      field: string;

      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * Filter operator to apply
       */
      operator:
        | 'equals'
        | 'not_equals'
        | 'in'
        | 'not_in'
        | 'greater_than'
        | 'less_than'
        | 'greater_than_or_equals'
        | 'less_than_or_equals'
        | 'between'
        | 'in_the_last'
        | 'in_the_next'
        | 'contains'
        | 'not_contains'
        | 'starts_with'
        | 'ends_with'
        | 'is_null'
        | 'is_not_null';

      /**
       * SQL expression for the filter value
       */
      sql_value?: string | null;

      /**
       * Fixed values for the filter
       */
      static_values?: Array<string | number | boolean> | null;
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
      bound_value: string | number | boolean;

      /**
       * Default value for this variable
       */
      default: string | number | boolean;

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
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Optional tenant database override
   */
  tenant_database?: string | null;

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
    widget_category: 'axis' | 'pie' | 'single_value' | 'heatmap' | 'table' | 'static';

    /**
     * Usage guidance for AI processing
     */
    ai_context?: string | null;

    /**
     * Optional subset of widget types within the declared widget_category that may
     * render this query
     */
    allowed_widget_types?: Array<
      | 'kpi_card'
      | 'line_chart'
      | 'bar_chart'
      | 'pie_chart'
      | 'donut_chart'
      | 'area_chart'
      | 'scatter_chart'
      | 'data_table'
      | 'card_grid'
      | 'heatmap'
      | 'gauge'
      | 'text'
      | 'image'
    > | null;

    /**
     * Merged required + selected optional calculations
     */
    calculations?: Array<CompilerAPI.RefWithLabel | CompilerAPI.InlineField | string> | null;

    /**
     * Chart recommendations preserved for evaluation
     */
    chart_hints?: Array<ResolvedQuery.ChartHint1 | ResolvedQuery.ChartHint2Input> | null;

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
     * Merged required + selected optional filters
     */
    filters?: Array<
      | ResolvedQuery.InlineFieldFilter
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
     * Access grants required to use this query
     */
    required_access_grants?: Array<string> | null;

    /**
     * The matched chart recommendation after evaluating chart hints
     */
    resolved_chart?: ResolvedQuery.ResolvedChart | null;

    /**
     * Full variable definitions with bound values
     */
    resolved_variables?: Array<ResolvedQuery.ResolvedVariable> | null;
  }

  export namespace ResolvedQuery {
    /**
     * A chart recommendation rule
     */
    export interface ChartHint1 {
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
     * An inline filter using field + operator + values
     */
    export interface InlineFieldFilter {
      /**
       * Reference to the field to filter on
       */
      field: string;

      /**
       * Name of the inline filter
       */
      name: string;

      /**
       * Filter operator to apply
       */
      operator:
        | 'equals'
        | 'not_equals'
        | 'in'
        | 'not_in'
        | 'greater_than'
        | 'less_than'
        | 'greater_than_or_equals'
        | 'less_than_or_equals'
        | 'between'
        | 'in_the_last'
        | 'in_the_next'
        | 'contains'
        | 'not_contains'
        | 'starts_with'
        | 'ends_with'
        | 'is_null'
        | 'is_not_null';

      /**
       * SQL expression for the filter value
       */
      sql_value?: string | null;

      /**
       * Fixed values for the filter
       */
      static_values?: Array<string | number | boolean> | null;
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
      bound_value: string | number | boolean;

      /**
       * Default value for this variable
       */
      default: string | number | boolean;

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
   * Body param: Calculation names to include
   */
  include_calculations?: Array<string>;

  /**
   * Body param: Dimension names to include
   */
  include_dimensions?: Array<string>;

  /**
   * Body param: Filter names to include
   */
  include_filters?: Array<string>;

  /**
   * Body param: Measure names to include
   */
  include_measures?: Array<string>;

  /**
   * Body param: User-selected variable values
   */
  variables?: { [key: string]: unknown };

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
   * Body param: Optional connection IDs to validate. If omitted, validates all
   * connections.
   */
  connection_ids?: Array<string> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

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
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerResolveParams as CompilerResolveParams,
    type CompilerValidateParams as CompilerValidateParams,
  };
}
