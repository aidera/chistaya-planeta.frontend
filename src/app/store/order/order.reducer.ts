import { Action, createReducer, on } from '@ngrx/store';

import * as OrderActions from './order.actions';
import { ServerError } from '../../models/ServerResponse';

export const orderInitialState = {
  addOrderIsFetching: false,
  addOrderSucceed: false,
  addOrderError: null as ServerError | null,
};
export type OrderState = typeof orderInitialState;

const _orderReducer = createReducer(
  orderInitialState,

  on(OrderActions.addOrderRequest, (state) => ({
    ...state,
    addOrderIsFetching: true,
    addOrderSucceed: false,
    addOrderError: null,
  })),
  on(OrderActions.addOrderSuccess, (state, payload) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderSucceed: true,
    addOrderError: null,
  })),
  on(OrderActions.addOrderFailure, (state, payload) => ({
    ...state,
    addOrderIsFetching: false,
    addOrderSucceed: false,
    addOrderError: payload.error,
  })),

  on(OrderActions.refreshAddOrderSuccess, (state, payload) => ({
    ...state,
    addOrderSucceed: false,
  }))
);

export function orderReducer(
  state: OrderState | undefined,
  action: Action
): OrderState {
  return _orderReducer(state, action);
}
