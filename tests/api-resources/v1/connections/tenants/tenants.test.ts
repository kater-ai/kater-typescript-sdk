// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource tenants', () => {
  // Prism tests are disabled
  test.skip('retrieveSchema', async () => {
    const responsePromise = client.v1.connections.tenants.retrieveSchema();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
