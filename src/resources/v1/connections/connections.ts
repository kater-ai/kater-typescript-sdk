// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as DatabasesAPI from './databases';
import {
  DatabaseDeleteSchemaParams,
  DatabaseUpdateParams,
  DatabaseUpdateResponse,
  DatabaseUpdateSchemaParams,
  DatabaseUpdateSchemaResponse,
  Databases,
} from './databases';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
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
   * Supports content negotiation via Accept header (handled by MultiFormatRoute):
   *
   * - application/json (default): Returns JSON response
   * - application/yaml: Returns YAML representation
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: NotFoundError: If connection doesn't exist (404)
   */
  retrieve(connectionID: string, options?: RequestOptions): APIPromise<Connection> {
    return this._client.get(path`/api/v1/connections/${connectionID}`, options);
  }

  /**
   * Update a warehouse connection's metadata.
   *
   * Updates name, label, and/or description fields.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ConnectionNotFoundError: If connection doesn't exist (404)
   */
  update(
    connectionID: string,
    body: ConnectionUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Connection> {
    return this._client.patch(path`/api/v1/connections/${connectionID}`, { body, ...options });
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
   * Delete a warehouse connection.
   *
   * Soft-deletes the connection record and cascades to all associated databases and
   * schemas, setting deleted_at and deleted_by fields.
   *
   * RLS: Filtered to current client (ClientRLSDB).
   *
   * Raises: ConnectionNotFoundError: If connection doesn't exist (404)
   */
  delete(connectionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/connections/${connectionID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
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
 * All data comes from the database (source of truth). JSON responses use 'id'
 * field; YAML responses transform to 'kater_id' via MultiFormatRoute.
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
    | Connection.PostgresMetadata
    | Connection.DatabricksMetadata
    | Connection.ClickHouseMetadata
    | Connection.MssqlMetadata;

  /**
   * Warehouse type (snowflake, postgresql, etc.)
   */
  warehouse_type: string;

  /**
   * Default timezone for the connection
   */
  database_timezone?: string | null;

  /**
   * Connection description
   */
  description?: string | null;

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

  /**
   * Sync identifier for schema sync
   */
  sync_id?: string | null;
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

  /**
   * Snowflake-specific warehouse metadata.
   */
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
     * Compute warehouse name
     */
    warehouse: string;

    /**
     * Warehouse type discriminator
     */
    warehouse_type: 'snowflake';
  }

  /**
   * PostgreSQL-specific warehouse metadata.
   */
  export interface PostgresMetadata {
    /**
     * Database host
     */
    host: string;

    /**
     * Database port
     */
    port: number;

    /**
     * Warehouse type discriminator
     */
    warehouse_type: 'postgresql';
  }

  /**
   * Databricks-specific warehouse metadata.
   */
  export interface DatabricksMetadata {
    /**
     * SQL warehouse HTTP path
     */
    http_path: string;

    /**
     * Databricks server hostname
     */
    server_hostname: string;

    /**
     * Warehouse type discriminator
     */
    warehouse_type: 'databricks';
  }

  /**
   * ClickHouse-specific warehouse metadata.
   */
  export interface ClickHouseMetadata {
    /**
     * ClickHouse host
     */
    host: string;

    /**
     * ClickHouse port
     */
    port: number;

    /**
     * Warehouse type discriminator
     */
    warehouse_type: 'clickhouse';
  }

  /**
   * Microsoft SQL Server-specific warehouse metadata.
   */
  export interface MssqlMetadata {
    /**
     * SQL Server host
     */
    host: string;

    /**
     * SQL Server port
     */
    port: number;

    /**
     * Warehouse type discriminator
     */
    warehouse_type: 'mssql';
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
    database: string;

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
      private_key_passphrase?: string | null;
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

    /**
     * Database name
     */
    database?: string | null;
  }

  /**
   * Microsoft SQL Server credential response.
   */
  export interface MssqlCredentialResponse {
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

    /**
     * Database name
     */
    database?: string | null;
  }
}

/**
 * Response for syncing views.
 *
 * Returned after successfully creating a PR with merged ViewSchema files, or
 * indicating that all views are already up to date.
 */
export interface ConnectionSyncResponse {
  /**
   * Number of views in the PR
   */
  views_updated: number;

  /**
   * Status message
   */
  message?: string | null;

  /**
   * GitHub PR number
   */
  pr_number?: number | null;

  /**
   * GitHub PR URL
   */
  pr_url?: string | null;
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
     * Name of the connection (snake_case: lowercase letters, numbers, underscores)
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
     * Default timezone for the connection (e.g., 'UTC', 'America/New_York')
     */
    database_timezone?: string | null;

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

    /**
     * Query timeout in seconds (1-3600)
     */
    query_timeout?: number | null;

    /**
     * Timezone conversion mode: 'do_not_convert' or 'convert_to_utc'
     */
    query_timezone_conversion?: string | null;
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
     * Name of the connection (snake_case: lowercase letters, numbers, underscores)
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
     * Default timezone for the connection (e.g., 'UTC', 'America/New_York')
     */
    database_timezone?: string | null;

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;

    /**
     * Query timeout in seconds (1-3600)
     */
    query_timeout?: number | null;

    /**
     * Timezone conversion mode: 'do_not_convert' or 'convert_to_utc'
     */
    query_timezone_conversion?: string | null;
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
     * Name of the connection (snake_case: lowercase letters, numbers, underscores)
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
     * Default timezone for the connection (e.g., 'UTC', 'America/New_York')
     */
    database_timezone?: string | null;

    /**
     * Description of the connection
     */
    description?: string | null;

    /**
     * Human-readable label for the connection (defaults to name if not set)
     */
    label?: string | null;

    /**
     * Query timeout in seconds (1-3600)
     */
    query_timeout?: number | null;

    /**
     * Timezone conversion mode: 'do_not_convert' or 'convert_to_utc'
     */
    query_timezone_conversion?: string | null;
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
     * Name of the connection (snake_case: lowercase letters, numbers, underscores)
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
     * Default timezone for the connection (e.g., 'UTC', 'America/New_York')
     */
    database_timezone?: string | null;

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

    /**
     * Query timeout in seconds (1-3600)
     */
    query_timeout?: number | null;

    /**
     * Timezone conversion mode: 'do_not_convert' or 'convert_to_utc'
     */
    query_timezone_conversion?: string | null;
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
     * Name of the connection (snake_case: lowercase letters, numbers, underscores)
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
     * Default timezone for the connection (e.g., 'UTC', 'America/New_York')
     */
    database_timezone?: string | null;

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

    /**
     * Query timeout in seconds (1-3600)
     */
    query_timeout?: number | null;

    /**
     * Timezone conversion mode: 'do_not_convert' or 'convert_to_utc'
     */
    query_timezone_conversion?: string | null;
  }
}

export interface ConnectionUpdateParams {
  /**
   * Connection description
   */
  description?: string | null;

  /**
   * Human-readable display label
   */
  label?: string | null;

  /**
   * Connection name (snake_case identifier)
   */
  name?: string | null;
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
    type ConnectionUpdateParams as ConnectionUpdateParams,
  };

  export {
    Databases as Databases,
    type DatabaseUpdateResponse as DatabaseUpdateResponse,
    type DatabaseUpdateSchemaResponse as DatabaseUpdateSchemaResponse,
    type DatabaseUpdateParams as DatabaseUpdateParams,
    type DatabaseDeleteSchemaParams as DatabaseDeleteSchemaParams,
    type DatabaseUpdateSchemaParams as DatabaseUpdateSchemaParams,
  };
}
