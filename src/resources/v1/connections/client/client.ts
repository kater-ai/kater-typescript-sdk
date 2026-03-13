// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as McpAPI from './mcp/mcp';
import { Mcp } from './mcp/mcp';

export class Client extends APIResource {
  mcp: McpAPI.Mcp = new McpAPI.Mcp(this._client);
}

Client.Mcp = Mcp;

export declare namespace Client {
  export { Mcp as Mcp };
}
