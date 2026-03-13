# V1

## Compiler

Types:

- <code><a href="./src/resources/v1/compiler/compiler.ts">ChartConfig</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerErrorItem</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">InlineField</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">Manifest</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">ManifestEntry</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">RefWithLabel</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">SubqueryCondition</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerCompileResponse</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerCompileDashboardResponse</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerEnumerateResponse</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerExecuteResponse</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerResolveResponse</a></code>
- <code><a href="./src/resources/v1/compiler/compiler.ts">CompilerValidateResponse</a></code>

Methods:

- <code title="post /api/v1/compiler/compile">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">compile</a>({ ...params }) -> CompilerCompileResponse</code>
- <code title="post /api/v1/compiler/dashboard">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">compileDashboard</a>({ ...params }) -> CompilerCompileDashboardResponse</code>
- <code title="post /api/v1/compiler/enumerate">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">enumerate</a>({ ...params }) -> CompilerEnumerateResponse</code>
- <code title="post /api/v1/compiler/execute">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">execute</a>({ ...params }) -> CompilerExecuteResponse</code>
- <code title="post /api/v1/compiler/resolve">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">resolve</a>({ ...params }) -> CompilerResolveResponse</code>
- <code title="post /api/v1/compiler/validate">client.v1.compiler.<a href="./src/resources/v1/compiler/compiler.ts">validate</a>({ ...params }) -> CompilerValidateResponse</code>

### Cache

### Combination

Types:

- <code><a href="./src/resources/v1/compiler/combination.ts">CombinationPreviewResponse</a></code>

Methods:

- <code title="post /api/v1/compiler/combination/preview">client.v1.compiler.combination.<a href="./src/resources/v1/compiler/combination.ts">preview</a>({ ...params }) -> CombinationPreviewResponse</code>

### Manifest

Types:

- <code><a href="./src/resources/v1/compiler/manifest.ts">ManifestRegenerateAndCreatePrResponse</a></code>

Methods:

- <code title="post /api/v1/compiler/manifest/recovery-pr">client.v1.compiler.manifest.<a href="./src/resources/v1/compiler/manifest.ts">regenerateAndCreatePr</a>({ ...params }) -> ManifestRegenerateAndCreatePrResponse</code>

## Connections

Types:

- <code><a href="./src/resources/v1/connections/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionListConnectionsResponse</a></code>

Methods:

- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">listConnections</a>({ ...params }) -> ConnectionListConnectionsResponse</code>

### Client

#### Mcp

##### Servers

Types:

- <code><a href="./src/resources/v1/connections/client/mcp/servers.ts">ServerCreateResponse</a></code>
- <code><a href="./src/resources/v1/connections/client/mcp/servers.ts">ServerUpdateResponse</a></code>
- <code><a href="./src/resources/v1/connections/client/mcp/servers.ts">ServerListResponse</a></code>
- <code><a href="./src/resources/v1/connections/client/mcp/servers.ts">ServerDiscoverResponse</a></code>
- <code><a href="./src/resources/v1/connections/client/mcp/servers.ts">ServerRediscoverResponse</a></code>

Methods:

- <code title="post /api/v1/client/mcp/servers">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">create</a>({ ...params }) -> ServerCreateResponse</code>
- <code title="put /api/v1/client/mcp/servers/{mcp_id}">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">update</a>(mcpID, { ...params }) -> ServerUpdateResponse</code>
- <code title="get /api/v1/client/mcp/servers">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">list</a>() -> ServerListResponse</code>
- <code title="delete /api/v1/client/mcp/servers/{mcp_id}">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">delete</a>(mcpID) -> void</code>
- <code title="post /api/v1/client/mcp/servers/{mcp_id}/discover">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">discover</a>(mcpID, { ...params }) -> ServerDiscoverResponse</code>
- <code title="post /api/v1/client/mcp/servers/{mcp_id}/rediscover">client.v1.connections.client.mcp.servers.<a href="./src/resources/v1/connections/client/mcp/servers.ts">rediscover</a>(mcpID, { ...params }) -> ServerRediscoverResponse</code>

### OAuth

Types:

- <code><a href="./src/resources/v1/connections/oauth.ts">OAuthHandleCallbackResponse</a></code>

Methods:

- <code title="get /api/v1/oauth/callback">client.v1.connections.oauth.<a href="./src/resources/v1/connections/oauth.ts">handleCallback</a>({ ...params }) -> OAuthHandleCallbackResponse</code>

### Tenant

#### Mcp

Types:

- <code><a href="./src/resources/v1/connections/tenant/mcp/mcp.ts">McpListResponse</a></code>
- <code><a href="./src/resources/v1/connections/tenant/mcp/mcp.ts">McpGetAuditHistoryResponse</a></code>

Methods:

- <code title="get /api/v1/tenant/mcp">client.v1.connections.tenant.mcp.<a href="./src/resources/v1/connections/tenant/mcp/mcp.ts">list</a>({ ...params }) -> McpListResponse</code>
- <code title="get /api/v1/tenant/mcp/{mcp_id}/audit">client.v1.connections.tenant.mcp.<a href="./src/resources/v1/connections/tenant/mcp/mcp.ts">getAuditHistory</a>(mcpID, { ...params }) -> McpGetAuditHistoryResponse</code>

##### Credentials

Types:

- <code><a href="./src/resources/v1/connections/tenant/mcp/credentials.ts">CredentialCreateResponse</a></code>

Methods:

- <code title="post /api/v1/tenant/mcp/{mcp_id}/credentials">client.v1.connections.tenant.mcp.credentials.<a href="./src/resources/v1/connections/tenant/mcp/credentials.ts">create</a>(mcpID, { ...params }) -> CredentialCreateResponse</code>
- <code title="delete /api/v1/tenant/mcp/{mcp_id}/credentials">client.v1.connections.tenant.mcp.credentials.<a href="./src/resources/v1/connections/tenant/mcp/credentials.ts">revoke</a>(mcpID, { ...params }) -> void</code>

##### OAuth

Types:

- <code><a href="./src/resources/v1/connections/tenant/mcp/oauth.ts">OAuthInitiateResponse</a></code>

Methods:

- <code title="get /api/v1/tenant/mcp/{mcp_id}/oauth/authorize">client.v1.connections.tenant.mcp.oauth.<a href="./src/resources/v1/connections/tenant/mcp/oauth.ts">initiate</a>(mcpID, { ...params }) -> OAuthInitiateResponse</code>

## Tenants

Types:

- <code><a href="./src/resources/v1/tenants/tenants.ts">ImportTenantsResponse</a></code>
- <code><a href="./src/resources/v1/tenants/tenants.ts">TenantGetTenantsSchemaResponse</a></code>

Methods:

- <code title="get /api/v1/tenants/schema">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">getTenantsSchema</a>() -> TenantGetTenantsSchemaResponse</code>
- <code title="post /api/v1/tenants/import/csv">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">importFromCsv</a>({ ...params }) -> ImportTenantsResponse</code>
- <code title="post /api/v1/tenants/import/warehouse">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">importFromWarehouse</a>({ ...params }) -> ImportTenantsResponse</code>

### Groups

Types:

- <code><a href="./src/resources/v1/tenants/groups.ts">GroupGetTenantGroupsSchemaResponse</a></code>

Methods:

- <code title="get /api/v1/tenants/groups/schema">client.v1.tenants.groups.<a href="./src/resources/v1/tenants/groups.ts">getTenantGroupsSchema</a>() -> GroupGetTenantGroupsSchemaResponse</code>
