import { createAction, props } from '@ngrx/store';

import { IAddOrderRequest } from '../../services/api/orders-api.service';
import { ServerError } from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { PaginationType } from '../../models/types/PaginationType';
import { IOrder } from 'src/app/models/Order';
import OrderStatus from '../../models/enums/OrderStatus';

/* ------------------ */
/* --- Get Orders --- */
/* ------------------ */

export const GET_ORDERS_REQUEST = '[orders] get - orders - request';
export const GET_ORDERS_SUCCESS = '[orders] get - orders - success';
export const GET_ORDERS_FAILURE = '[orders] get - orders - failure';

/* ----------------- */
/* --- Get Order --- */
/* ----------------- */

export const GET_ORDER_REQUEST = '[orders] get - order - request';
export const GET_ORDER_SUCCESS = '[orders] get - order - success';
export const GET_ORDER_FAILURE = '[orders] get - order - failure';

/* -------------------- */
/* --- Update Order --- */
/* -------------------- */
export const UPDATE_ORDER_SUCCESS = '[orders] update - order - success';
export const UPDATE_ORDER_FAILURE = '[orders] update - order - failure';
export const REFRESH_UPDATE_ORDER_SUCCESS =
  '[orders] refresh - update order success';
export const REFRESH_UPDATE_ORDER_FAILURE =
  '[orders] refresh - update order failure';
/* Other updates */
export const UPDATE_ORDER_STATUS_REQUEST =
  '[orders] update - order status - request';
export const ASSIGN_ORDER_CLIENT_MANAGER_REQUEST =
  '[orders] assign - order client manager - request';
export const ACCEPT_ORDER_CLIENT_MANAGER_REQUEST =
  '[orders] accept - order client manager - request';
export const ASSIGN_ORDER_RECEIVING_MANAGER_REQUEST =
  '[orders] assign - order receiving manager - request';
export const ACCEPT_ORDER_RECEIVING_MANAGER_REQUEST =
  '[orders] accept - order receiving manager - request';
export const ASSIGN_ORDER_DRIVER_REQUEST =
  '[orders] assign - order driver - request';
export const ACCEPT_ORDER_DRIVER_REQUEST =
  '[orders] accept - order driver - request';
export const PROCESS_ORDER_REQUEST = '[orders] process - order - request';
export const REFUSE_ORDER_REQUEST = '[orders] refuse - order - request';
export const CANCEL_ORDER_REQUEST = '[orders] cancel - order - request';

/* ----------------- */
/* --- Add Order --- */
/* ----------------- */

export const ADD_ORDER_REQUEST = '[orders] add - order - request';
export const ADD_ORDER_SUCCESS = '[orders] add - order - success';
export const ADD_ORDER_FAILURE = '[orders] add - order - failure';
export const REFRESH_ADD_ORDER_SUCCEED = '[orders] refresh - add order succeed';
export const REFRESH_ADD_ORDER_FAILURE = '[orders] refresh - add order failure';

/* -------------------- */
/* --- Remove Order --- */
/* -------------------- */

export const REMOVE_ORDER_REQUEST = '[orders] remove - order - request';
export const REMOVE_ORDER_SUCCESS = '[orders] remove - order - success';
export const REMOVE_ORDER_FAILURE = '[orders] remove - order - failure';
export const REFRESH_REMOVE_ORDER_SUCCESS =
  '[orders] refresh - remove order success';
export const REFRESH_REMOVE_ORDER_FAILURE =
  '[orders] refresh - remove order failure';

/* ------------------ */
/* --- Get Orders --- */
/* ------------------ */

