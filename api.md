# V1

## APIKeys

Types:

- <code><a href="./src/resources/v1/api-keys.ts">APIKey</a></code>
- <code><a href="./src/resources/v1/api-keys.ts">APIKeyCreateResponse</a></code>
- <code><a href="./src/resources/v1/api-keys.ts">APIKeyListResponse</a></code>

Methods:

- <code title="post /api/v1/api-keys">client.v1.apiKeys.<a href="./src/resources/v1/api-keys.ts">create</a>({ ...params }) -> APIKeyCreateResponse</code>
- <code title="get /api/v1/api-keys/{api_key_id}">client.v1.apiKeys.<a href="./src/resources/v1/api-keys.ts">retrieve</a>(apiKeyID) -> APIKey</code>
- <code title="get /api/v1/api-keys">client.v1.apiKeys.<a href="./src/resources/v1/api-keys.ts">list</a>() -> APIKeyListResponse</code>
- <code title="delete /api/v1/api-keys/{api_key_id}">client.v1.apiKeys.<a href="./src/resources/v1/api-keys.ts">revoke</a>(apiKeyID) -> void</code>

## Connections

Types:

- <code><a href="./src/resources/v1/connections/connections.ts">Connection</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">DatabaseConfig</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionListResponse</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionRetrieveCredentialResponse</a></code>
- <code><a href="./src/resources/v1/connections/connections.ts">ConnectionSyncResponse</a></code>

Methods:

- <code title="post /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">create</a>({ ...params }) -> Connection</code>
- <code title="get /api/v1/connections/{connection_id}">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">retrieve</a>(connectionID) -> Connection</code>
- <code title="get /api/v1/connections">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">list</a>() -> ConnectionListResponse</code>
- <code title="get /api/v1/connections/{connection_id}/credential">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">retrieveCredential</a>(connectionID) -> ConnectionRetrieveCredentialResponse</code>
- <code title="post /api/v1/connections/{connection_id}/sync">client.v1.connections.<a href="./src/resources/v1/connections/connections.ts">sync</a>(connectionID) -> ConnectionSyncResponse</code>

### Databases

Methods:

- <code title="delete /api/v1/connections/{connection_id}/databases/{database_id}/schemas/{schema_id}">client.v1.connections.databases.<a href="./src/resources/v1/connections/databases.ts">deleteSchema</a>(schemaID, { ...params }) -> void</code>

## GitHub

Types:

- <code><a href="./src/resources/v1/github/github.ts">GitHubCheckInstallationsResponse</a></code>
- <code><a href="./src/resources/v1/github/github.ts">GitHubDisconnectResponse</a></code>
- <code><a href="./src/resources/v1/github/github.ts">GitHubGetStatusResponse</a></code>
- <code><a href="./src/resources/v1/github/github.ts">GitHubSyncResponse</a></code>

Methods:

- <code title="get /api/v1/github/check-installations">client.v1.github.<a href="./src/resources/v1/github/github.ts">checkInstallations</a>() -> GitHubCheckInstallationsResponse</code>
- <code title="post /api/v1/github/disconnect">client.v1.github.<a href="./src/resources/v1/github/github.ts">disconnect</a>() -> GitHubDisconnectResponse</code>
- <code title="get /api/v1/github/status">client.v1.github.<a href="./src/resources/v1/github/github.ts">getStatus</a>() -> GitHubGetStatusResponse</code>
- <code title="post /api/v1/github/sync">client.v1.github.<a href="./src/resources/v1/github/github.ts">sync</a>() -> GitHubSyncResponse</code>

### Repos

Types:

- <code><a href="./src/resources/v1/github/repos.ts">Repository</a></code>
- <code><a href="./src/resources/v1/github/repos.ts">RepoListResponse</a></code>
- <code><a href="./src/resources/v1/github/repos.ts">RepoSelectResponse</a></code>

Methods:

- <code title="get /api/v1/github/repos">client.v1.github.repos.<a href="./src/resources/v1/github/repos.ts">list</a>() -> RepoListResponse</code>
- <code title="post /api/v1/github/repos/{repo_id}/select">client.v1.github.repos.<a href="./src/resources/v1/github/repos.ts">select</a>(repoID, { ...params }) -> RepoSelectResponse</code>

