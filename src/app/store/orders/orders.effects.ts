import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private ordersApi: OrdersApiService) {}

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.addOrderRequest),
      switchMap((action) => {
        return this.ordersApi
          .add({
            ...action.order,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.createdOrder) {
                return OrdersActions.addOrderSuccess();
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
}
