// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';

export class Webhooks extends APIResource {
  /**
   * Receives and processes webhook events from GitHub.
   */
  receive(params: WebhookReceiveParams, options?: RequestOptions): APIPromise<WebhookReceiveResponse> {
    const {
      'X-GitHub-Delivery': xGitHubDelivery,
      'X-GitHub-Event': xGitHubEvent,
      'X-Hub-Signature-256': xHubSignature256,
    } = params;
    return this._client.post('/api/v1/github/webhooks/receiver', {
      ...options,
      headers: buildHeaders([
        {
          'X-GitHub-Delivery': xGitHubDelivery,
          'X-GitHub-Event': xGitHubEvent,
          'X-Hub-Signature-256': xHubSignature256,
        },
        options?.headers,
      ]),
    });
  }
}

/**
 * Response for successful webhook receipt.
 */
export interface WebhookReceiveResponse {
  delivery_id: string;

  event_type: string;

  received: boolean;

  message?: string | null;

  processed?: boolean;
}

export interface WebhookReceiveParams {
  'X-GitHub-Delivery': string;

  'X-GitHub-Event': string;

  'X-Hub-Signature-256': string;
}

export declare namespace Webhooks {
  export {
    type WebhookReceiveResponse as WebhookReceiveResponse,
    type WebhookReceiveParams as WebhookReceiveParams,
  };
}