### Scaffold

Types:

- <code><a href="./src/resources/v1/github/scaffold.ts">ScaffoldTrigger</a></code>
- <code><a href="./src/resources/v1/github/scaffold.ts">ScaffoldGetStatusResponse</a></code>

Methods:

- <code title="get /api/v1/github/scaffold/status">client.v1.github.scaffold.<a href="./src/resources/v1/github/scaffold.ts">getStatus</a>() -> ScaffoldGetStatusResponse</code>
- <code title="post /api/v1/github/scaffold/retry">client.v1.github.scaffold.<a href="./src/resources/v1/github/scaffold.ts">retry</a>() -> ScaffoldTrigger</code>
- <code title="post /api/v1/github/scaffold">client.v1.github.scaffold.<a href="./src/resources/v1/github/scaffold.ts">trigger</a>() -> ScaffoldTrigger</code>

### Webhooks

Types:

- <code><a href="./src/resources/v1/github/webhooks.ts">WebhookPingResponse</a></code>

Methods:

- <code title="get /api/v1/github/webhooks/ping">client.v1.github.webhooks.<a href="./src/resources/v1/github/webhooks.ts">ping</a>() -> WebhookPingResponse</code>

### Admin

Types:

- <code><a href="./src/resources/v1/github/admin.ts">AdminGetIntegrationStatusResponse</a></code>

Methods:

- <code title="get /api/v1/github/admin/status/{client_id}">client.v1.github.admin.<a href="./src/resources/v1/github/admin.ts">getIntegrationStatus</a>(clientID) -> AdminGetIntegrationStatusResponse</code>

## Groups

Types:

- <code><a href="./src/resources/v1/groups/groups.ts">GroupDetail</a></code>
- <code><a href="./src/resources/v1/groups/groups.ts">GroupListResponse</a></code>

Methods:

- <code title="post /api/v1/groups">client.v1.groups.<a href="./src/resources/v1/groups/groups.ts">create</a>({ ...params }) -> GroupDetail</code>
- <code title="get /api/v1/groups/{group_id}">client.v1.groups.<a href="./src/resources/v1/groups/groups.ts">retrieve</a>(groupID) -> GroupDetail</code>
- <code title="patch /api/v1/groups/{group_id}">client.v1.groups.<a href="./src/resources/v1/groups/groups.ts">update</a>(groupID, { ...params }) -> GroupDetail</code>
- <code title="get /api/v1/groups">client.v1.groups.<a href="./src/resources/v1/groups/groups.ts">list</a>() -> GroupListResponse</code>
- <code title="delete /api/v1/groups/{group_id}">client.v1.groups.<a href="./src/resources/v1/groups/groups.ts">delete</a>(groupID) -> void</code>

### Tenants

Types:

- <code><a href="./src/resources/v1/groups/tenants.ts">TenantAddResponse</a></code>

Methods:

- <code title="post /api/v1/groups/{group_id}/tenants">client.v1.groups.tenants.<a href="./src/resources/v1/groups/tenants.ts">add</a>(groupID, { ...params }) -> TenantAddResponse</code>
- <code title="delete /api/v1/groups/{group_id}/tenants/{tenant_id}">client.v1.groups.tenants.<a href="./src/resources/v1/groups/tenants.ts">remove</a>(tenantID, { ...params }) -> void</code>

## Me

Types:

- <code><a href="./src/resources/v1/me.ts">ClientUser</a></code>
- <code><a href="./src/resources/v1/me.ts">ClientUserRole</a></code>
- <code><a href="./src/resources/v1/me.ts">MeGetConnectionsResponse</a></code>

Methods:

- <code title="get /api/v1/me">client.v1.me.<a href="./src/resources/v1/me.ts">retrieve</a>() -> ClientUser</code>
- <code title="get /api/v1/me/connection">client.v1.me.<a href="./src/resources/v1/me.ts">getConnections</a>() -> MeGetConnectionsResponse</code>

## Org

### Client

Types:

- <code><a href="./src/resources/v1/org/client.ts">Client</a></code>
- <code><a href="./src/resources/v1/org/client.ts">TenancyType</a></code>

