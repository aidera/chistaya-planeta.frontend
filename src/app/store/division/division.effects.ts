import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as DivisionActions from './division.actions';
import { DivisionService } from '../../services/api/division.service';

@Injectable()
export class DivisionEffects {
  constructor(
    private actions$: Actions,
    private divisionApi: DivisionService
  ) {}

  getDivisions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisionActions.getDivisionsRequest),
      switchMap((action) => {
        return this.divisionApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.divisions) {
                return DivisionActions.getDivisionsSuccess({
                  divisions: resData.divisions,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return DivisionActions.getDivisionsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionActions.getDivisionsFailure({
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
      ofType(DivisionActions.getDivisionRequest),
      switchMap((action) => {
        return this.divisionApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.division) {
              return DivisionActions.getDivisionSuccess({
                division: resData.division,
              });
            }
            return DivisionActions.getDivisionFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              DivisionActions.getDivisionFailure({
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
      ofType(DivisionActions.updateDivisionRequest),
      switchMap((action) => {
        return this.divisionApi
          .update(action.id, {
            status: action.status,
            name: action.name,
            localityId: action.localityId,
            street: action.street,
            house: action.house,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedDivision) {
                return DivisionActions.updateDivisionSuccess({
                  division: resData.updatedDivision,
                });
              }
              return DivisionActions.updateDivisionFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionActions.updateDivisionFailure({
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
      ofType(DivisionActions.addDivisionRequest),
      switchMap((action) => {
        return this.divisionApi
          .add({
            name: action.name,
            localityId: action.localityId,
            street: action.street,
            house: action.house,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedDivision) {
                return DivisionActions.addDivisionSuccess({
                  division: resData.addedDivision,
                });
              }
              return DivisionActions.addDivisionFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                DivisionActions.addDivisionFailure({
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
      ofType(DivisionActions.removeDivisionRequest),
      switchMap((action) => {
        return this.divisionApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedDivision) {
              return DivisionActions.removeDivisionSuccess({
                division: resData.removedDivision,
              });
            }
            return DivisionActions.removeDivisionFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              DivisionActions.removeDivisionFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
