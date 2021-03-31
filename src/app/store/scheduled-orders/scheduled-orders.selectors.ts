import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { ScheduledOrdersState } from './scheduled-orders.reducer';

export const selectAll = (state: State) => state.scheduledOrders;

export const selectScheduledOrders = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.scheduledOrders
);

export const selectGetScheduledOrdersIsFetching = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.getScheduledOrdersIsFetching
);

export const selectGetScheduledOrdersPagination = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.getScheduledOrdersPagination
);

export const selectGetScheduledOrdersError = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.getScheduledOrdersError
);

export const selectScheduledOrder = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.scheduledOrder
);

export const selectGetScheduledOrderIsFetching = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.getScheduledOrderIsFetching
);

export const selectGetScheduledOrderError = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.getScheduledOrderError
);

export const selectUpdateScheduledOrderIsFetching = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.updateScheduledOrderIsFetching
);

export const selectUpdateScheduledOrderError = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.updateScheduledOrderError
);

export const selectUpdateScheduledOrderSucceed = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.updateScheduledOrderSucceed
);

export const selectAddScheduledOrderIsFetching = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.addScheduledOrderIsFetching
);

export const selectAddScheduledOrderSucceed = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.addScheduledOrderSucceed
);

export const selectAddScheduledOrderError = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.addScheduledOrderError
);

export const selectRemoveScheduledOrderIsFetching = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.removeScheduledOrderIsFetching
);

export const selectRemoveScheduledOrderSucceed = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.removeScheduledOrderSucceed
);

export const selectRemoveScheduledOrderError = createSelector(
  selectAll,
  (state: ScheduledOrdersState) => state.removeScheduledOrderError
);
