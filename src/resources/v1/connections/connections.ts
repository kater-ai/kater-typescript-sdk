// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as DatabasesAPI from './databases';
import { DatabaseDeleteSchemaParams, Databases } from './databases';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Connections extends APIResource {
  databases: DatabasesAPI.Databases = new DatabasesAPI.Databases(this._client);

  /**
   * Create a new warehouse connection.
   */
  create(body: ConnectionCreateParams, options?: RequestOptions): APIPromise<Connection> {
    return this._client.post('/api/v1/connections', { body, ...options });
  }

  /**
   * Get a single warehouse connection by kater_id.
   *
   * Returns connection from the database (source of truth) with full hierarchy.
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: NotFoundError: If connection doesn't exist (404)
   */
  retrieve(connectionID: string, options?: RequestOptions): APIPromise<Connection> {
    return this._client.get(path`/api/v1/connections/${connectionID}`, options);
  }

  /**
   * List all warehouse connections for the client.
   *
   * Returns connections from the database joined with schema information from
   * GitHub. Connections with pending PRs will have null GitHub fields until merged.
   * Returns empty list if GitHub is not configured.
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   */
  list(options?: RequestOptions): APIPromise<ConnectionListResponse> {
    return this._client.get('/api/v1/connections', options);
  }

  /**
   * Get decrypted warehouse credentials for a connection.
   *
   * Returns the decrypted credentials for a connection. This is sensitive data and
   * should only be used when actually needed for warehouse operations.
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: NotFoundError: If connection doesn't exist (404)
   */
  retrieveCredential(
    connectionID: string,
    options?: RequestOptions,
  ): APIPromise<ConnectionRetrieveCredentialResponse> {
    return this._client.get(path`/api/v1/connections/${connectionID}/credential`, options);
  }

  /**
   * Sync view schemas from warehouse and create a PR (or update existing).
   */
  sync(connectionID: string, options?: RequestOptions): APIPromise<ConnectionSyncResponse> {
    return this._client.post(path`/api/v1/connections/${connectionID}/sync`, options);
  }
}

/**
 * Response model for a single connection.
 *
 * All data comes from the database (source of truth). The id field serves as the
 * kater_id.
 */
export interface Connection {
  /**
   * Connection ID (also the kater_id)
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
   * Connection description
   */
  description: string | null;

  /**
   * Human-readable label
   */
  label: string | null;

  /**
   * Connection name
   */
  name: string;

  /**
   * Last update timestamp
   */
  updated_at: string;

  /**
   * Snowflake account identifier
   */
  account?: string | null;

  /**
   * Database host (PostgreSQL, MSSQL, ClickHouse)
   */
  host?: string | null;

  /**
   * Databricks HTTP path
   */
  http_path?: string | null;

  /**
   * Database port (PostgreSQL, MSSQL, ClickHouse)
   */
  port?: number | null;

  /**
   * Snowflake role
   */
  role?: string | null;

  /**
   * Databricks server hostname
   */
  server_hostname?: string | null;

  /**
   * Snowflake or Databricks warehouse name
   */
  warehouse?: string | null;
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
     * Database description
     */
    description: string | null;

    /**
     * Human-readable label
     */
    label: string | null;

    /**
     * Database name
     */
    name: string;

    /**
     * Schemas in this database
     */
    schemas: Array<Database.Schema>;

    /**
     * Timezone for the database
     */
    timezone: string | null;
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
       * Schema description
       */
      description: string | null;

      /**
       * Human-readable label
       */
      label: string | null;

      /**
       * Schema name
       */
      name: string;
    }
  }
}

/**
 * Database configuration for connection creation request.
 */
