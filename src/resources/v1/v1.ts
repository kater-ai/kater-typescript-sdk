// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as TenantsAPI from './tenants';
import {
  ImportTenantsResponse,
  TenantImportFromCsvParams,
  TenantImportFromWarehouseParams,
  Tenants,
} from './tenants';
import * as ConnectionsAPI from './connections/connections';
import {
  Connection,
  ConnectionListConnectionsParams,
  ConnectionListConnectionsResponse,
  Connections,
} from './connections/connections';

export class V1 extends APIResource {
  connections: ConnectionsAPI.Connections = new ConnectionsAPI.Connections(this._client);
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);
}

V1.Connections = Connections;
V1.Tenants = Tenants;

export declare namespace V1 {
  export {
    Connections as Connections,
    type Connection as Connection,
    type ConnectionListConnectionsResponse as ConnectionListConnectionsResponse,
    type ConnectionListConnectionsParams as ConnectionListConnectionsParams,
  };

  export {
    Tenants as Tenants,
    type ImportTenantsResponse as ImportTenantsResponse,
    type TenantImportFromCsvParams as TenantImportFromCsvParams,
    type TenantImportFromWarehouseParams as TenantImportFromWarehouseParams,
  };
}
