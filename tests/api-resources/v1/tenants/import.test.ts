// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater, { toFile } from '@katerai/sdk';

const client = new Kater({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource import', () => {
  // Prism tests are disabled
  test.skip('fromCsv: only required params', async () => {
    const responsePromise = client.v1.tenants.import.fromCsv({
      file: await toFile(Buffer.from('# my file contents'), 'README.md'),
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
  test.skip('fromCsv: required and optional params', async () => {
    const response = await client.v1.tenants.import.fromCsv({
      file: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('fromWarehouse: only required params', async () => {
    const responsePromise = client.v1.tenants.import.fromWarehouse({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      database: 'x',
      schema: 'x',
      table: 'x',
      tenant_key_column: 'x',
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
  test.skip('fromWarehouse: required and optional params', async () => {
    const response = await client.v1.tenants.import.fromWarehouse({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      database: 'x',
      schema: 'x',
      table: 'x',
      tenant_key_column: 'x',
      tenant_group_column: 'tenant_group_column',
      tenant_name_column: 'tenant_name_column',
    });
  });
});