export interface DatabaseConfig {
  /**
   * Database name
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
     * Schema name
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

export type ConnectionListResponse = Array<Connection>;

/**
 * PostgreSQL credential response.
 */
export type ConnectionRetrieveCredentialResponse =
  | ConnectionRetrieveCredentialResponse.PostgresCredentialResponse
  | ConnectionRetrieveCredentialResponse.SnowflakeCredentialResponse
  | ConnectionRetrieveCredentialResponse.DatabricksCredentialResponse
  | ConnectionRetrieveCredentialResponse.ClickHouseCredentialResponse
  | ConnectionRetrieveCredentialResponse.MssqlCredentialResponse;

export namespace ConnectionRetrieveCredentialResponse {
  /**
   * PostgreSQL credential response.
   */
  export interface PostgresCredentialResponse {
    /**
     * Database name
     */
    database: string | null;

    /**
     * Database host
     */
    host: string;

    /**
     * Decrypted password
     */
    password: string;

    /**
     * Database port
     */
    port: number;

    /**
     * Database username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'postgresql';
  }

  /**
   * Snowflake credential response.
   */
  export interface SnowflakeCredentialResponse {
    /**
     * Snowflake account identifier
     */
    account: string;

    /**
     * Authentication credentials
     */
    auth:
      | SnowflakeCredentialResponse.SnowflakePasswordAuthResponse
      | SnowflakeCredentialResponse.SnowflakePrivateKeyAuthResponse;

    /**
     * Snowflake role
     */
    role: string;

    /**
     * Snowflake username
     */
    username: string;

    /**
     * Compute warehouse name
     */
    warehouse: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'snowflake';
  }

  export namespace SnowflakeCredentialResponse {
    /**
     * Snowflake password authentication response.
     */
    export interface SnowflakePasswordAuthResponse {
      /**
       * Authentication type
       */
      auth_type: 'password';

      /**
       * Decrypted password
       */
      password: string;
    }

    /**
     * Snowflake private key authentication response.
     */
    export interface SnowflakePrivateKeyAuthResponse {
      /**
       * Authentication type
       */
      auth_type: 'private_key';

      /**
       * PEM-encoded private key
       */
      private_key: string;

      /**
       * Passphrase if key is encrypted
       */
      private_key_passphrase: string | null;
    }
  }

  /**
   * Databricks credential response.
   */
  export interface DatabricksCredentialResponse {
    /**
     * Databricks personal access token
     */
    access_token: string;

    /**
     * SQL warehouse HTTP path
     */
    http_path: string;

    /**
     * Databricks server hostname
     */
    server_hostname: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'databricks';
  }

  /**
   * ClickHouse credential response.
   */
  export interface ClickHouseCredentialResponse {
    /**
     * Database name
     */
    database: string | null;

    /**
     * ClickHouse host
     */
    host: string;

    /**
     * Decrypted password
     */
    password: string;

    /**
     * ClickHouse port
     */
    port: number;

    /**
     * ClickHouse username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'clickhouse';
  }

  /**
   * Microsoft SQL Server credential response.
   */
  export interface MssqlCredentialResponse {
    /**
     * Database name
     */
    database: string | null;

    /**
     * SQL Server host
     */
    host: string;

    /**
     * Decrypted password
     */
    password: string;

    /**
     * SQL Server port
     */
    port: number;

    /**
     * SQL Server username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'mssql';
  }
}

/**
 * Response for syncing views.
 *
 * Returned after successfully creating a PR with merged ViewSchema files.
 */
export interface ConnectionSyncResponse {
  /**
   * GitHub PR number
   */
  pr_number: number;

  /**
   * GitHub PR URL
   */
  pr_url: string;

  /**
   * Number of views in the PR
   */
  views_updated: number;
}

export type ConnectionCreateParams =
  | ConnectionCreateParams.PostgresConnectionConfig
  | ConnectionCreateParams.SnowflakeConnectionConfig
  | ConnectionCreateParams.DatabricksConnectionConfig
  | ConnectionCreateParams.ClickHouseConnectionConfig
  | ConnectionCreateParams.MssqlConnectionConfig;

export declare namespace ConnectionCreateParams {
  export interface PostgresConnectionConfig {
    /**
     * Databases to include in the connection (at least one required)
     */
    databases: Array<DatabaseConfig>;

