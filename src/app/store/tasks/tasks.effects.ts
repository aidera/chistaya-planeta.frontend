import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as TasksActions from './tasks.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';

@Injectable()
export class TasksEffects {
  constructor(private actions$: Actions, private ordersApi: OrdersApiService) {}

  getTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.getTasksRequest),
      switchMap(() => {
        return this.ordersApi.getAllLessInfo().pipe(
          map((resData) => {
            if (resData && resData.orders) {
              return TasksActions.getTasksSuccess({
                tasks: resData.orders,
              });
            }
            return TasksActions.getTasksFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              TasksActions.getTasksFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
