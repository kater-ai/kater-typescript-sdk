// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Repos extends APIResource {}

/**
 * Repository information response.
 */
export interface Repository {
  id: number;

  default_branch: string;

  full_name: string;

  has_kater_structure: boolean;

  html_url: string;

  is_empty: boolean;

  name: string;

  owner: string;

  private: boolean;
}

export declare namespace Repos {
  export { type Repository as Repository };
}
