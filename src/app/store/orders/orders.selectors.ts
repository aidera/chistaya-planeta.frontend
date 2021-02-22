import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { OrdersState } from './orders.reducer';

export const selectAll = (state: State) => state.orders;

export const selectOrders = createSelector(
  selectAll,
  (state: OrdersState) => state.orders
);

export const selectGetOrdersIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.getOrdersIsFetching
);

export const selectGetOrdersPagination = createSelector(
  selectAll,
  (state: OrdersState) => state.getOrdersPagination
);

export const selectGetOrdersError = createSelector(
  selectAll,
  (state: OrdersState) => state.getOrdersError
);

export const selectOrder = createSelector(
  selectAll,
  (state: OrdersState) => state.order
);

export const selectGetOrderIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.getOrderIsFetching
);

export const selectGetOrderError = createSelector(
  selectAll,
  (state: OrdersState) => state.getOrderError
);

export const selectUpdateOrderIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.updateOrderIsFetching
);

export const selectUpdateOrderError = createSelector(
  selectAll,
  (state: OrdersState) => state.updateOrderError
);

export const selectUpdateOrderSucceed = createSelector(
  selectAll,
  (state: OrdersState) => state.updateOrderSucceed
);

export const selectAddOrderIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderIsFetching
);

export const selectAddOrderSucceed = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderSucceed
);

export const selectAddOrderError = createSelector(
  selectAll,
  (state: OrdersState) => state.addOrderError
);

export const selectRemoveOrderIsFetching = createSelector(
  selectAll,
  (state: OrdersState) => state.removeOrderIsFetching
);

export const selectRemoveOrderSucceed = createSelector(
  selectAll,
  (state: OrdersState) => state.removeOrderSucceed
);

export const selectRemoveOrderError = createSelector(
  selectAll,
  (state: OrdersState) => state.removeOrderError
);
