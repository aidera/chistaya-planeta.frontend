import { createAction, props } from '@ngrx/store';

import { IAddOrderRequest } from '../../services/api/orders-api.service';
import { ServerError } from '../../models/ServerResponse';

export const ADD_ORDER_REQUEST = '[order] add - order - request';
export const ADD_ORDER_SUCCESS = '[order] add - order - success';
export const ADD_ORDER_FAILURE = '[order] add - order - failure';
export const REFRESH_ADD_ORDER_SUCCESS = '[order] refresh - add order success';
export const REFRESH_ADD_ORDER_FAILURE = '[order] refresh - add order failure';

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
export const refreshAddOrderSuccess = createAction(REFRESH_ADD_ORDER_SUCCESS);
export const refreshAddOrderFailure = createAction(REFRESH_ADD_ORDER_FAILURE);
