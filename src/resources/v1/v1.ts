// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompilerAPI from './compiler';
import {
  ChartConfig,
  Compiler,
  CompilerCompileParams,
  CompilerCompileResponse,
  CompilerErrorItem,
  CompilerResolveParams,
  CompilerResolveResponse,
  CompilerValidateParams,
  CompilerValidateResponse,
  InlineField,
  Manifest,
  ManifestEntry,
  RefWithLabel,
  SubqueryCondition,
} from './compiler';
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
  compiler: CompilerAPI.Compiler = new CompilerAPI.Compiler(this._client);
  connections: ConnectionsAPI.Connections = new ConnectionsAPI.Connections(this._client);
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);
}

V1.Compiler = Compiler;
V1.Connections = Connections;
V1.Tenants = Tenants;

export declare namespace V1 {
  export {
    Compiler as Compiler,
    type ChartConfig as ChartConfig,
    type CompilerErrorItem as CompilerErrorItem,
    type InlineField as InlineField,
    type Manifest as Manifest,
    type ManifestEntry as ManifestEntry,
    type RefWithLabel as RefWithLabel,
    type SubqueryCondition as SubqueryCondition,
    type CompilerCompileResponse as CompilerCompileResponse,
    type CompilerResolveResponse as CompilerResolveResponse,
    type CompilerValidateResponse as CompilerValidateResponse,
    type CompilerCompileParams as CompilerCompileParams,
    type CompilerResolveParams as CompilerResolveParams,
    type CompilerValidateParams as CompilerValidateParams,
  };

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
