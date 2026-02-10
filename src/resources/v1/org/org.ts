// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ClientAPI from './client';
import { Client, ClientResource, TenancyType } from './client';
import * as UsersAPI from './users';
import { Users } from './users';

export class Org extends APIResource {
  client: ClientAPI.ClientResource = new ClientAPI.ClientResource(this._client);
  users: UsersAPI.Users = new UsersAPI.Users(this._client);
}

Org.ClientResource = ClientResource;
Org.Users = Users;

export declare namespace Org {
  export { ClientResource as ClientResource, type Client as Client, type TenancyType as TenancyType };

  export { Users as Users };
}
