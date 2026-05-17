// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

/**
 * Validate, resolve, and compile query templates to SQL
 */
export class Capabilities extends APIResource {
  /**
   * Return capabilities for every query in `request.connection_id`.
   *
   * The handler:
   *
   * 1. Builds per-request `CredentialService`, `ConnectionService`, and
   *    `CompilerApiService` instances (matching the structured render route's
   *    per-request lifetime).
   * 2. Resolves tenant parameters via
   *    `resolve_tenant_params(..., tenant_key=NO_TENANT_KEY)` (connection access
   *    only; capabilities is tenant-agnostic per PRD `#capabilities-service`).
   * 3. Wraps the build call in `stage_span("compiler.capabilities", ...)` and
   *    records pipeline duration in a `finally` block via
   *    `record_pipeline_call(pipeline="compiler_capabilities", ...)`.
   * 4. Awaits `CapabilitiesService.build(...)` exactly once.
   * 5. Maps known errors to typed `ApiError` (`ConnectionNotFoundError` → 404,
   *    `SchemaParseError` → 400). Unexpected exceptions propagate.
   * 6. Emits one `capabilities_succeeded` log event on success or
   *    `capabilities_failed` on error. The events log `connection_id` / `client_id`
   *    / `query_count` only — never variable values, `allowed_values_static`, or
   *    filter `presets` (PRD NFR8).
   *
   * Consumer surfaces this route serves (post Stories 4.2, 5.1, 6.2, 6.3, 6.5):
   * Query Builder capabilities loader, SDK request builder defaults, CLI
   * `kater capabilities` (Story 6.2 owns command surface), language server
   * `kater/queryCapabilities` (Story 6.3 imports the service directly), chat tool
   * capabilities lookup.
   */
  create(params: CapabilityCreateParams, options?: RequestOptions): APIPromise<CapabilityCreateResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/capabilities', {
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
   * Sample `n` deterministic representative selections for one query.
   *
   * Pipeline:
   *
   * 1. Build per-request `CredentialService`, `ConnectionService`,
   *    `CompilerApiService`, `CapabilitiesService` instances (matching the
   *    structured render and capabilities routes' per-request lifetime).
   * 2. Resolve tenant parameters via
   *    `resolve_tenant_params(..., tenant_key=NO_TENANT_KEY)` (sampling is
   *    connection-scoped metadata- derived; tenant_key only controls connection
   *    access).
   * 3. Wrap the build + sample calls in
   *    `stage_span("compiler.capability_sampling", ...)` and record pipeline
   *    duration in a `finally` block via
   *    `record_pipeline_call(pipeline="compiler_capability_sampling", ...)`.
   * 4. Call `CapabilitiesService.build(...)` once with
   *    `query_kater_ids=[query_kater_id]` to get the input metadata.
   * 5. Map missing query to HTTP 404 (`query_not_found`); empty `response.queries`
   *    indicates the query is not present in the connection.
   * 6. Look up the `QuerySchema` from the in-process index (used by the
   *    pinned-variant tier when `include_pinned_variants=True`).
   * 7. Call `sample_field_selections(...)` once to produce the typed result.
   * 8. Map known errors to typed `ApiError` (`ConnectionNotFoundError` → 404,
   *    `SchemaParseError` → 400).
   * 9. Emit one `capability_sampling_succeeded` log on success or
   *    `capability_sampling_failed` on error. The events log `query UUID` /
   *    `client UUID` / `n` / `available` / `truncated` only, never variable values,
   *    allowed-value lists, filter values, or sample payloads (PRD NFR8).
   *
   * The response shape matches Story 6.2's CLI shim verbatim so deployed CLIs
   * deserialize successfully without redeploying.
   */
  sample(params: CapabilitySampleParams, options?: RequestOptions): APIPromise<CapabilitySampleResponse> {
    const { source, 'X-Kater-CLI-ID': xKaterCliID, ...body } = params;
    return this._client.post('/api/v1/compiler/capabilities/sample', {
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
 * Response shape for `POST /api/v1/compiler/capabilities`.
 *
 * Replaces `EnumerateResponse.combinations`; consumers build
 * `RenderedQueryRequestV1.field_selection` from `selectable_fields` plus
 * `default_selected_fields` instead of enumerating combinations.
 */
export interface CapabilityCreateResponse {
  /**
   * Connection identifier (UUID or canonical key)
   */
  connection_id: string;

  /**
   * Capabilities for each query in the connection. Outer ordering is deterministic
   * (by `query_kater_id` UUID lex order); the per-query payload is identical to the
   * on-disk artifact.
   */
  queries?: Array<CapabilityCreateResponse.Query>;
}

export namespace CapabilityCreateResponse {
  /**
   * Capabilities for a single query.
   *
   * Identical payload whether served over HTTP (one entry of
   * `QueryCapabilitiesResponseV1.queries`) or written to disk (one value of
   * `QueryCapabilitiesArtifact.queries`).
   *
   * Identity uses `kater_id` (UUID) throughout; `query_ref` is a provenance label
   * for human inspection only.
   */
  export interface Query {
    /**
     * Owning query UUID (stable identity)
     */
    query_kater_id: string;

    /**
     * Display label for the query
     */
    query_label: string | null;

    /**
     * Authored ref string (e.g. `q:compliance_rate`); provenance only, not identity
     */
    query_ref: string;

    /**
     * Widget category name
     */
    widget_category: string;

    /**
     * Widget category and per-widget-type constraints scoped to this query
     */
    widget_constraints: Query.WidgetConstraints;

    /**
     * Default runtime filter state to seed `RenderedQueryRequestV1.filter_state`
     */
    default_filter_state?: Array<Query.DefaultFilterState>;

    /**
     * Field occurrences the backend selects by default when a consumer omits
     * `field_selection.selected_fields`. Typically empty when required fields cover
     * the base render.
     */
    default_selected_fields?: Array<Query.DefaultSelectedField>;

    /**
     * Category-level field selection constraints for one query.
     *
     * Sourced from `widget_constraints.load_widget_constraints(widget_category)` and
     * consumed by the frontend Query Builder field selector to prevent the user from
     * constructing an active field set that
     * `FieldSelectionResolver.validate_constraints()` would reject.
     *
     * `widget_constraints` (the sibling field on `QueryCapabilitiesItemV1`) is
     * per-widget-type and is the wrong contract for the field selector, which enforces
     * the _category_ limits the backend resolver uses.
     */
    field_selection_constraints?: Query.FieldSelectionConstraints | null;

    /**
     * Effective filter definitions in scope for this query
     */
    filter_definitions?: Array<Query.FilterDefinition>;

    /**
     * Field occurrences that the backend always includes in the rendered output.
     */
    required_fields?: Array<Query.RequiredField>;

    /**
     * All fields a consumer can select, including required ones. Ordering is
     * deterministic: authoring order, then `kater_id` lex (matches NFR5).
     */
    selectable_fields?: Array<Query.SelectableField>;

    /**
     * Variable definitions for the query (flat list, not name-keyed dict)
     */
    variable_definitions?: Array<Query.VariableDefinition>;
  }

  export namespace Query {
    /**
     * Widget category and per-widget-type constraints scoped to this query
     */
    export interface WidgetConstraints {
      /**
       * Per-widget-type constraints sourced from the widget category mapping
       */
      constraints: WidgetConstraints.Constraints;

      /**
       * Widget category name (matches WidgetCategoryMapping keys)
       */
      widget_category: string;
    }

    export namespace WidgetConstraints {
      /**
       * Per-widget-type constraints sourced from the widget category mapping
       */
      export interface Constraints {
        calculations_allowed: boolean;

        /**
         * Dimension constraint with optional semantic flags.
         */
        dimensions: Constraints.Dimensions;

        /**
         * Numeric min/max range constraint.
         */
        metrics: Constraints.Metrics;

        requires_calculation?: boolean;
      }

      export namespace Constraints {
        /**
         * Dimension constraint with optional semantic flags.
         */
        export interface Dimensions {
          max: number | null;

          min: number;

          excludes_datetime_dimension?: boolean;

          max_cardinality?: number | null;

          requires_categorical?: boolean;

          requires_datetime_dimension?: boolean;
        }

        /**
         * Numeric min/max range constraint.
         */
        export interface Metrics {
          max: number | null;

          min: number;
        }
      }
    }

    export interface DefaultFilterState {
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

    /**
     * Semantic identity for an active output field: source_kater_id plus normalized
     * modifiers.
     */
    export interface DefaultSelectedField {
      /**
       * Normalized modifiers sorted by kind. Raw timeframe is represented by an empty
       * array.
       */
      modifiers: Array<DefaultSelectedField.Modifier>;

      /**
       * Stable UUID of the source field this occurrence projects.
       */
      source_kater_id: string;
    }

    export namespace DefaultSelectedField {
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
     * Category-level field selection constraints for one query.
     *
     * Sourced from `widget_constraints.load_widget_constraints(widget_category)` and
     * consumed by the frontend Query Builder field selector to prevent the user from
     * constructing an active field set that
     * `FieldSelectionResolver.validate_constraints()` would reject.
     *
     * `widget_constraints` (the sibling field on `QueryCapabilitiesItemV1`) is
     * per-widget-type and is the wrong contract for the field selector, which enforces
     * the _category_ limits the backend resolver uses.
     */
    export interface FieldSelectionConstraints {
      /**
       * Exact category-level constraints used by the backend resolver
       */
      constraints: FieldSelectionConstraints.Constraints;

      /**
       * Widget category name (matches WidgetCategoryMapping keys)
       */
      widget_category: string;
    }

    export namespace FieldSelectionConstraints {
      /**
       * Exact category-level constraints used by the backend resolver
       */
      export interface Constraints {
        calculations_allowed: boolean;

        /**
         * Numeric min/max range constraint.
         */
        dimensions: Constraints.Dimensions;

        /**
         * Numeric min/max range constraint.
         */
        metrics: Constraints.Metrics;
      }

      export namespace Constraints {
        /**
         * Numeric min/max range constraint.
         */
        export interface Dimensions {
          max: number | null;

          min: number;
        }

        /**
         * Numeric min/max range constraint.
         */
        export interface Metrics {
          max: number | null;

          min: number;
        }
      }
    }

    /**
     * Effective filter definition exposed via capabilities.
     *
     * This is a deliberate subset of the API-layer `FilterDefinitionResponse` shape,
     * not a full mirror. The capabilities surface is intentionally decoupled so
     * `packages/core` does not depend on `apps/api`, and so the JSON schema stays
     * flat. Fields the capabilities surface omits include expressive value payloads
     * (`static_value`, `default_value`, `values`, `presets`), AI-assistance metadata
     * (`ai_context`), null-handling hints (`allow_null_value`, `null_label`), and UI
     * placeholder/help strings; consumers that need those should fetch them from the
     * API model. The fields included here are sufficient for capabilities-driven UI
     * and request construction. Identity is `kater_id` (UUID); the legacy name-based
     * `field` ref is replaced with `field_kater_id`.
     */
    export interface FilterDefinition {
      /**
       * Canonical data type
       */
      data_type: string;

      /**
       * Stable effective runtime filter ID (UUID)
       */
      effective_kater_id: string;

      /**
       * Structured filter expression (operator literal)
       */
      expression: string;

      /**
       * Concrete declaration ID from the merged definition
       */
      kater_id: string;

      /**
       * Filter mode
       */
      mode: 'static' | 'parameterized';

      /**
       * Logical filter name
       */
      name: string;

      /**
       * Whether the filter is always active
       */
      required: boolean;

      /**
       * Filter scope
       */
      scope: 'model' | 'topic' | 'dashboard' | 'query';

      /**
       * Concrete declaration IDs (UUIDs) that contributed to this effective filter
       */
      declaration_kater_ids?: Array<string>;

      /**
       * Default enabled state at runtime
       */
      default_enabled?: boolean | null;

      /**
       * Free-form filter description
       */
      description?: string | null;

      /**
       * Field UUID this filter targets (when the filter binds to a field)
       */
      field_kater_id?: string | null;

      /**
       * Interactive filter kind (date, dropdown, etc.)
       */
      kind?: string | null;

      /**
       * Display label
       */
      label?: string | null;

      /**
       * Owner UUIDs from model/topic/dashboard/query precedence order
       */
      owner_chain?: Array<string>;
    }

    /**
     * Semantic identity for an active output field: source_kater_id plus normalized
     * modifiers.
     */
    export interface RequiredField {
      /**
       * Normalized modifiers sorted by kind. Raw timeframe is represented by an empty
       * array.
       */
      modifiers: Array<RequiredField.Modifier>;

      /**
       * Stable UUID of the source field this occurrence projects.
       */
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

    /**
     * One selectable field exposed by a query, with generic modifier controls.
     *
     * Identity is `kater_id` (UUID). `name` is a display-only label.
     *
     * Modifier invariants (enforced by `validate_modifier_controls`):
     *
     * - Non-dimension fields must not expose modifier controls.
     * - Timeframe controls require `data_type.kind == Datetime`.
     * - `default_value` must appear in `allowed_values`.
     * - Fixed controls expose only `default_value`.
     */
    export interface SelectableField {
      /**
       * Canonical data type for this field
       */
      data_type: SelectableField.DataType;

      /**
       * True when the field appears in the deterministic backend default selection
       */
      default_selected: boolean;

      /**
       * Long-form description for UI tooltips
       */
      description: string | null;

      /**
       * Field kind: dimension, measure, or calculation
       */
      field_type: 'dimension' | 'measure' | 'calculation';

      /**
       * Authored field UUID (stable identity)
       */
      kater_id: string;

      /**
       * Display label (may be renamed)
       */
      label: string | null;

      /**
       * Field name within the query
       */
      name: string;

      /**
       * True when the field is always part of the rendered output
       */
      required: boolean;

      /**
       * Origin of the field: directly authored by the query, inherited from the parent
       * query, or pinned through a query variant.
       */
      source: 'query' | 'parent' | 'pinned_variant';

      /**
       * Generic modifier controls this field exposes. Empty for fields with no editable
       * or fixed modifiers.
       */
      modifier_controls?: Array<SelectableField.ModifierControl>;
    }

    export namespace SelectableField {
      /**
       * Canonical data type for this field
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
       * UI/control metadata for choosing a modifier value for one source field.
       */
      export interface ModifierControl {
        /**
         * Allowed values for this control. Raw may appear here as a UI value.
         */
        allowed_values: Array<string>;

        /**
         * Default value consumers should preselect. Must appear in allowed_values.
         */
        default_value: string;

        /**
         * When true, default_value is the only selectable value exposed by capabilities.
         */
        fixed: boolean;

        /**
         * Modifier kind this control edits.
         */
        kind: 'timeframe';
      }
    }

    /**
     * A variable's schema exposed via capabilities.
     *
     * `variable_kater_id` is preferred. Until every authoring surface exposes a stable
     * variable UUID, the migration fallback identity is
     * `(query_kater_id, scope, name)`. Consumers SHOULD prefer `variable_kater_id` and
     * fall back only when it is `null`.
     */
    export interface VariableDefinition {
      /**
       * Canonical data type inferred from the shared variable model helper
       */
      data_type: VariableDefinition.DataType;

      /**
       * True = dynamic (entered at run time); False = static (authored default that
       * never changes at runtime).
       */
      is_runtime: boolean;

      /**
       * Variable name within scope
       */
      name: string;

      /**
       * Owning query UUID
       */
      query_kater_id: string;

      /**
       * Variable scope: query-local or global
       */
      scope: 'query' | 'global';

      /**
       * Stable variable UUID. Fall back to (query_kater_id, scope, name) when null
       * (migration fallback only).
       */
      variable_kater_id: string | null;

      /**
       * Variable control type
       */
      variable_type: 'date' | 'number_input' | 'text_input' | 'dropdown' | 'multiselect' | 'number_range';

      /**
       * Dimension column UUID for from-column variables; null otherwise
       */
      allowed_values_column_kater_id?: string | null;

      /**
       * Static enumeration of allowed values; null when the variable is unconstrained or
       * column-derived
       */
      allowed_values_static?: Array<VariableDefinition.AllowedValuesStatic> | null;

      /**
       * Authored default value
       */
      default?:
        | string
        | number
        | boolean
        | Array<string | number | boolean>
        | VariableDefinition.NumberRangeDefault
        | VariableDefinition.RelativeDateDefault
        | null;

      /**
       * Free-form description
       */
      description?: string | null;

      /**
       * Display label
       */
      label?: string | null;

      /**
       * Selection domain for selectable query variables
       */
      source_kind?: 'Literal' | 'Dimension' | 'Measure' | 'Calculation' | null;
    }

    export namespace VariableDefinition {
      /**
       * Canonical data type inferred from the shared variable model helper
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
       * Default payload for number range variables.
       */
      export interface NumberRangeDefault {
        end: number;

        start: number;

        mode?: 'number_range';
      }

      /**
       * A relative date default for DATE/TIMESTAMP variables. Computes a concrete date
       * relative to the current date at resolve time.
       */
      export interface RelativeDateDefault {
        /**
         * Offset amount. Negative = past, positive = future (e.g., -30 = 30 days ago)
         */
        amount: number;

        /**
         * Time unit for the offset
         */
        unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
      }
    }
  }
}

/**
 * Response shape for `POST /api/v1/compiler/capabilities/sample`.
 *
 * Matches Story 6.2's CLI shim `CapabilitySampleResponse` verbatim: `samples`
 * carries the deterministic ordered list of sampled selections, `truncated` is
 * True when the request asked for more samples than exist, `available` documents
 * the actual unique-selection count.
 *
 * `extra="allow"` ensures the deployed CLI shim deserializes future additions
 * (e.g. a `metadata` block for telemetry) without redeploying.
 */
export interface CapabilitySampleResponse {
  available?: number;

  samples?: Array<CapabilitySampleResponse.Sample>;

  truncated?: boolean;

  [k: string]: unknown;
}

export namespace CapabilitySampleResponse {
  /**
   * Consumer-facing request shape. Excludes legacy `combination_id` / `combination`
   * by contract: selected fields and variables are represented directly.
   */
  export interface Sample {
    connection_id: string;

    /**
     * Dashboard context block in `RenderedQueryRequestV1`.
     */
    dashboard: Sample.Dashboard | null;

    /**
     * Structured field selection expressed as semantic field occurrences.
     */
    field_selection: Sample.FieldSelection;

    filter_state: Array<Sample.FilterState>;

    pinned_variant: string | null;

    /**
     * Presentation config block in `RenderedQueryRequestV1`.
     */
    presentation: Sample.Presentation;

    query_kater_id: string;

    /**
     * Result window block in `RenderedQueryRequestV1` (consumers do not supply
     * backend-computed `query_limit`, `max_row_limit`, `effective_limit`).
     */
    result_window: Sample.ResultWindow;

    /**
     * Request clock block in `RenderedQueryRequestV1`. Either field may be `null` on
     * the request; the backend resolves both before canonicalization (the canonical
     * `temporal` block requires non-null `timezone` and `as_of`).
     */
    temporal: Sample.Temporal;

    variables: Array<Sample.Variable>;
  }

  export namespace Sample {
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

    /**
     * Presentation config block in `RenderedQueryRequestV1`.
     */
    export interface Presentation {
      chart?: {
        [key: string]:
          | string
          | number
          | number
          | boolean
          | null
          | Array<unknown>
          | { [key: string]: unknown };
      };

      display?: {
        [key: string]:
          | string
          | number
          | number
          | boolean
          | null
          | Array<unknown>
          | { [key: string]: unknown };
      };

      style?: {
        [key: string]:
          | string
          | number
          | number
          | boolean
          | null
          | Array<unknown>
          | { [key: string]: unknown };
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
}

export interface CapabilityCreateParams {
  /**
   * Body param: Connection UUID to enumerate capabilities against
   */
  connection_id: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: Optional list of query UUIDs to limit the response. When omitted (or
   * null), the response includes capabilities for every query in the connection.
   */
  query_ids?: Array<string> | null;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export interface CapabilitySampleParams {
  /**
   * Body param: Connection UUID to sample selections against
   */
  connection_id: string;

  /**
   * Body param: Number of representative selections requested (must be >= 1)
   */
  n: number;

  /**
   * Body param: Query UUID to sample selections for
   */
  query_kater_id: string;

  /**
   * Query param
   */
  source?: string | null;

  /**
   * Body param: When true, include tier-8 optional filter variants in the sample
   */
  include_filter_variants?: boolean;

  /**
   * Body param: When true, include pinned-variant variants in the sample
   */
  include_pinned_variants?: boolean;

  /**
   * Header param
   */
  'X-Kater-CLI-ID'?: string;
}

export declare namespace Capabilities {
  export {
    type CapabilityCreateResponse as CapabilityCreateResponse,
    type CapabilitySampleResponse as CapabilitySampleResponse,
    type CapabilityCreateParams as CapabilityCreateParams,
    type CapabilitySampleParams as CapabilitySampleParams,
  };
}
