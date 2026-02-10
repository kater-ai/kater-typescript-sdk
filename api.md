# V1

## Connections

Types:

- <code><a href="./src/resources/v1/connections/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">DatabaseConfig</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">SyncEventResponse</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionListResponse</a></code>

Methods:

- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">list</a>({ ...params }) -> ConnectionListResponse</code>

### Databases

### Views

### Yaml

## GitHub

### Repos

Types:

- <code><a href="./src/resources/v1/github/repos.ts">Repository</a></code>

### Scaffold

Types:

- <code><a href="./src/resources/v1/github/scaffold.ts">ScaffoldTrigger</a></code>

### Webhooks

## Groups

Types:

- <code><a href="./src/resources/v1/groups/groups.ts">GroupDetail</a></code>

### Tenants

## Me

Types:

- <code><a href="./src/resources/v1/me.ts">ClientUser</a></code>
- <code><a href="./src/resources/v1/me.ts">ClientUserRole</a></code>

## Org

### Client

Types:

- <code><a href="./src/resources/v1/org/client.ts">Client</a></code>
- <code><a href="./src/resources/v1/org/client.ts">TenancyType</a></code>

### Users

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

# Healthz

# Readyz
