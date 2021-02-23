import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private ordersApi: OrdersApiService) {}

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.getOrdersRequest),
      switchMap((action) => {
        return this.ordersApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.orders) {
                return OrdersActions.getOrdersSuccess({
                  orders: resData.orders,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return OrdersActions.getOrdersFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.getOrdersFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.getOrderRequest),
      switchMap((action) => {
        return this.ordersApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.order) {
              return OrdersActions.getOrderSuccess({
                order: resData.order,
              });
            }
            return OrdersActions.getOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.getOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderStatusRequest),
      switchMap((action) => {
        return this.ordersApi.updateStatus(action.id, action.status).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderClientManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderClientManagerRequest),
      switchMap((action) => {
        return this.ordersApi
          .assignClientManager(action.id, action.manager)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  acceptOrderClientManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderClientManagerRequest),
      switchMap((action) => {
        return this.ordersApi.acceptClientManager(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderReceivingManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderReceivingManagerRequest),
      switchMap((action) => {
        return this.ordersApi
          .assignReceivingManager(action.id, action.manager)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  acceptOrderReceivingManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderReceivingManagerRequest),
      switchMap((action) => {
        return this.ordersApi.acceptReceivingManager(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderDriver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderDriverRequest),
      switchMap((action) => {
        return this.ordersApi.assignDriver(action.id, action.driver).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  acceptOrderDriver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderDriverRequest),
      switchMap((action) => {
        return this.ordersApi.acceptDriver(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.addOrderRequest),
      switchMap((action) => {
        return this.ordersApi.add(action.order).pipe(
          map((resData) => {
            if (resData && resData.addedOrder) {
              return OrdersActions.addOrderSuccess({
                order: resData.addedOrder,
              });
            }
            return OrdersActions.addOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.addOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  removeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.removeOrderRequest),
      switchMap((action) => {
        return this.ordersApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedOrder) {
              return OrdersActions.removeOrderSuccess({
                order: resData.removedOrder,
              });
            }
            return OrdersActions.removeOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.removeOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
