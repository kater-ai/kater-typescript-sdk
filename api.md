# V1

## Connections

Types:

- <code><a href="./src/resources/v1/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections.ts">DatabaseConfig</a></code>
- <code><a href="./src/resources/v1/connections.ts">SyncEventResponse</a></code>
- <code><a href="./src/resources/v1/connections.ts">ConnectionListResponse</a></code>

Methods:

- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections.ts">list</a>({ ...params }) -> ConnectionListResponse</code>

## Tenants

Types:

- <code><a href="./src/resources/v1/tenants/tenants.ts">CreateTenant</a></code>
- <code><a href="./src/resources/v1/tenants/tenants.ts">Tenant</a></code>

### Batch

Types:

- <code><a href="./src/resources/v1/tenants/batch.ts">BatchTenantError</a></code>
- <code><a href="./src/resources/v1/tenants/batch.ts">BatchTenantSuccess</a></code>

### Import

Types:

- <code><a href="./src/resources/v1/tenants/import.ts">ImportTenants</a></code>

Methods:

- <code title="post /api/v1/tenants/import/csv">client.v1.tenants.import.<a href="./src/resources/v1/tenants/import.ts">fromCsv</a>({ ...params }) -> ImportTenants</code>
- <code title="post /api/v1/tenants/import/warehouse">client.v1.tenants.import.<a href="./src/resources/v1/tenants/import.ts">fromWarehouse</a>({ ...params }) -> ImportTenants</code>

### Groups
