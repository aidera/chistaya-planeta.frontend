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

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderRequest),
      switchMap((action) => {
        return this.ordersApi.update(action.id, action.fields).pipe(
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

  setOrderManagerAssign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderManagerAssignRequest),
      switchMap((action) => {
        return this.ordersApi
          .setOrderManagerAssign(action.id, action.manager)
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

  setOrderManagerAccept$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderManagerAcceptRequest),
      switchMap((action) => {
        return this.ordersApi.setOrderManagerAccept(action.id).pipe(
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

  setOrderDriverAssign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderDriverAssignRequest),
      switchMap((action) => {
        return this.ordersApi
          .setOrderDriverAssign(action.id, action.driver)
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

  setOrderDriverAccept$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderDriverAcceptRequest),
      switchMap((action) => {
        return this.ordersApi.setOrderDriverAccept(action.id).pipe(
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
