// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Scaffold extends APIResource {}

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
