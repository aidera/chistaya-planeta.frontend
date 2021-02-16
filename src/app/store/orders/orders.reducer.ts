import { Action, createReducer, on } from '@ngrx/store';

import * as OrdersActions from './orders.actions';
import { ServerError } from '../../models/ServerResponse';

export const ordersInitialState = {
  addOrderIsFetching: false,
  addOrderSucceed: false,
  addOrderError: null as ServerError | null,
};
export type OrdersState = typeof ordersInitialState;

const _ordersReducer = createReducer(
  ordersInitialState,

  on(OrdersActions.addOrderRequest, (state) => ({
    ...state,
    addOrderIsFetching: true,
    addOrderSucceed: false,
    addOrderError: null,
  })),
  on(OrdersActions.addOrderSuccess, (state, payload) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderSucceed: true,
    addOrderError: null,
  })),
  on(OrdersActions.addOrderFailure, (state, payload) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderSucceed: false,
    addOrderError: payload.error,
  })),
  on(OrdersActions.refreshAddOrderSuccess, (state, payload) => ({
    ...state,
    addOrderSucceed: false,
  })),
  on(OrdersActions.refreshAddOrderFailure, (state, payload) => ({
    ...state,
    addOrderError: null,
  }))
);

export function ordersReducer(
  state: OrdersState | undefined,
  action: Action
): OrdersState {
  return _ordersReducer(state, action);
}
