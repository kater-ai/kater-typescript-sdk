# V1

## Connections

Types:

- <code><a href="./src/resources/v1/connections/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionListConnectionsResponse</a></code>

Methods:

- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">listConnections</a>({ ...params }) -> ConnectionListConnectionsResponse</code>

### Compiler

Types:

- <code><a href="./src/resources/v1/connections/compiler.ts">ChartConfig</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">CompilerErrorItem</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">InlineField</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">Manifest</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">ManifestEntry</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">RefWithLabel</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">SubqueryCondition</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">CompilerCompileResponse</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">CompilerResolveResponse</a></code>
- <code><a href="./src/resources/v1/connections/compiler.ts">CompilerValidateResponse</a></code>

Methods:

- <code title="post /api/v1/compiler/compile">client.v1.connections.compiler.<a href="./src/resources/v1/connections/compiler.ts">compile</a>({ ...params }) -> CompilerCompileResponse</code>
- <code title="post /api/v1/compiler/resolve">client.v1.connections.compiler.<a href="./src/resources/v1/connections/compiler.ts">resolve</a>({ ...params }) -> CompilerResolveResponse</code>
- <code title="post /api/v1/compiler/validate">client.v1.connections.compiler.<a href="./src/resources/v1/connections/compiler.ts">validate</a>({ ...params }) -> CompilerValidateResponse</code>

## Tenants

Types:

- <code><a href="./src/resources/v1/tenants.ts">ImportTenantsResponse</a></code>

Methods:

- <code title="post /api/v1/tenants/import/csv">client.v1.tenants.<a href="./src/resources/v1/tenants.ts">importFromCsv</a>({ ...params }) -> ImportTenantsResponse</code>
- <code title="post /api/v1/tenants/import/warehouse">client.v1.tenants.<a href="./src/resources/v1/tenants.ts">importFromWarehouse</a>({ ...params }) -> ImportTenantsResponse</code>
