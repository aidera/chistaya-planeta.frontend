import { Action, createReducer, on } from '@ngrx/store';

import * as OrdersActions from './orders.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IOrder } from '../../models/Order';

export const ordersInitialState = {
  orders: null as IOrder[] | null,

  getOrdersIsFetching: false,
  getOrdersError: null as ServerError | null,
  getOrdersPagination: null as PaginationType | null,

  order: null as IOrder | null,

  getOrderIsFetching: false,
  getOrderError: null as ServerError | null,

  updateOrderIsFetching: false,
  updateOrderError: null as ServerError | null,
  updateOrderSucceed: false as boolean,

  addOrderIsFetching: false,
  addOrderError: null as ServerError | null,
  addOrderSucceed: false as boolean,

  removeOrderIsFetching: false,
  removeOrderError: null as ServerError | null,
  removeOrderSucceed: false as boolean,
};
export type OrdersState = typeof ordersInitialState;

const _ordersReducer = createReducer(
  ordersInitialState,

  /* ------------------ */
  /* --- Get Orders --- */
  /* ------------------ */

  on(OrdersActions.getOrdersRequest, (state, payload) => ({
    ...state,
    getOrdersIsFetching: payload.withLoading,
    getOrdersError: null,
  })),
  on(OrdersActions.getOrdersSuccess, (state, payload) => ({
    ...state,
    orders: payload.orders,
    getOrdersIsFetching: false,
    getOrdersError: null,
    getOrdersPagination: payload.pagination,
  })),
  on(OrdersActions.getOrdersFailure, (state, payload) => ({
    ...state,
    getOrdersIsFetching: false,
    getOrdersError: payload.error,
  })),

  /* ----------------- */
  /* --- Get Order --- */
  /* ----------------- */

  on(OrdersActions.getOrderRequest, (state, payload) => ({
    ...state,
    getOrderIsFetching: payload.withLoading,
  })),
  on(OrdersActions.getOrderSuccess, (state, payload) => ({
    ...state,
    order: payload.order,
    getOrderIsFetching: false,
    getOrderError: null,
  })),
  on(OrdersActions.getOrderFailure, (state, payload) => ({
    ...state,
    order: null,
    getOrderIsFetching: false,
    getOrderError: payload.error,
  })),

  /* -------------------- */
  /* --- Update Order --- */
  /* -------------------- */

  on(OrdersActions.updateOrderSuccess, (state, payload) => ({
    ...state,
    order: payload.order,
    updateOrderIsFetching: false,
    updateOrderError: null,
    updateOrderSucceed: true,
  })),
  on(OrdersActions.updateOrderFailure, (state, payload) => ({
    ...state,
    updateOrderIsFetching: false,
    updateOrderError: payload.error,
  })),
  on(OrdersActions.refreshUpdateOrderSucceed, (state) => ({
    ...state,
    updateOrderSucceed: false,
  })),
  on(OrdersActions.refreshUpdateOrderFailure, (state) => ({
    ...state,
    updateOrderError: null,
  })),
  /* Other updates */
  on(OrdersActions.updateOrderStatusRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.assignOrderClientManagerRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.acceptOrderClientManagerRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.assignOrderReceivingManagerRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.acceptOrderReceivingManagerRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.assignOrderDriverRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.acceptOrderDriverRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.processOrderRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.refuseOrderRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),
  on(OrdersActions.cancelOrderRequest, (state) => ({
    ...state,
    updateOrderIsFetching: true,
    updateOrderError: null,
  })),

  /* ----------------- */
  /* --- Add Order --- */
  /* ----------------- */

  on(OrdersActions.addOrderRequest, (state) => ({
    ...state,
    addOrderIsFetching: true,
    addOrderError: null,
  })),
  on(OrdersActions.addOrderSuccess, (state) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderError: null,
    addOrderSucceed: true,
  })),
  on(OrdersActions.addOrderFailure, (state, payload) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderError: payload.error,
  })),
  on(OrdersActions.refreshAddOrderSucceed, (state) => ({
    ...state,
    addOrderSucceed: false,
  })),
  on(OrdersActions.refreshAddOrderFailure, (state) => ({
    ...state,
    addOrderError: null,
  })),

  /* -------------------- */
  /* --- Remove Order --- */
  /* -------------------- */

  on(OrdersActions.removeOrderRequest, (state) => ({
    ...state,
    removeOrderIsFetching: true,
    removeOrderError: null,
  })),
  on(OrdersActions.removeOrderSuccess, (state) => ({
    ...state,
    removeOrderIsFetching: false,
    removeOrderError: null,
    removeOrderSucceed: true,
  })),
  on(OrdersActions.removeOrderFailure, (state, payload) => ({
    ...state,
    removeOrderIsFetching: false,
    removeOrderError: payload.error,
  })),
  on(OrdersActions.refreshRemoveOrderSucceed, (state) => ({
    ...state,
    removeOrderSucceed: false,
  })),
  on(OrdersActions.refreshRemoveOrderFailure, (state) => ({
    ...state,
    removeOrderError: null,
  }))
);

export function ordersReducer(
  state: OrdersState | undefined,
  action: Action
): OrdersState {
  return _ordersReducer(state, action);
}
