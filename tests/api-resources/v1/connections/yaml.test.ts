// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource yaml', () => {
  // Prism tests are disabled
  test.skip('commitYaml: only required params', async () => {
    const responsePromise = client.v1.connections.yaml.commitYaml('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      yaml_content: 'x',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('commitYaml: required and optional params', async () => {
    const response = await client.v1.connections.yaml.commitYaml('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      yaml_content: 'x',
      auto_merge: true,
    });
  });

  // Prism tests are disabled
  test.skip('retrieveYaml', async () => {
    const responsePromise = client.v1.connections.yaml.retrieveYaml('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
