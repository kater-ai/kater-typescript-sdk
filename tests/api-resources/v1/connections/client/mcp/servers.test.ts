// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  authToken: 'My Auth Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource servers', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.create({
      name: 'x',
      server_url: 'server_url',
      slug: 'x',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.v1.connections.client.mcp.servers.create({
      name: 'x',
      server_url: 'server_url',
      slug: 'x',
      api_key: 'api_key',
      auth_type: 'api_key',
      description: 'description',
      oauth_authorize_url: 'oauth_authorize_url',
      oauth_client_id: 'oauth_client_id',
      oauth_client_secret: 'oauth_client_secret',
      oauth_revoke_url: 'oauth_revoke_url',
      oauth_scopes_requested: 'oauth_scopes_requested',
      oauth_token_url: 'oauth_token_url',
      terms_acknowledged: true,
      transport: 'auto',
    });
  });

  // Mock server tests are disabled
  test.skip('update', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.update(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      {},
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.delete(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('discover', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.discover(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      {},
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('rediscover', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.rediscover(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      {},
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('updateAPIKey: only required params', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.updateAPIKey(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      { api_key: 'x' },
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('updateAPIKey: required and optional params', async () => {
    const response = await client.v1.connections.client.mcp.servers.updateAPIKey(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      { api_key: 'x' },
    );
  });

  // Mock server tests are disabled
  test.skip('updateConfig', async () => {
    const responsePromise = client.v1.connections.client.mcp.servers.updateConfig(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      {},
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
