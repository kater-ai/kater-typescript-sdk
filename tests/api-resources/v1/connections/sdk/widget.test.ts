// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Kater from '@katerai/sdk';

const client = new Kater({
  apiKey: 'My API Key',
  authToken: 'My Auth Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource widget', () => {
  // Mock server tests are disabled
  test.skip('regenerateMetadata: only required params', async () => {
    const responsePromise = client.v1.connections.sdk.widget.regenerateMetadata({
      persist: { mode: 'mode' },
      post_query_state: {},
      query_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      rendered_query_key_id: 'rendered_query_key_id',
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
  test.skip('regenerateMetadata: required and optional params', async () => {
    const response = await client.v1.connections.sdk.widget.regenerateMetadata({
      persist: {
        mode: 'mode',
        scope: {
          chat_thread_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          message_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          widget_instance_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        },
        scope_type: 'scope_type',
      },
      post_query_state: {
        filters: [
          {
            expression: 'equals',
            field: { ref: 'ref(dim_customer.sale_price)', modifiers: [{ kind: 'timeframe', value: 'x' }] },
            kind: 'date',
            default_enabled: true,
            default_value: 'string',
            values: {
              source: 'result_distinct',
              limit: 1,
              searchable: true,
              sort: 'asc',
            },
          },
        ],
        sorts: [
          {
            field: { ref: 'ref(dim_customer.sale_price)', modifiers: [{ kind: 'timeframe', value: 'x' }] },
            default_direction: 'asc',
            default_enabled: true,
            priority: 1,
          },
        ],
      },
      query_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      rendered_query_key_id: 'rendered_query_key_id',
      source: 'source',
      post_query_state_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      revision: 0,
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });

  // Mock server tests are disabled
  test.skip('render: only required params', async () => {
    const responsePromise = client.v1.connections.sdk.widget.render({
      connection_id: 'connection_id',
      dashboard: {
        dashboard_filter_state: [{ effective_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e' }],
        dashboard_kater_id: 'dashboard_kater_id',
        slot_name: 'slot_name',
        widget_kater_id: 'widget_kater_id',
      },
      field_selection: {
        selected_fields: [{ modifiers: [{ kind: 'timeframe', value: 'x' }], source_kater_id: 'x' }],
      },
      filter_state: [{ effective_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e' }],
      pinned_variant: 'pinned_variant',
      presentation: {},
      query_kater_id: 'query_kater_id',
      result_window: {
        cursor: 'cursor',
        page_size: 0,
        sort_by: 'sort_by',
        sort_order: 'asc',
      },
      temporal: { as_of: 'as_of', timezone: 'timezone' },
      variables: [
        {
          name: 'name',
          query_kater_id: 'query_kater_id',
          scope: 'query',
          value: 'string',
          variable_kater_id: 'variable_kater_id',
        },
      ],
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
  test.skip('render: required and optional params', async () => {
    const response = await client.v1.connections.sdk.widget.render({
      connection_id: 'connection_id',
      dashboard: {
        dashboard_filter_state: [
          {
            effective_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
            enabled: true,
            value: { value: 'string', mode: 'scalar' },
          },
        ],
        dashboard_kater_id: 'dashboard_kater_id',
        slot_name: 'slot_name',
        widget_kater_id: 'widget_kater_id',
      },
      field_selection: {
        selected_fields: [{ modifiers: [{ kind: 'timeframe', value: 'x' }], source_kater_id: 'x' }],
        selected_field_ids: ['string'],
        timeframe_overrides: [{ active_timeframe: 'active_timeframe', source_kater_id: 'source_kater_id' }],
      },
      filter_state: [
        {
          effective_kater_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          enabled: true,
          value: { value: 'string', mode: 'scalar' },
        },
      ],
      pinned_variant: 'pinned_variant',
      presentation: {
        chart: { foo: 'string' },
        display: { foo: 'string' },
        style: { foo: 'string' },
      },
      query_kater_id: 'query_kater_id',
      result_window: {
        cursor: 'cursor',
        page_size: 0,
        sort_by: 'sort_by',
        sort_order: 'asc',
      },
      temporal: { as_of: 'as_of', timezone: 'timezone' },
      variables: [
        {
          name: 'name',
          query_kater_id: 'query_kater_id',
          scope: 'query',
          value: 'string',
          variable_kater_id: 'variable_kater_id',
        },
      ],
      source: 'source',
      'X-Kater-CLI-ID': 'X-Kater-CLI-ID',
    });
  });
});