    /**
     * Database host
     */
    host: string;

    /**
     * Name of the connection
     */
    name: string;

    /**
     * Database password
     */
    password: string;

    /**
     * Database username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'postgresql';

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;

    /**
     * Database port
     */
    port?: number;
  }

  export interface SnowflakeConnectionConfig {
    /**
     * Snowflake account identifier (e.g., 'xy12345.us-east-1')
     */
    account: string;

    /**
     * Authentication configuration
     */
    auth: SnowflakeConnectionConfig.SnowflakePasswordAuth | SnowflakeConnectionConfig.SnowflakePrivateKeyAuth;

    /**
     * Databases to include in the connection (at least one required)
     */
    databases: Array<DatabaseConfig>;

    /**
     * Name of the connection
     */
    name: string;

    /**
     * Snowflake role
     */
    role: string;

    /**
     * Snowflake username
     */
    username: string;

    /**
     * Compute warehouse name
     */
    warehouse: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'snowflake';

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;
  }

  export namespace SnowflakeConnectionConfig {
    /**
     * Snowflake password authentication.
     */
    export interface SnowflakePasswordAuth {
      /**
       * Authentication type
       */
      auth_type: 'password';

      /**
       * Snowflake password
       */
      password: string;
    }

    /**
     * Snowflake private key authentication.
     */
    export interface SnowflakePrivateKeyAuth {
      /**
       * Authentication type
       */
      auth_type: 'private_key';

      /**
       * PEM-encoded private key
       */
      private_key: string;

      /**
       * Passphrase if key is encrypted
       */
      private_key_passphrase?: string | null;
    }
  }

  export interface DatabricksConnectionConfig {
    /**
     * Databricks personal access token
     */
    access_token: string;

    /**
     * Databases to include in the connection (at least one required)
     */
    databases: Array<DatabaseConfig>;

    /**
     * SQL warehouse HTTP path (e.g., '/sql/1.0/warehouses/xxx')
     */
    http_path: string;

    /**
     * Name of the connection
     */
    name: string;

    /**
     * Databricks server hostname (e.g., 'dbc-xxx.cloud.databricks.com')
     */
    server_hostname: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'databricks';

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;
  }

  export interface ClickHouseConnectionConfig {
    /**
     * Databases to include in the connection (at least one required)
     */
    databases: Array<DatabaseConfig>;

    /**
     * ClickHouse host
     */
    host: string;

    /**
     * Name of the connection
     */
    name: string;

    /**
     * ClickHouse password
     */
    password: string;

    /**
     * ClickHouse username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'clickhouse';

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;

    /**
     * ClickHouse port
     */
    port?: number;
  }

  export interface MssqlConnectionConfig {
    /**
     * Databases to include in the connection (at least one required)
     */
    databases: Array<DatabaseConfig>;

    /**
     * SQL Server host
     */
    host: string;

    /**
     * Name of the connection
     */
    name: string;

    /**
     * SQL Server password
     */
    password: string;

    /**
     * SQL Server username
     */
    username: string;

    /**
     * Warehouse type
     */
    warehouse_type: 'mssql';

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;

    /**
     * SQL Server port
     */
    port?: number;
  }
}

Connections.Databases = Databases;

export declare namespace Connections {
  export {
    type Connection as Connection,
    type DatabaseConfig as DatabaseConfig,
    type ConnectionListResponse as ConnectionListResponse,
    type ConnectionRetrieveCredentialResponse as ConnectionRetrieveCredentialResponse,
    type ConnectionSyncResponse as ConnectionSyncResponse,
    type ConnectionCreateParams as ConnectionCreateParams,
  };

  export { Databases as Databases, type DatabaseDeleteSchemaParams as DatabaseDeleteSchemaParams };
}