Methods:

- <code title="get /api/v1/org/client">client.v1.org.client.<a href="./src/resources/v1/org/client.ts">retrieve</a>() -> Client</code>
- <code title="patch /api/v1/org/client">client.v1.org.client.<a href="./src/resources/v1/org/client.ts">update</a>({ ...params }) -> Client</code>

### Users

Types:

- <code><a href="./src/resources/v1/org/users.ts">UserListResponse</a></code>
- <code><a href="./src/resources/v1/org/users.ts">UserDeleteResponse</a></code>

Methods:

- <code title="post /api/v1/org/users">client.v1.org.users.<a href="./src/resources/v1/org/users.ts">create</a>({ ...params }) -> ClientUser</code>
- <code title="get /api/v1/org/users/{user_id}">client.v1.org.users.<a href="./src/resources/v1/org/users.ts">retrieve</a>(userID) -> ClientUser</code>
- <code title="patch /api/v1/org/users/{user_id}">client.v1.org.users.<a href="./src/resources/v1/org/users.ts">update</a>(userID, { ...params }) -> ClientUser</code>
- <code title="get /api/v1/org/users">client.v1.org.users.<a href="./src/resources/v1/org/users.ts">list</a>() -> UserListResponse</code>
- <code title="delete /api/v1/org/users/{user_id}">client.v1.org.users.<a href="./src/resources/v1/org/users.ts">delete</a>(userID) -> UserDeleteResponse</code>

## Tenants

Types:

- <code><a href="./src/resources/v1/tenants/tenants.ts">CreateTenant</a></code>
- <code><a href="./src/resources/v1/tenants/tenants.ts">Tenant</a></code>
- <code><a href="./src/resources/v1/tenants/tenants.ts">TenantListResponse</a></code>

Methods:

- <code title="post /api/v1/tenants">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">create</a>({ ...params }) -> Tenant</code>
- <code title="get /api/v1/tenants/{tenant_id}">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">retrieve</a>(tenantID) -> Tenant</code>
- <code title="patch /api/v1/tenants/{tenant_id}">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">update</a>(tenantID, { ...params }) -> Tenant</code>
- <code title="get /api/v1/tenants">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">list</a>() -> TenantListResponse</code>
- <code title="delete /api/v1/tenants/{tenant_id}">client.v1.tenants.<a href="./src/resources/v1/tenants/tenants.ts">delete</a>(tenantID) -> void</code>

### Batch

Types:

- <code><a href="./src/resources/v1/tenants/batch.ts">BatchTenantError</a></code>
- <code><a href="./src/resources/v1/tenants/batch.ts">BatchTenantSuccess</a></code>
- <code><a href="./src/resources/v1/tenants/batch.ts">BatchCreateResponse</a></code>
- <code><a href="./src/resources/v1/tenants/batch.ts">BatchUpdateResponse</a></code>
- <code><a href="./src/resources/v1/tenants/batch.ts">BatchDeleteResponse</a></code>

Methods:

- <code title="post /api/v1/tenants/batch">client.v1.tenants.batch.<a href="./src/resources/v1/tenants/batch.ts">create</a>({ ...params }) -> BatchCreateResponse</code>
- <code title="patch /api/v1/tenants/batch">client.v1.tenants.batch.<a href="./src/resources/v1/tenants/batch.ts">update</a>({ ...params }) -> BatchUpdateResponse</code>
- <code title="delete /api/v1/tenants/batch">client.v1.tenants.batch.<a href="./src/resources/v1/tenants/batch.ts">delete</a>({ ...params }) -> BatchDeleteResponse</code>

### Import

Types:

- <code><a href="./src/resources/v1/tenants/import.ts">ImportTenants</a></code>

Methods:

- <code title="post /api/v1/tenants/import/csv">client.v1.tenants.import.<a href="./src/resources/v1/tenants/import.ts">fromCsv</a>({ ...params }) -> ImportTenants</code>
- <code title="post /api/v1/tenants/import/warehouse">client.v1.tenants.import.<a href="./src/resources/v1/tenants/import.ts">fromWarehouse</a>({ ...params }) -> ImportTenants</code>
