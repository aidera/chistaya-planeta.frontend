import { Action, createReducer, on } from '@ngrx/store';

import * as ScheduledOrdersActions from './scheduled-orders.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IScheduledOrder } from '../../models/ScheduledOrder';

export const scheduledOrdersInitialState = {
  scheduledOrders: null as IScheduledOrder[] | null,

  getScheduledOrdersIsFetching: false,
  getScheduledOrdersError: null as ServerError | null,
  getScheduledOrdersPagination: null as PaginationType | null,

  scheduledOrder: null as IScheduledOrder | null,

  getScheduledOrderIsFetching: false,
  getScheduledOrderError: null as ServerError | null,

  updateScheduledOrderIsFetching: false,
  updateScheduledOrderError: null as ServerError | null,
  updateScheduledOrderSucceed: false as boolean,

  addScheduledOrderIsFetching: false,
  addScheduledOrderError: null as ServerError | null,
  addScheduledOrderSucceed: false as boolean,

  removeScheduledOrderIsFetching: false,
  removeScheduledOrderError: null as ServerError | null,
  removeScheduledOrderSucceed: false as boolean,
};
export type ScheduledOrdersState = typeof scheduledOrdersInitialState;

const _scheduledOrdersReducer = createReducer(
  scheduledOrdersInitialState,

  /* ------------------ */
  /* --- Get Orders --- */
  /* ------------------ */

  on(ScheduledOrdersActions.getScheduledOrdersRequest, (state, payload) => ({
    ...state,
    getScheduledOrdersIsFetching: payload.withLoading,
    getScheduledOrdersError: null,
  })),
  on(ScheduledOrdersActions.getScheduledOrdersSuccess, (state, payload) => ({
    ...state,
    scheduledOrders: payload.scheduledOrders,
    getScheduledOrdersIsFetching: false,
    getScheduledOrdersError: null,
    getScheduledOrdersPagination: payload.pagination,
  })),
  on(ScheduledOrdersActions.getScheduledOrdersFailure, (state, payload) => ({
    ...state,
    getScheduledOrdersIsFetching: false,
    getScheduledOrdersError: payload.error,
  })),

  /* ----------------- */
  /* --- Get Order --- */
  /* ----------------- */

  on(ScheduledOrdersActions.getScheduledOrderRequest, (state, payload) => ({
    ...state,
    getScheduledOrderIsFetching: payload.withLoading,
  })),
  on(ScheduledOrdersActions.getScheduledOrderSuccess, (state, payload) => ({
    ...state,
    scheduledOrder: payload.scheduledOrder,
    getScheduledOrderIsFetching: false,
    getScheduledOrderError: null,
  })),
  on(ScheduledOrdersActions.getScheduledOrderFailure, (state, payload) => ({
    ...state,
    scheduledOrder: null,
    getScheduledOrderIsFetching: false,
    getScheduledOrderError: payload.error,
  })),

  /* -------------------- */
  /* --- Update Order --- */
  /* -------------------- */
  on(ScheduledOrdersActions.updateScheduledOrderRequest, (state) => ({
    ...state,
    updateScheduledOrderIsFetching: true,
    updateScheduledOrderError: null,
  })),
  on(ScheduledOrdersActions.updateScheduledOrderSuccess, (state, payload) => ({
    ...state,
    scheduledOrder: payload.scheduledOrder,
    updateScheduledOrderIsFetching: false,
    updateScheduledOrderError: null,
    updateScheduledOrderSucceed: true,
  })),
  on(ScheduledOrdersActions.updateScheduledOrderFailure, (state, payload) => ({
    ...state,
    updateScheduledOrderIsFetching: false,
    updateScheduledOrderError: payload.error,
  })),
  on(ScheduledOrdersActions.refreshUpdateScheduledOrderSucceed, (state) => ({
    ...state,
    updateScheduledOrderSucceed: false,
  })),
  on(ScheduledOrdersActions.refreshUpdateScheduledOrderFailure, (state) => ({
    ...state,
    updateScheduledOrderError: null,
  })),
  /* Other updates */
  on(ScheduledOrdersActions.updateScheduledOrderStatusRequest, (state) => ({
    ...state,
    updateScheduledOrderIsFetching: true,
    updateScheduledOrderError: null,
  })),

  /* ----------------- */
  /* --- Add Order --- */
  /* ----------------- */

  on(ScheduledOrdersActions.addScheduledOrderRequest, (state) => ({
    ...state,
    addScheduledOrderIsFetching: true,
    addScheduledOrderError: null,
  })),
  on(ScheduledOrdersActions.addScheduledOrderSuccess, (state) => ({
    ...state,
    addScheduledOrderIsFetching: false,
    addScheduledOrderError: null,
    addScheduledOrderSucceed: true,
  })),
  on(ScheduledOrdersActions.addScheduledOrderFailure, (state, payload) => ({
    ...state,
    addScheduledOrderIsFetching: false,
    addScheduledOrderError: payload.error,
  })),
  on(ScheduledOrdersActions.refreshAddScheduledOrderSucceed, (state) => ({
    ...state,
    addScheduledOrderSucceed: false,
  })),
  on(ScheduledOrdersActions.refreshAddScheduledOrderFailure, (state) => ({
    ...state,
    addScheduledOrderError: null,
  })),

  /* -------------------- */
  /* --- Remove Order --- */
  /* -------------------- */

  on(ScheduledOrdersActions.removeScheduledOrderRequest, (state) => ({
    ...state,
    removeScheduledOrderIsFetching: true,
    removeScheduledOrderError: null,
  })),
  on(ScheduledOrdersActions.removeScheduledOrderSuccess, (state) => ({
    ...state,
    removeScheduledOrderIsFetching: false,
    removeScheduledOrderError: null,
    removeScheduledOrderSucceed: true,
  })),
  on(ScheduledOrdersActions.removeScheduledOrderFailure, (state, payload) => ({
    ...state,
    removeScheduledOrderIsFetching: false,
    removeScheduledOrderError: payload.error,
  })),
  on(ScheduledOrdersActions.refreshRemoveScheduledOrderSucceed, (state) => ({
    ...state,
    removeScheduledOrderSucceed: false,
  })),
  on(ScheduledOrdersActions.refreshRemoveScheduledOrderFailure, (state) => ({
    ...state,
    removeScheduledOrderError: null,
  }))
);

export function scheduledOrdersReducer(
  state: ScheduledOrdersState | undefined,
  action: Action
): ScheduledOrdersState {
  return _scheduledOrdersReducer(state, action);
}
