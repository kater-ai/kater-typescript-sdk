// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater, { toFile } from 'kater';

const client = new Kater({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource tenants', () => {
  // Prism tests are disabled
  test.skip('importFromCsv: only required params', async () => {
    const responsePromise = client.v1.tenants.importFromCsv({
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
  test.skip('importFromCsv: required and optional params', async () => {
    const response = await client.v1.tenants.importFromCsv({
      file: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
  });

  // Prism tests are disabled
  test.skip('importFromWarehouse: only required params', async () => {
    const responsePromise = client.v1.tenants.importFromWarehouse({
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
  test.skip('importFromWarehouse: required and optional params', async () => {
    const response = await client.v1.tenants.importFromWarehouse({
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
