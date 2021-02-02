import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as OrderActions from './order.actions';
import { OrderService } from '../../services/api/order.service';
import { LocalityService } from '../../services/api/locality.service';

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private orderApi: OrderService,
    private localityApi: LocalityService
  ) {}

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.addOrderRequest),
      switchMap((action) => {
        return this.orderApi
          .add({
            ...action.order,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.createdOrder) {
                return OrderActions.addOrderSuccess();
              }
              return OrderActions.addOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrderActions.addOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );
}
