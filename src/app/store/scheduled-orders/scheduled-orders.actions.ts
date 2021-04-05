import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { PaginationType } from '../../models/types/PaginationType';
import { IScheduledOrder } from '../../models/ScheduledOrder';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import {
  IAddScheduledOrderRequest,
  IUpdateScheduledOrderRequest,
} from '../../services/api/scheduled-orders-api.service';

/* ---------------------------- */
/* --- Get Scheduled Orders --- */
/* ---------------------------- */

export const GET_SCHEDULED_ORDERS_REQUEST =
  '[scheduled orders] get - scheduled orders - request';
export const GET_SCHEDULED_ORDERS_SUCCESS =
  '[scheduled orders] get - scheduled orders - success';
export const GET_SCHEDULED_ORDERS_FAILURE =
  '[scheduled orders] get - scheduled orders - failure';

/* --------------------------- */
/* --- Get Scheduled Order --- */
/* --------------------------- */

export const GET_SCHEDULED_ORDER_REQUEST =
  '[scheduled orders] get - scheduled order - request';
export const GET_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] get - scheduled order - success';
export const GET_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] get - scheduled order - failure';

/* ------------------------------ */
/* --- Update Scheduled Order --- */
/* ------------------------------ */
export const UPDATE_SCHEDULED_ORDER_REQUEST =
  '[scheduled orders] update - scheduled order - request';
export const UPDATE_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] update - scheduled order - success';
export const UPDATE_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] update - scheduled order - failure';
export const REFRESH_UPDATE_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] refresh - update scheduled order success';
export const REFRESH_UPDATE_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] refresh - update scheduled order failure';
/* Other updates */
export const UPDATE_SCHEDULED_ORDER_STATUS_REQUEST =
  '[scheduled orders] update - order scheduled status - request';

/* --------------------------- */
/* --- Add Scheduled Order --- */
/* --------------------------- */

export const ADD_SCHEDULED_ORDER_REQUEST =
  '[scheduled orders] add - scheduled order - request';
export const ADD_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] add - scheduled order - success';
export const ADD_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] add - scheduled order - failure';
export const REFRESH_ADD_SCHEDULED_ORDER_SUCCEED =
  '[scheduled orders] refresh - add scheduled order succeed';
export const REFRESH_ADD_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] refresh - add scheduled order failure';

/* ------------------------------ */
/* --- Remove Scheduled Order --- */
/* ------------------------------ */

export const REMOVE_SCHEDULED_ORDER_REQUEST =
  '[scheduled orders] remove - scheduled order - request';
export const REMOVE_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] remove - scheduled order - success';
export const REMOVE_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] remove - scheduled order - failure';
export const REFRESH_REMOVE_SCHEDULED_ORDER_SUCCESS =
  '[scheduled orders] refresh - remove scheduled order success';
export const REFRESH_REMOVE_SCHEDULED_ORDER_FAILURE =
  '[scheduled orders] refresh - remove scheduled order failure';

/* ---------------------------- */
/* --- Get Scheduled Orders --- */
/* ---------------------------- */

export const getScheduledOrdersRequest = createAction(
  GET_SCHEDULED_ORDERS_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getScheduledOrdersSuccess = createAction(
  GET_SCHEDULED_ORDERS_SUCCESS,
  props<{
    scheduledOrders: IScheduledOrder[];
    pagination: PaginationType;
  }>()
);
export const getScheduledOrdersFailure = createAction(
  GET_SCHEDULED_ORDERS_FAILURE,
  props<{ error: ServerError }>()
);

/* --------------------------- */
/* --- Get Scheduled Order --- */
/* --------------------------- */

export const getScheduledOrderRequest = createAction(
  GET_SCHEDULED_ORDER_REQUEST,
  props<{ id: string; withLoading: boolean }>()
);
export const getScheduledOrderSuccess = createAction(
  GET_SCHEDULED_ORDER_SUCCESS,
  props<{
    scheduledOrder: IScheduledOrder;
  }>()
);
export const getScheduledOrderFailure = createAction(
  GET_SCHEDULED_ORDER_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------------------ */
/* --- Update Scheduled Order --- */
/* ------------------------------ */
export const updateScheduledOrderRequest = createAction(
  UPDATE_SCHEDULED_ORDER_REQUEST,
  props<{ id: string; fields: IUpdateScheduledOrderRequest }>()
);
export const updateScheduledOrderSuccess = createAction(
  UPDATE_SCHEDULED_ORDER_SUCCESS,
  props<{
    scheduledOrder: IScheduledOrder;
  }>()
);
export const updateScheduledOrderFailure = createAction(
  UPDATE_SCHEDULED_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateScheduledOrderSucceed = createAction(
  REFRESH_UPDATE_SCHEDULED_ORDER_SUCCESS
);
export const refreshUpdateScheduledOrderFailure = createAction(
  REFRESH_UPDATE_SCHEDULED_ORDER_FAILURE
);

/* Other updates */
export const updateScheduledOrderStatusRequest = createAction(
  UPDATE_SCHEDULED_ORDER_STATUS_REQUEST,
  props<{ id: string; status: SimpleStatus }>()
);

/* --------------------------- */
/* --- Add Scheduled Order --- */
/* --------------------------- */

export const addScheduledOrderRequest = createAction(
  ADD_SCHEDULED_ORDER_REQUEST,
  props<{
    scheduledOrder: IAddScheduledOrderRequest;
  }>()
);
export const addScheduledOrderSuccess = createAction(
  ADD_SCHEDULED_ORDER_SUCCESS,
  props<{
    scheduledOrder: IScheduledOrder;
  }>()
);
export const addScheduledOrderFailure = createAction(
  ADD_SCHEDULED_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshAddScheduledOrderSucceed = createAction(
  REFRESH_ADD_SCHEDULED_ORDER_SUCCEED
);
export const refreshAddScheduledOrderFailure = createAction(
  REFRESH_ADD_SCHEDULED_ORDER_FAILURE
);

/* ------------------------------ */
/* --- Remove Scheduled Order --- */
/* ------------------------------ */

export const removeScheduledOrderRequest = createAction(
  REMOVE_SCHEDULED_ORDER_REQUEST,
  props<{ id: string }>()
);
export const removeScheduledOrderSuccess = createAction(
  REMOVE_SCHEDULED_ORDER_SUCCESS,
  props<{
    scheduledOrder: IScheduledOrder;
  }>()
);
export const removeScheduledOrderFailure = createAction(
  REMOVE_SCHEDULED_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshRemoveScheduledOrderSucceed = createAction(
  REFRESH_REMOVE_SCHEDULED_ORDER_SUCCESS
);
export const refreshRemoveScheduledOrderFailure = createAction(
  REFRESH_REMOVE_SCHEDULED_ORDER_FAILURE
);
