import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as DivisionsActions from './divisions.actions';
import { DivisionsApiService } from '../../services/api/divisions-api.service';

@Injectable()
export class DivisionsEffects {
  constructor(
    private actions$: Actions,
    private divisionsApi: DivisionsApiService
  ) {}

  getDivisions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionsActions.getDivisionsRequest),
      switchMap((action) => {
        return this.divisionsApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.divisions) {
                return DivisionsActions.getDivisionsSuccess({
                  divisions: resData.divisions,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return DivisionsActions.getDivisionsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionsActions.getDivisionsFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getDivision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionsActions.getDivisionRequest),
      switchMap((action) => {
        return this.divisionsApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.division) {
              return DivisionsActions.getDivisionSuccess({
                division: resData.division,
              });
            }
            return DivisionsActions.getDivisionFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              DivisionsActions.getDivisionFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateDivision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionsActions.updateDivisionRequest),
      switchMap((action) => {
        return this.divisionsApi
          .update(action.id, {
            status: action.status,
            name: action.name,
            locality: action.locality,
            street: action.street,
            house: action.house,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedDivision) {
                return DivisionsActions.updateDivisionSuccess({
                  division: resData.updatedDivision,
                });
              }
              return DivisionsActions.updateDivisionFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionsActions.updateDivisionFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addDivision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionsActions.addDivisionRequest),
      switchMap((action) => {
        return this.divisionsApi
          .add({
            name: action.name,
            locality: action.locality,
            street: action.street,
            house: action.house,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedDivision) {
                return DivisionsActions.addDivisionSuccess({
                  division: resData.addedDivision,
                });
              }
              return DivisionsActions.addDivisionFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionsActions.addDivisionFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  removeDivision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionsActions.removeDivisionRequest),
      switchMap((action) => {
        return this.divisionsApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedDivision) {
              return DivisionsActions.removeDivisionSuccess({
                division: resData.removedDivision,
              });
            }
            return DivisionsActions.removeDivisionFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              DivisionsActions.removeDivisionFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
