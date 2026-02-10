// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ConnectionsAPI from './connections';
import { Connection, ConnectionListParams, ConnectionListResponse, Connections } from './connections';
import * as TenantsAPI from './tenants/tenants';
import { Tenants } from './tenants/tenants';

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
    type ConnectionListResponse as ConnectionListResponse,
    type ConnectionListParams as ConnectionListParams,
  };

  export { Tenants as Tenants };
}