export const getOrdersRequest = createAction(
  GET_ORDERS_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getOrdersSuccess = createAction(
  GET_ORDERS_SUCCESS,
  props<{
    orders: IOrder[];
    pagination: PaginationType;
  }>()
);
export const getOrdersFailure = createAction(
  GET_ORDERS_FAILURE,
  props<{ error: ServerError }>()
);

/* ----------------- */
/* --- Get Order --- */
/* ----------------- */

export const getOrderRequest = createAction(
  GET_ORDER_REQUEST,
  props<{ id: string; withLoading: boolean }>()
);
export const getOrderSuccess = createAction(
  GET_ORDER_SUCCESS,
  props<{
    order: IOrder;
  }>()
);
export const getOrderFailure = createAction(
  GET_ORDER_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------- */
/* --- Update Order --- */
/* -------------------- */

export const updateOrderSuccess = createAction(
  UPDATE_ORDER_SUCCESS,
  props<{
    order: IOrder;
  }>()
);
export const updateOrderFailure = createAction(
  UPDATE_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateOrderSucceed = createAction(
  REFRESH_UPDATE_ORDER_SUCCESS
);
export const refreshUpdateOrderFailure = createAction(
  REFRESH_UPDATE_ORDER_FAILURE
);

/* Other updates */
export const updateOrderStatusRequest = createAction(
  UPDATE_ORDER_STATUS_REQUEST,
  props<{ id: string; status: OrderStatus }>()
);
export const assignOrderClientManagerRequest = createAction(
  ASSIGN_ORDER_CLIENT_MANAGER_REQUEST,
  props<{ id: string; manager: string }>()
);
export const acceptOrderClientManagerRequest = createAction(
  ACCEPT_ORDER_CLIENT_MANAGER_REQUEST,
  props<{ id: string }>()
);
export const assignOrderReceivingManagerRequest = createAction(
  ASSIGN_ORDER_RECEIVING_MANAGER_REQUEST,
  props<{ id: string; manager: string }>()
);
export const acceptOrderReceivingManagerRequest = createAction(
  ACCEPT_ORDER_RECEIVING_MANAGER_REQUEST,
  props<{ id: string }>()
);
export const assignOrderDriverRequest = createAction(
  ASSIGN_ORDER_DRIVER_REQUEST,
  props<{ id: string; driver: string }>()
);
export const acceptOrderDriverRequest = createAction(
  ACCEPT_ORDER_DRIVER_REQUEST,
  props<{ id: string }>()
);
export const processOrderRequest = createAction(
  PROCESS_ORDER_REQUEST,
  props<{
    id: string;
    division?: string;
    driver?: string;
    car?: string;
    comment?: string;
    deadline?: Date;
  }>()
);
export const refuseOrderRequest = createAction(
  REFUSE_ORDER_REQUEST,
  props<{ id: string; reason?: string }>()
);
export const cancelOrderRequest = createAction(
  CANCEL_ORDER_REQUEST,
  props<{ id: string; reason?: string }>()
);

/* ----------------- */
/* --- Add Order --- */
/* ----------------- */

export const addOrderRequest = createAction(
  ADD_ORDER_REQUEST,
  props<{
    order: IAddOrderRequest;
  }>()
);
export const addOrderSuccess = createAction(
  ADD_ORDER_SUCCESS,
  props<{
    order: IOrder;
  }>()
);
export const addOrderFailure = createAction(
  ADD_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshAddOrderSucceed = createAction(REFRESH_ADD_ORDER_SUCCEED);
export const refreshAddOrderFailure = createAction(REFRESH_ADD_ORDER_FAILURE);

/* -------------------- */
/* --- Remove Order --- */
/* -------------------- */

export const removeOrderRequest = createAction(
  REMOVE_ORDER_REQUEST,
  props<{ id: string }>()
);
export const removeOrderSuccess = createAction(
  REMOVE_ORDER_SUCCESS,
  props<{
    order: IOrder;
  }>()
);
export const removeOrderFailure = createAction(
  REMOVE_ORDER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshRemoveOrderSucceed = createAction(
  REFRESH_REMOVE_ORDER_SUCCESS
);
export const refreshRemoveOrderFailure = createAction(
  REFRESH_REMOVE_ORDER_FAILURE
);
