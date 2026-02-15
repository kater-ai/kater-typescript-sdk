// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource cache', () => {
  // Prism tests are disabled
  test.skip('invalidate: only required params', async () => {
    const responsePromise = client.v1.compiler.cache.invalidate({ client_id: 'client_id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('invalidate: required and optional params', async () => {
    const response = await client.v1.compiler.cache.invalidate({
      client_id: 'client_id',
      connection_id: 'connection_id',
      tenant_id: 'tenant_id',
    });
  });
});
