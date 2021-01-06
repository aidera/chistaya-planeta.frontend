import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { OrderState } from './order.reducer';

export const selectAll = (state: State) => state.order;

export const selectAddOrderIsFetching = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderIsFetching
);

export const selectAddOrderError = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderError
);

export const selectAddOrderSucceed = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderSucceed
);

export const selectAddOrderLocalities = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderLocalities
);

export const selectAddOrderLocalitiesIsFetching = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderLocalitiesIsFetching
);

export const selectAddOrderLocalitiesError = createSelector(
  selectAll,
  (state: OrderState) => state.addOrderLocalitiesError
);
