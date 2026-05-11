// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  authToken: 'My Auth Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource capabilities', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.v1.compiler.capabilities.create({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
    const response = await client.v1.compiler.capabilities.create({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      source: 'source',
      query_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Mock server tests are disabled
  test.skip('sample: only required params', async () => {
    const responsePromise = client.v1.compiler.capabilities.sample({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      n: 1,
      query_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('sample: required and optional params', async () => {
    const response = await client.v1.compiler.capabilities.sample({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      n: 1,
      query_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      source: 'source',
      include_filter_variants: true,
      include_pinned_variants: true,
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });
});
