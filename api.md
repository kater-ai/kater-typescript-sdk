# V1

## Compiler

Types:

- <code><a href="./src/resources/v1/compiler.ts">ChartConfig</a></code>
- <code><a href="./src/resources/v1/compiler.ts">CompilerErrorItem</a></code>
- <code><a href="./src/resources/v1/compiler.ts">InlineField</a></code>
- <code><a href="./src/resources/v1/compiler.ts">Manifest</a></code>
- <code><a href="./src/resources/v1/compiler.ts">ManifestEntry</a></code>
- <code><a href="./src/resources/v1/compiler.ts">RefWithLabel</a></code>
- <code><a href="./src/resources/v1/compiler.ts">SubqueryCondition</a></code>
- <code><a href="./src/resources/v1/compiler.ts">CompilerCompileResponse</a></code>
- <code><a href="./src/resources/v1/compiler.ts">CompilerEnumerateResponse</a></code>
- <code><a href="./src/resources/v1/compiler.ts">CompilerResolveResponse</a></code>
- <code><a href="./src/resources/v1/compiler.ts">CompilerValidateResponse</a></code>

Methods:

- <code title="post /api/v1/compiler/compile">client.v1.compiler.<a href="./src/resources/v1/compiler.ts">compile</a>({ ...params }) -> CompilerCompileResponse</code>
- <code title="post /api/v1/compiler/enumerate">client.v1.compiler.<a href="./src/resources/v1/compiler.ts">enumerate</a>({ ...params }) -> CompilerEnumerateResponse</code>
- <code title="post /api/v1/compiler/resolve">client.v1.compiler.<a href="./src/resources/v1/compiler.ts">resolve</a>({ ...params }) -> CompilerResolveResponse</code>
- <code title="post /api/v1/compiler/validate">client.v1.compiler.<a href="./src/resources/v1/compiler.ts">validate</a>({ ...params }) -> CompilerValidateResponse</code>

## Connections

Types:

- <code><a href="./src/resources/v1/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections.ts">ConnectionListConnectionsResponse</a></code>

Methods:

- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections.ts">listConnections</a>({ ...params }) -> ConnectionListConnectionsResponse</code>

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
