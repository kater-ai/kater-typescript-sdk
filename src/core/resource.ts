// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Kater } from '../client';

export abstract class APIResource {
  protected _client: Kater;

  constructor(client: Kater) {
    this._client = client;
  }
}
