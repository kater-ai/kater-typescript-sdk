// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ConnectionsAPI from './connections';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Databases extends APIResource {
  /**
   * Update a database's metadata.
   *
   * Updates label and/or description fields directly. If a name change is requested,
   * a GitHub PR is created to update view YAML files. The name change is applied to
   * the DB when the PR merges (or immediately if auto_merge is true or no views are
   * affected).
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: DatabaseNotFoundError: If database doesn't exist (404)
   */
  update(
    databaseID: string,
    params: DatabaseUpdateParams,
    options?: RequestOptions,
  ): APIPromise<DatabaseUpdateResponse> {
    const { connection_id, ...body } = params;
    return this._client.patch(path`/api/v1/connections/${connection_id}/databases/${databaseID}`, {
      body,
      ...options,
    });
  }

  /**
   * Delete a schema from a connection.
   *
   * Soft-deletes the schema record, setting deleted_at and deleted_by fields. The
   * connection_id and database_id path parameters provide context for the resource
   * hierarchy, though the schema_id alone uniquely identifies the record.
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: SchemaNotFoundError: If schema doesn't exist (404)
   */
  deleteSchema(
    schemaID: string,
    params: DatabaseDeleteSchemaParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const { connection_id, database_id } = params;
    return this._client.delete(
      path`/api/v1/connections/${connection_id}/databases/${database_id}/schemas/${schemaID}`,
      { ...options, headers: buildHeaders([{ Accept: '*/*' }, options?.headers]) },
    );
  }

  /**
   * Update a schema's metadata.
   *
   * Updates label and/or description fields directly. If a name change is requested,
   * a GitHub PR is created to update view YAML files. The name change is applied to
   * the DB when the PR merges (or immediately if auto_merge is true or no views are
   * affected).
   *
   * RLS: Filtered to current client (DualClientRLSDB).
   *
   * Raises: SchemaNotFoundError: If schema doesn't exist (404)
   */
  updateSchema(
    schemaID: string,
    params: DatabaseUpdateSchemaParams,
    options?: RequestOptions,
  ): APIPromise<DatabaseUpdateSchemaResponse> {
    const { connection_id, database_id, ...body } = params;
    return this._client.patch(
      path`/api/v1/connections/${connection_id}/databases/${database_id}/schemas/${schemaID}`,
      { body, ...options },
    );
  }
}

/**
 * Response for database/schema updates that may involve a rename PR.
 */
export interface DatabaseUpdateResponse {
  /**
   * Updated connection
   */
  connection: ConnectionsAPI.Connection;

  /**
   * GitHub PR number
   */
  pr_number?: number | null;

  /**
   * PR status: 'open' or 'merged'
   */
  pr_status?: string | null;

  /**
   * GitHub PR URL (if rename PR created)
   */
  pr_url?: string | null;
}

/**
 * Response for database/schema updates that may involve a rename PR.
 */
export interface DatabaseUpdateSchemaResponse {
  /**
   * Updated connection
   */
  connection: ConnectionsAPI.Connection;

  /**
   * GitHub PR number
   */
  pr_number?: number | null;

  /**
   * PR status: 'open' or 'merged'
   */
  pr_status?: string | null;

  /**
   * GitHub PR URL (if rename PR created)
   */
  pr_url?: string | null;
}

export interface DatabaseUpdateParams {
  /**
   * Path param
   */
  connection_id: string;

  /**
   * Body param: If true and a name change requires a PR, auto-merge it
   */
  auto_merge?: boolean;

  /**
   * Body param: Database description
   */
  description?: string | null;

  /**
   * Body param: Human-readable display label
   */
  label?: string | null;

  /**
   * Body param: Database name
   */
  name?: string | null;
}

export interface DatabaseDeleteSchemaParams {
  connection_id: string;

  database_id: string;
}

export interface DatabaseUpdateSchemaParams {
  /**
   * Path param
   */
  connection_id: string;

  /**
   * Path param
   */
  database_id: string;

  /**
   * Body param: If true and a name change requires a PR, auto-merge it
   */
  auto_merge?: boolean;

  /**
   * Body param: Schema description
   */
  description?: string | null;

  /**
   * Body param: Human-readable display label
   */
  label?: string | null;

  /**
   * Body param: Schema name
   */
  name?: string | null;
}

export declare namespace Databases {
  export {
    type DatabaseUpdateResponse as DatabaseUpdateResponse,
    type DatabaseUpdateSchemaResponse as DatabaseUpdateSchemaResponse,
    type DatabaseUpdateParams as DatabaseUpdateParams,
    type DatabaseDeleteSchemaParams as DatabaseDeleteSchemaParams,
    type DatabaseUpdateSchemaParams as DatabaseUpdateSchemaParams,
  };
}
