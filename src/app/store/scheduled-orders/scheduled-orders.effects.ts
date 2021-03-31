import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as ScheduledOrdersActions from './scheduled-orders.actions';
import { ScheduledOrdersApiService } from '../../services/api/scheduled-orders-api.service';

@Injectable()
export class ScheduledOrdersEffects {
  constructor(
    private actions$: Actions,
    private scheduledOrdersApi: ScheduledOrdersApiService
  ) {}

  getScheduledOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.getScheduledOrdersRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.scheduledOrders) {
                return ScheduledOrdersActions.getScheduledOrdersSuccess({
                  scheduledOrders: resData.scheduledOrders,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return ScheduledOrdersActions.getScheduledOrdersFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ScheduledOrdersActions.getScheduledOrdersFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getScheduledOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.getScheduledOrderRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.scheduledOrder) {
              return ScheduledOrdersActions.getScheduledOrderSuccess({
                scheduledOrder: resData.scheduledOrder,
              });
            }
            return ScheduledOrdersActions.getScheduledOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ScheduledOrdersActions.getScheduledOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateScheduledOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.updateScheduledOrderRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi.update(action.id, action.fields).pipe(
          map((resData) => {
            if (resData && resData.updatedScheduledOrder) {
              return ScheduledOrdersActions.updateScheduledOrderSuccess({
                scheduledOrder: resData.updatedScheduledOrder,
              });
            }
            return ScheduledOrdersActions.updateScheduledOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ScheduledOrdersActions.updateScheduledOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateScheduledOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.updateScheduledOrderStatusRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi
          .updateStatus(action.id, action.status)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedScheduledOrder) {
                return ScheduledOrdersActions.updateScheduledOrderSuccess({
                  scheduledOrder: resData.updatedScheduledOrder,
                });
              }
              return ScheduledOrdersActions.updateScheduledOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ScheduledOrdersActions.updateScheduledOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addScheduledOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.addScheduledOrderRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi.add(action.scheduledOrder).pipe(
          map((resData) => {
            if (resData && resData.addedScheduledOrder) {
              return ScheduledOrdersActions.addScheduledOrderSuccess({
                scheduledOrder: resData.addedScheduledOrder,
              });
            }
            return ScheduledOrdersActions.addScheduledOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ScheduledOrdersActions.addScheduledOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  removeScheduledOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduledOrdersActions.removeScheduledOrderRequest),
      switchMap((action) => {
        return this.scheduledOrdersApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedScheduledOrder) {
              return ScheduledOrdersActions.removeScheduledOrderSuccess({
                scheduledOrder: resData.removedScheduledOrder,
              });
            }
            return ScheduledOrdersActions.removeScheduledOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ScheduledOrdersActions.removeScheduledOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
