// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from 'kater';

const client = new Kater({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource v1', () => {
  // Prism tests are disabled
  test.skip('listConnections', async () => {
    const responsePromise = client.v1.listConnections();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('listConnections: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.v1.listConnections({ status: 'approved' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Kater.NotFoundError);
  });
});
