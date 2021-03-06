import { createAction, props } from '@ngrx/store';

import { IAddOrderRequest } from '../../services/api/orders-api.service';
import { ServerError } from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { PaginationType } from '../../models/types/PaginationType';
import { IOrder } from 'src/app/models/Order';
import { OrderStatus } from '../../models/enums/OrderStatus';
import { IServiceToWeigh } from '../../models/Service';
import { IOfferToWeigh } from '../../models/Offer';

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
export const UPDATE_ORDER_COMPANY_COMMENT_REQUEST =
  '[orders] update - order company comment - request';
export const UPDATE_ORDER_DEADLINE_REQUEST =
  '[orders] update - order deadline - request';
export const SET_ORDER_DIVISION_REQUEST =
  '[orders] set - order division - request';
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
export const SET_ORDER_CAR_REQUEST = '[orders] set - order car - request';
export const SET_ORDER_CLIENT_REQUEST = '[orders] set - order client - request';
export const PROCESS_ORDER_REQUEST = '[orders] process - order - request';
export const REFUSE_ORDER_REQUEST = '[orders] refuse - order - request';
export const CANCEL_ORDER_REQUEST = '[orders] cancel - order - request';
export const SET_ORDER_IN_TRANSIT_REQUEST =
  '[orders] set - order in transit - request';
export const SET_ORDER_DELIVERED_REQUEST =
  '[orders] set - order delivered - request';
export const WEIGH_ORDER_REQUEST = '[orders] weigh - order - request';
export const COMPLETE_ORDER_REQUEST = '[orders] complete - order - request';

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
export const updateOrderCompanyCommentRequest = createAction(
  UPDATE_ORDER_COMPANY_COMMENT_REQUEST,
  props<{ id: string; comment: string }>()
);
export const updateOrderDeadlineRequest = createAction(
  UPDATE_ORDER_DEADLINE_REQUEST,
  props<{ id: string; deadline: Date }>()
);
export const setOrderDivisionRequest = createAction(
  SET_ORDER_DIVISION_REQUEST,
  props<{ id: string; division: string }>()
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
export const setOrderCarRequest = createAction(
  SET_ORDER_CAR_REQUEST,
  props<{ id: string; car: string }>()
);
export const setOrderClientRequest = createAction(
  SET_ORDER_CLIENT_REQUEST,
  props<{ id: string; client: string }>()
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
export const setOrderInTransit = createAction(
  SET_ORDER_IN_TRANSIT_REQUEST,
  props<{
    id: string;
  }>()
);
export const setOrderDelivered = createAction(
  SET_ORDER_DELIVERED_REQUEST,
  props<{
    id: string;
  }>()
);
export const weighOrderRequest = createAction(
  WEIGH_ORDER_REQUEST,
  props<{
    id: string;
    services?: IServiceToWeigh[];
    offers?: IOfferToWeigh[];
  }>()
);
export const completeOrderRequest = createAction(
  COMPLETE_ORDER_REQUEST,
  props<{
    id: string;
    finalSum?: number;
  }>()
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
