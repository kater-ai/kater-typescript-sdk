// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { RequestOptions } from '../../../internal/request-options';

export class Scaffold extends APIResource {
  /**
   * Clean up partial state and retry scaffolding from scratch.
   */
  retry(options?: RequestOptions): APIPromise<ScaffoldTrigger> {
    return this._client.post('/api/v1/github/scaffold/retry', options);
  }

  /**
   * Create the Kater folder structure and PR in the selected repository.
   */
  trigger(options?: RequestOptions): APIPromise<ScaffoldTrigger> {
    return this._client.post('/api/v1/github/scaffold', options);
  }
}

/**
 * Response from triggering scaffolding.
 */
export interface ScaffoldTrigger {
  message: string;

  status: string;

  success: boolean;

  branch?: string | null;

  error?: string | null;

  pr_number?: number | null;

  pr_url?: string | null;
}

export declare namespace Scaffold {
  export { type ScaffoldTrigger as ScaffoldTrigger };
}
