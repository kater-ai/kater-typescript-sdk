// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../../core/resource';
import * as ServersAPI from './servers';
import {
  ServerCreateParams,
  ServerCreateResponse,
  ServerDiscoverParams,
  ServerDiscoverResponse,
  ServerListResponse,
  ServerRediscoverParams,
  ServerRediscoverResponse,
  ServerUpdateParams,
  ServerUpdateResponse,
  Servers,
} from './servers';

export class Mcp extends APIResource {
  servers: ServersAPI.Servers = new ServersAPI.Servers(this._client);
}

Mcp.Servers = Servers;

export declare namespace Mcp {
  export {
    Servers as Servers,
    type ServerCreateResponse as ServerCreateResponse,
    type ServerUpdateResponse as ServerUpdateResponse,
    type ServerListResponse as ServerListResponse,
    type ServerDiscoverResponse as ServerDiscoverResponse,
    type ServerRediscoverResponse as ServerRediscoverResponse,
    type ServerCreateParams as ServerCreateParams,
    type ServerUpdateParams as ServerUpdateParams,
    type ServerDiscoverParams as ServerDiscoverParams,
    type ServerRediscoverParams as ServerRediscoverParams,
  };
}
