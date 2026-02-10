// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as DatabasesAPI from './databases';
import { Databases } from './databases';
import * as ViewsAPI from './views';
import { Views } from './views';
import * as YamlAPI from './yaml';
import { Yaml } from './yaml';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Connections extends APIResource {
  databases: DatabasesAPI.Databases = new DatabasesAPI.Databases(this._client);
  views: ViewsAPI.Views = new ViewsAPI.Views(this._client);
  yaml: YamlAPI.Yaml = new YamlAPI.Yaml(this._client);

  /**
   * List warehouse connections for the client.
   *
   * Filter connections by approval status using the `status` query parameter:
   *
   * - `approved` (default): Only approved connections (is_pending_approval=false)
   * - `pending`: Only connections awaiting PR approval (is_pending_approval=true)
   * - `all`: All connections regardless of approval status
   *
   * Pending connections include their approval PR URLs when available. Returns empty
   * list if GitHub is not configured.
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   */
  list(
    query: ConnectionListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ConnectionListResponse> {
    return this._client.get('/api/v1/connections', { query, ...options });
  }
}

/**
 * Response model for a single connection.
 *
 * All data comes from the database (source of truth). For YAML-compatible output
 * with 'kater_id', use the /schema endpoint instead.
 */
export interface Connection {
  /**
   * Connection ID
   */
  id: string;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Credential ID
   */
  credential_id: string;

  /**
   * Databases in this connection
   */
  databases: Array<Connection.Database>;

  /**
   * Connection name
   */
  name: string;

  /**
   * Last update timestamp
   */
  updated_at: string;

  /**
   * Warehouse-specific configuration
   */
  warehouse_metadata:
    | Connection.SnowflakeMetadata
    | Connection.PostgresqlMetadata
    | Connection.DatabricksMetadata
    | Connection.ClickhouseMetadata
    | Connection.MssqlMetadata;

  /**
   * Warehouse type (snowflake, postgresql, etc.)
   */
  warehouse_type: string;

  /**
   * GitHub PR URL for approving the connection (None if already approved)
   */
  approval_pr_url?: string | null;

  /**
   * Connection description
   */
  description?: string | null;

  /**
   * True if this connection is awaiting PR approval
   */
  is_pending_approval?: boolean;

  /**
   * Human-readable label
   */
  label?: string | null;

  /**
   * Query timeout in seconds
   */
  query_timeout?: number | null;

  /**
   * Timezone conversion mode (do_not_convert, convert_to_utc)
   */
  query_timezone_conversion?: string | null;
}

export namespace Connection {
  /**
   * Database info from ConnectionSchema.
   */
  export interface Database {
    /**
     * Database ID
     */
    id: string;

    /**
     * Actual name of the database in the warehouse
     */
    database_object_name: string;

    /**
     * Database name
     */
    name: string;

    /**
     * Schemas in this database
     */
    schemas: Array<Database.Schema>;

    /**
     * Database description
     */
    description?: string | null;

    /**
     * Human-readable label
     */
    label?: string | null;

    /**
     * Timezone for the database
     */
    timezone?: string | null;
  }

  export namespace Database {
    /**
     * Schema info from ConnectionSchema.
     */
    export interface Schema {
      /**
       * Schema ID
       */
      id: string;

      /**
       * Actual name of the schema in the warehouse
       */
      database_object_name: string;

      /**
       * Schema name
       */
      name: string;

      /**
       * Schema description
       */
      description?: string | null;

      /**
       * Human-readable label
       */
      label?: string | null;
    }
  }

  export interface SnowflakeMetadata {
    /**
     * Authentication method
     */
    auth_method: 'username_password' | 'key_pair';

    /**
     * Snowflake role
     */
    role: string;

    /**
     * Snowflake account identifier
     */
    snowflake_account_id: string;

    /**
     * Snowflake compute warehouse name
     */
    warehouse: string;

    warehouse_type: 'snowflake';
  }

  export interface PostgresqlMetadata {
    /**
     * Database host address
     */
    host: string;

    /**
     * Database port (default: 5432)
     */
    port: number;

    warehouse_type: 'postgresql';
  }

  export interface DatabricksMetadata {
    /**
     * Databricks SQL warehouse HTTP path
     */
    http_path: string;

    /**
     * Databricks server hostname
     */
    server_hostname: string;

    warehouse_type: 'databricks';
  }

  export interface ClickhouseMetadata {
    /**
     * ClickHouse host address
     */
    host: string;

    /**
     * ClickHouse port (default: 8443)
     */
    port: number;

    warehouse_type: 'clickhouse';
  }

  export interface MssqlMetadata {
    /**
     * SQL Server host address
     */
    host: string;

    /**
     * SQL Server port (default: 1433)
     */
    port: number;

    warehouse_type: 'mssql';
  }
}

/**
 * Database configuration for connection creation request.
 */
export interface DatabaseConfig {
  /**
   * Database name (also used as the warehouse object name)
   */
  name: string;

  /**
   * Description of the database
   */
  description?: string | null;

  /**
   * Human-readable label for the database (defaults to name if not set)
   */
  label?: string | null;

  /**
   * Schema configurations to include (empty = discover all schemas)
   */
  schemas?: Array<DatabaseConfig.Schema>;

  /**
   * Timezone for the database (e.g., 'UTC', 'America/New_York')
   */
  timezone?: string | null;
}

export namespace DatabaseConfig {
  /**
   * Schema configuration for connection creation request.
   */
  export interface Schema {
    /**
     * Schema name (also used as the warehouse object name)
     */
    name: string;

    /**
     * Description of the schema
     */
    description?: string | null;

    /**
     * Human-readable label for the schema (defaults to name if not set)
     */
    label?: string | null;
  }
}

/**
 * Response model for a single sync event.
 */
export interface SyncEventResponse {
  /**
   * Event ID
   */
  id: string;

  /**
   * Event timestamp
   */
  created_at: string;

  /**
   * Event type: step_started, step_completed, progress, warning, error
   */
  event_type: string;

  /**
   * Human-readable event message
   */
  message: string;

  /**
   * Additional event data
   */
  metadata?: { [key: string]: unknown };

  /**
   * Step name if applicable
   */
  step_name?: string | null;
}

export type ConnectionListResponse = Array<Connection>;

export interface ConnectionListParams {
  status?: 'approved' | 'pending' | 'all';
}

Connections.Databases = Databases;
Connections.Views = Views;
Connections.Yaml = Yaml;

export declare namespace Connections {
  export {
    type Connection as Connection,
    type DatabaseConfig as DatabaseConfig,
    type SyncEventResponse as SyncEventResponse,
    type ConnectionListResponse as ConnectionListResponse,
    type ConnectionListParams as ConnectionListParams,
  };

  export { Databases as Databases };

  export { Views as Views };

  export { Yaml as Yaml };
}
