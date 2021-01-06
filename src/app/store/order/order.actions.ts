import { createAction, props } from '@ngrx/store';

import { IAddOrderRequest } from '../../services/api/order/order.service';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';

export const ADD_ORDER_REQUEST = '[order] Add Order';
export const ADD_ORDER_SUCCESS = '[order] Add Order Success';
export const ADD_ORDER_FAILURE = '[order] Add Order Failure';
export const ADD_ORDER_SUCCESS_REFRESH = '[order] Add Order Success Refresh';

export const GET_LOCALITIES_REQUEST = '[order] Get Localities Request';
export const GET_LOCALITIES_SUCCESS = '[order] Get Localities Success';
export const GET_LOCALITIES_FAILURE = '[order] Get Localities Failure';

export const addOrderRequest = createAction(
  ADD_ORDER_REQUEST,
  props<{
    order: IAddOrderRequest;
  }>()
);
export const addOrderSuccess = createAction(ADD_ORDER_SUCCESS);
export const addOrderFailure = createAction(
  ADD_ORDER_FAILURE,
  props<{ error: ServerError }>()
);

export const addOrderSuccessRefresh = createAction(ADD_ORDER_SUCCESS_REFRESH);

export const getLocalitiesRequest = createAction(
  GET_LOCALITIES_REQUEST,
  props<{
    pages?: boolean;
  }>()
);
export const getLocalitiesSuccess = createAction(
  GET_LOCALITIES_SUCCESS,
  props<{
    localities: ILocality[];
  }>()
);
export const getLocalitiesFailure = createAction(
  GET_LOCALITIES_FAILURE,
  props<{ error: ServerError }>()
);
