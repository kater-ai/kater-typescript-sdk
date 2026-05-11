// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../../core/resource';
import * as WidgetAPI from './widget';
import { Widget, WidgetRenderParams, WidgetRenderResponse } from './widget';

export class SDK extends APIResource {
  widget: WidgetAPI.Widget = new WidgetAPI.Widget(this._client);
}

SDK.Widget = Widget;

export declare namespace SDK {
  export {
    Widget as Widget,
    type WidgetRenderResponse as WidgetRenderResponse,
    type WidgetRenderParams as WidgetRenderParams,
  };
}
