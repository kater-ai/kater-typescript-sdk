// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as APIKeysAPI from './api-keys';
import { APIKey, APIKeyCreateParams, APIKeyCreateResponse, APIKeyListResponse, APIKeys } from './api-keys';
import * as MeAPI from './me';
import { ClientUser, ClientUserRole, Me, MeGetConnectionsResponse } from './me';
import * as ConnectionsAPI from './connections/connections';
import {
  Connection,
  ConnectionCreateParams,
  ConnectionListResponse,
  ConnectionRetrieveCredentialResponse,
  ConnectionSyncResponse,
  Connections,
  DatabaseConfig,
} from './connections/connections';
import * as GitHubAPI from './github/github';
import {
  GitHub,
  GitHubCheckInstallationsResponse,
  GitHubDisconnectResponse,
  GitHubGetStatusResponse,
  GitHubSyncResponse,
} from './github/github';
import * as GroupsAPI from './groups/groups';
import {
  GroupCreateParams,
  GroupDetail,
  GroupListResponse,
  GroupUpdateParams,
  Groups,
} from './groups/groups';
import * as OrgAPI from './org/org';
import { Org } from './org/org';
import * as TenantsAPI from './tenants/tenants';
import {
  CreateTenant,
  Tenant,
  TenantCreateParams,
  TenantListResponse,
  TenantUpdateParams,
  Tenants,
} from './tenants/tenants';

export class V1 extends APIResource {
  apiKeys: APIKeysAPI.APIKeys = new APIKeysAPI.APIKeys(this._client);
  connections: ConnectionsAPI.Connections = new ConnectionsAPI.Connections(this._client);
  github: GitHubAPI.GitHub = new GitHubAPI.GitHub(this._client);
  groups: GroupsAPI.Groups = new GroupsAPI.Groups(this._client);
  me: MeAPI.Me = new MeAPI.Me(this._client);
  org: OrgAPI.Org = new OrgAPI.Org(this._client);
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);
}

V1.APIKeys = APIKeys;
V1.Connections = Connections;
V1.GitHub = GitHub;
V1.Groups = Groups;
V1.Me = Me;
V1.Org = Org;
V1.Tenants = Tenants;

export declare namespace V1 {
  export {
    APIKeys as APIKeys,
    type APIKey as APIKey,
    type APIKeyCreateResponse as APIKeyCreateResponse,
    type APIKeyListResponse as APIKeyListResponse,
    type APIKeyCreateParams as APIKeyCreateParams,
  };

  export {
    Connections as Connections,
    type Connection as Connection,
    type DatabaseConfig as DatabaseConfig,
    type ConnectionListResponse as ConnectionListResponse,
    type ConnectionRetrieveCredentialResponse as ConnectionRetrieveCredentialResponse,
    type ConnectionSyncResponse as ConnectionSyncResponse,
    type ConnectionCreateParams as ConnectionCreateParams,
  };

  export {
    GitHub as GitHub,
    type GitHubCheckInstallationsResponse as GitHubCheckInstallationsResponse,
    type GitHubDisconnectResponse as GitHubDisconnectResponse,
    type GitHubGetStatusResponse as GitHubGetStatusResponse,
    type GitHubSyncResponse as GitHubSyncResponse,
  };

  export {
    Groups as Groups,
    type GroupDetail as GroupDetail,
    type GroupListResponse as GroupListResponse,
    type GroupCreateParams as GroupCreateParams,
    type GroupUpdateParams as GroupUpdateParams,
  };

  export {
    Me as Me,
    type ClientUser as ClientUser,
    type ClientUserRole as ClientUserRole,
    type MeGetConnectionsResponse as MeGetConnectionsResponse,
  };

  export { Org as Org };

  export {
    Tenants as Tenants,
    type CreateTenant as CreateTenant,
    type Tenant as Tenant,
    type TenantListResponse as TenantListResponse,
    type TenantCreateParams as TenantCreateParams,
    type TenantUpdateParams as TenantUpdateParams,
  };
}
