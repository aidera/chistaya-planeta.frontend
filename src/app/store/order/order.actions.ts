import { createAction, props } from '@ngrx/store';

import { IAddOrderRequest } from '../../services/api/order.service';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';

export const ADD_ORDER_REQUEST = '[order] add - order - request';
export const ADD_ORDER_SUCCESS = '[order] add - order - success';
export const ADD_ORDER_FAILURE = '[order] add - order - failure';

export const REFRESH_ADD_ORDER_SUCCESS =
  '[order] refresh - add order success refresh';

export const GET_LOCALITIES_REQUEST = '[order] get - localities - request';
export const GET_LOCALITIES_SUCCESS = '[order] get - localities - success';
export const GET_LOCALITIES_FAILURE = '[order] get - localities - failure';

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
