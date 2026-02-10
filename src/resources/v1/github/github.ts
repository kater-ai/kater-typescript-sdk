// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ReposAPI from './repos';
import { Repos, Repository } from './repos';
import * as ScaffoldAPI from './scaffold';
import { Scaffold, ScaffoldTrigger } from './scaffold';
import * as WebhooksAPI from './webhooks';
import { Webhooks } from './webhooks';

export class GitHub extends APIResource {
  repos: ReposAPI.Repos = new ReposAPI.Repos(this._client);
  scaffold: ScaffoldAPI.Scaffold = new ScaffoldAPI.Scaffold(this._client);
  webhooks: WebhooksAPI.Webhooks = new WebhooksAPI.Webhooks(this._client);
}

GitHub.Repos = Repos;
GitHub.Scaffold = Scaffold;
GitHub.Webhooks = Webhooks;

export declare namespace GitHub {
  export { Repos as Repos, type Repository as Repository };

  export { Scaffold as Scaffold, type ScaffoldTrigger as ScaffoldTrigger };

  export { Webhooks as Webhooks };
}
