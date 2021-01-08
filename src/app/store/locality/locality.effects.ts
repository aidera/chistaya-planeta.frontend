import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as LocalityActions from './locality.actions';
import { LocalityService } from '../../services/api/locality.service';

@Injectable()
export class LocalityEffects {
  constructor(
    private actions$: Actions,
    private localityApi: LocalityService
  ) {}

  getLocalities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalityActions.getLocalitiesRequest),
      switchMap((action) => {
        return this.localityApi.getAll().pipe(
          map((resData) => {
            if (resData && resData.localities) {
              return LocalityActions.getLocalitiesSuccess({
                localities: resData.localities,
              });
            }
            return LocalityActions.getLocalitiesFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalityActions.getLocalitiesFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
