import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { OrdersState } from './orders.reducer';

export const selectAll = (state: State) => state.orders;

export const selectAddOrderIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderIsFetching
);

export const selectAddOrderError = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderError
);

export const selectAddOrderSucceed = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderSucceed
);
