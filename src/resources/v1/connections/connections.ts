// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as CompilerAPI from './compiler';
import {
  Compiler,
  CompilerCompileParams,
  CompilerCompileResponse,
  CompilerResolveParams,
  CompilerResolveResponse,
  CompilerValidateParams,
  CompilerValidateResponse,
} from './compiler';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Connections extends APIResource {
  compiler: CompilerAPI.Compiler = new CompilerAPI.Compiler(this._client);

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
  listConnections(
    query: ConnectionListConnectionsParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ConnectionListConnectionsResponse> {
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

export type ConnectionListConnectionsResponse = Array<Connection>;

export interface ConnectionListConnectionsParams {
  status?: 'approved' | 'pending' | 'all';
}

Connections.Compiler = Compiler;

export declare namespace Connections {
  export {
    type Connection as Connection,
    type ConnectionListConnectionsResponse as ConnectionListConnectionsResponse,
    type ConnectionListConnectionsParams as ConnectionListConnectionsParams,
  };

  export {
    Compiler as Compiler,
    type CompilerCompileResponse as CompilerCompileResponse,
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerResolveParams as CompilerResolveParams,
    type CompilerValidateParams as CompilerValidateParams,
  };
}
