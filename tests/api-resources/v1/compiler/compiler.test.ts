// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource compiler', () => {
  // Prism tests are disabled
  test.skip('compile: only required params', async () => {
    const responsePromise = client.v1.compiler.compile({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      resolved_query: {
        kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        name: 'x',
        source_query: 'ref(dim_customer.sale_price)',
        topic: 'ref(dim_customer.sale_price)',
        widget_category: 'axis',
      },
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
  test.skip('compile: required and optional params', async () => {
    const response = await client.v1.compiler.compile({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      resolved_query: {
        kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        name: 'x',
        source_query: 'ref(dim_customer.sale_price)',
        topic: 'ref(dim_customer.sale_price)',
        widget_category: 'axis',
        ai_context: 'ai_context',
        calculations: [{ ref: 'ref', label: 'label' }],
        chart_hints: [
          {
            config: {
              color_by: 'ref(created_date)',
              comparison: 'previous_period',
              size: 'ref(created_date)',
              stack_by: 'ref(created_date)',
              target_value: 'target_value',
              x_axis: 'ref(created_date)',
              y_axis: 'ref(created_date)',
            },
            recommend: 'line',
            when: { foo: 'string' },
          },
        ],
        custom_properties: { foo: 'bar' },
        description: 'description',
        dimensions: [{ ref: 'ref', label: 'label' }],
        disallowed_widget_types: ['kpi_card'],
        filters: [
          {
            field: 'ref(dim_customer.sale_price)',
            name: 'x',
            operator: 'equals',
            sql_value: 'SUM(ref(sale_price))',
            static_values: ['string'],
          },
        ],
        inheritance_chain: ['string'],
        label: 'label',
        limit: 1,
        measures: [{ ref: 'ref', label: 'label' }],
        order_by: { asc: ['string'], desc: ['string'] },
        required_access_grants: ['string'],
        resolved_chart: {
          config: {
            color_by: 'ref(created_date)',
            comparison: 'previous_period',
            size: 'ref(created_date)',
            stack_by: 'ref(created_date)',
            target_value: 'target_value',
            x_axis: 'ref(created_date)',
            y_axis: 'ref(created_date)',
          },
          recommend: 'line',
        },
        resolved_variables: [
          {
            bound_value: 'string',
            default: 'string',
            name: 'x',
            type: 'STRING',
            allowed_values: { static: [{ value: 'string', label: 'label' }] },
            constraints: {
              max: 0,
              max_length: 1,
              min: 0,
              step: 0,
            },
            description: 'description',
            is_default: true,
            label: 'label',
          },
        ],
        select_from: [
          {
            cte_alias: 'cte_alias',
            output_columns: [
              {
                column_alias: 'column_alias',
                field_name: 'field_name',
                source_type: 'dimension',
              },
            ],
            ref: 'ref(dim_customer.sale_price)',
            variables: { foo: 'string' },
          },
        ],
      },
      source: 'source',
      tenant_key: 'tenant_key',
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Prism tests are disabled
  test.skip('enumerate: only required params', async () => {
    const responsePromise = client.v1.compiler.enumerate({
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

  // Prism tests are disabled
  test.skip('enumerate: required and optional params', async () => {
    const response = await client.v1.compiler.enumerate({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      source: 'source',
      query_refs: ['string'],
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Prism tests are disabled
  test.skip('execute: only required params', async () => {
    const responsePromise = client.v1.compiler.execute({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      resolved_query: {
        kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        name: 'x',
        source_query: 'ref(dim_customer.sale_price)',
        topic: 'ref(dim_customer.sale_price)',
        widget_category: 'axis',
      },
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
  test.skip('execute: required and optional params', async () => {
    const response = await client.v1.compiler.execute({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      resolved_query: {
        kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        name: 'x',
        source_query: 'ref(dim_customer.sale_price)',
        topic: 'ref(dim_customer.sale_price)',
        widget_category: 'axis',
        ai_context: 'ai_context',
        calculations: [{ ref: 'ref', label: 'label' }],
        chart_hints: [
          {
            config: {
              color_by: 'ref(created_date)',
              comparison: 'previous_period',
              size: 'ref(created_date)',
              stack_by: 'ref(created_date)',
              target_value: 'target_value',
              x_axis: 'ref(created_date)',
              y_axis: 'ref(created_date)',
            },
            recommend: 'line',
            when: { foo: 'string' },
          },
        ],
        custom_properties: { foo: 'bar' },
        description: 'description',
        dimensions: [{ ref: 'ref', label: 'label' }],
        disallowed_widget_types: ['kpi_card'],
        filters: [
          {
            field: 'ref(dim_customer.sale_price)',
            name: 'x',
            operator: 'equals',
            sql_value: 'SUM(ref(sale_price))',
            static_values: ['string'],
          },
        ],
        inheritance_chain: ['string'],
        label: 'label',
        limit: 1,
        measures: [{ ref: 'ref', label: 'label' }],
        order_by: { asc: ['string'], desc: ['string'] },
        required_access_grants: ['string'],
        resolved_chart: {
          config: {
            color_by: 'ref(created_date)',
            comparison: 'previous_period',
            size: 'ref(created_date)',
            stack_by: 'ref(created_date)',
            target_value: 'target_value',
            x_axis: 'ref(created_date)',
            y_axis: 'ref(created_date)',
          },
          recommend: 'line',
        },
        resolved_variables: [
          {
            bound_value: 'string',
            default: 'string',
            name: 'x',
            type: 'STRING',
            allowed_values: { static: [{ value: 'string', label: 'label' }] },
            constraints: {
              max: 0,
              max_length: 1,
              min: 0,
              step: 0,
            },
            description: 'description',
            is_default: true,
            label: 'label',
          },
        ],
        select_from: [
          {
            cte_alias: 'cte_alias',
            output_columns: [
              {
                column_alias: 'column_alias',
                field_name: 'field_name',
                source_type: 'dimension',
              },
            ],
            ref: 'ref(dim_customer.sale_price)',
            variables: { foo: 'string' },
          },
        ],
      },
      source: 'source',
      tenant_key: 'tenant_key',
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Prism tests are disabled
  test.skip('resolve: only required params', async () => {
    const responsePromise = client.v1.compiler.resolve({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      query_ref: 'query_ref',
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
  test.skip('resolve: required and optional params', async () => {
    const response = await client.v1.compiler.resolve({
      connection_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      query_ref: 'query_ref',
      source: 'source',
      combination: 'combination',
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Prism tests are disabled
  test.skip('validate', async () => {
    const responsePromise = client.v1.compiler.validate({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
