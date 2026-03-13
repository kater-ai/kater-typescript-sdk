// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as McpAPI from './mcp/mcp';
import {
  Mcp,
  McpGetAuditHistoryParams,
  McpGetAuditHistoryResponse,
  McpListParams,
  McpListResponse,
} from './mcp/mcp';

export class Tenant extends APIResource {
  mcp: McpAPI.Mcp = new McpAPI.Mcp(this._client);
}

Tenant.Mcp = Mcp;

export declare namespace Tenant {
  export {
    Mcp as Mcp,
    type McpListResponse as McpListResponse,
    type McpGetAuditHistoryResponse as McpGetAuditHistoryResponse,
    type McpListParams as McpListParams,
    type McpGetAuditHistoryParams as McpGetAuditHistoryParams,
  };
}
