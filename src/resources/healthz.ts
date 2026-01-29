// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Healthz extends APIResource {
  /**
   * Returns 200 if the service is alive. Used by Kubernetes liveness probe.
   */
  check(options?: RequestOptions): APIPromise<HealthzCheckResponse> {
    return this._client.get('/healthz', options);
  }
}

export type HealthzCheckResponse = { [key: string]: string };

export declare namespace Healthz {
  export { type HealthzCheckResponse as HealthzCheckResponse };
}
