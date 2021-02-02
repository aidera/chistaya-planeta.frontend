import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AppActions from '../app/app.actions';
import { DivisionService } from '../../services/api/division.service';
import { LocalityService } from '../../services/api/locality.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private localityApi: LocalityService,
    private divisionApi: DivisionService
  ) {}

  getLocalitiesToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getLocalitiesToSelectRequest),
      switchMap((action) => {
        return this.localityApi.getAll().pipe(
          map((resData) => {
            if (resData && resData.localities) {
              return AppActions.getLocalitiesToSelectSuccess({
                localities: resData.localities,
              });
            }
            return AppActions.getLocalitiesToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getLocalitiesToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  getDivisionsToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getDivisionsToSelectRequest),
      switchMap((action) => {
        return this.divisionApi.getAll().pipe(
          map((resData) => {
            if (resData && resData.divisions) {
              return AppActions.getDivisionsToSelectSuccess({
                divisions: resData.divisions,
              });
            }
            return AppActions.getDivisionsToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getDivisionsToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
