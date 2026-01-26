// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Webhooks extends APIResource {
  /**
   * Simple health check for the webhook receiver.
   */
  ping(options?: RequestOptions): APIPromise<WebhookPingResponse> {
    return this._client.get('/api/v1/github/webhooks/ping', options);
  }
}

export type WebhookPingResponse = { [key: string]: string };

export declare namespace Webhooks {
  export { type WebhookPingResponse as WebhookPingResponse };
}
