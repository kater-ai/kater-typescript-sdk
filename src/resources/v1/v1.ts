// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MeAPI from './me';
import { ClientUser, ClientUserRole, Me } from './me';
import * as ConnectionsAPI from './connections/connections';
import {
  Connection,
  ConnectionListParams,
  ConnectionListResponse,
  Connections,
  DatabaseConfig,
  SyncEventResponse,
} from './connections/connections';
import * as GitHubAPI from './github/github';
import { GitHub } from './github/github';
import * as GroupsAPI from './groups/groups';
import { GroupDetail, Groups } from './groups/groups';
import * as OrgAPI from './org/org';
import { Org } from './org/org';
import * as TenantsAPI from './tenants/tenants';
import { CreateTenant, Tenant, Tenants } from './tenants/tenants';

export class V1 extends APIResource {
  connections: ConnectionsAPI.Connections = new ConnectionsAPI.Connections(this._client);
  github: GitHubAPI.GitHub = new GitHubAPI.GitHub(this._client);
  groups: GroupsAPI.Groups = new GroupsAPI.Groups(this._client);
  me: MeAPI.Me = new MeAPI.Me(this._client);
  org: OrgAPI.Org = new OrgAPI.Org(this._client);
  tenants: TenantsAPI.Tenants = new TenantsAPI.Tenants(this._client);
}

V1.Connections = Connections;
V1.GitHub = GitHub;
V1.Groups = Groups;
V1.Me = Me;
V1.Org = Org;
V1.Tenants = Tenants;

export declare namespace V1 {
  export {
    Connections as Connections,
    type Connection as Connection,
    type DatabaseConfig as DatabaseConfig,
    type SyncEventResponse as SyncEventResponse,
    type ConnectionListResponse as ConnectionListResponse,
    type ConnectionListParams as ConnectionListParams,
  };

  export { GitHub as GitHub };

  export { Groups as Groups, type GroupDetail as GroupDetail };

  export { Me as Me, type ClientUser as ClientUser, type ClientUserRole as ClientUserRole };

  export { Org as Org };

  export { Tenants as Tenants, type CreateTenant as CreateTenant, type Tenant as Tenant };
}
