// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as BatchAPI from './batch';
import { Batch } from './batch';
import * as ImportAPI from './import';
import { Import, ImportFromCsvParams, ImportFromWarehouseParams, ImportTenants } from './import';

export class Tenants extends APIResource {
  batch: BatchAPI.Batch = new BatchAPI.Batch(this._client);
  import: ImportAPI.Import = new ImportAPI.Import(this._client);
}

Tenants.Batch = Batch;
Tenants.Import = Import;

export declare namespace Tenants {
  export { Batch as Batch };

  export {
    Import as Import,
    type ImportTenants as ImportTenants,
    type ImportFromCsvParams as ImportFromCsvParams,
    type ImportFromWarehouseParams as ImportFromWarehouseParams,
  };
}
