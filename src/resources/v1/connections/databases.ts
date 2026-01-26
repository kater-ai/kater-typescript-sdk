// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Databases extends APIResource {
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
}

export interface DatabaseDeleteSchemaParams {
  connection_id: string;

  database_id: string;
}

export declare namespace Databases {
  export { type DatabaseDeleteSchemaParams as DatabaseDeleteSchemaParams };
}
