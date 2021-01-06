import { Action, createReducer, on } from '@ngrx/store';

import * as OrderActions from './order.actions';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';

export const orderInitialState = {
  addOrderIsFetching: false,
  addOrderSucceed: false,
  addOrderError: null as ServerError | null,

  addOrderLocalities: [] as ILocality[],
  addOrderLocalitiesIsFetching: false,
  addOrderLocalitiesError: null as ServerError | null,
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

  on(OrderActions.addOrderSuccessRefresh, (state, payload) => ({
    ...state,
    addOrderSucceed: false,
  })),

  on(OrderActions.getLocalitiesRequest, (state) => ({
    ...state,
    addOrderLocalitiesIsFetching: true,
    addOrderLocalitiesError: null,
  })),
  on(OrderActions.getLocalitiesSuccess, (state, payload) => ({
    ...state,
    addOrderLocalities: payload.localities,
    addOrderLocalitiesIsFetching: false,
    addOrderLocalitiesError: null,
  })),
  on(OrderActions.getLocalitiesFailure, (state, payload) => ({
    ...state,
    addOrderLocalitiesIsFetching: false,
    addOrderLocalitiesError: payload.error,
  }))
);

export function orderReducer(
  state: OrderState | undefined,
  action: Action
): OrderState {
  return _orderReducer(state, action);
}
