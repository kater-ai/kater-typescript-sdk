// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Readyz extends APIResource {
  /**
   * Returns 200 if the service is ready to accept traffic.
   */
  check(options?: RequestOptions): APIPromise<ReadyzCheckResponse> {
    return this._client.get('/readyz', options);
  }
}

export type ReadyzCheckResponse = { [key: string]: unknown };

export declare namespace Readyz {
  export { type ReadyzCheckResponse as ReadyzCheckResponse };
}
