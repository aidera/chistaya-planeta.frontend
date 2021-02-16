import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as LocalitiesActions from './localities.actions';
import { LocalitiesApiService } from '../../services/api/localities-api.service';

@Injectable()
export class LocalitiesEffects {
  constructor(
    private actions$: Actions,
    private localitiesApi: LocalitiesApiService
  ) {}

  getLocalities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActions.getLocalitiesRequest),
      switchMap((action) => {
        return this.localitiesApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.localities) {
                return LocalitiesActions.getLocalitiesSuccess({
                  localities: resData.localities,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return LocalitiesActions.getLocalitiesFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                LocalitiesActions.getLocalitiesFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getLocality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActions.getLocalityRequest),
      switchMap((action) => {
        return this.localitiesApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.locality) {
              return LocalitiesActions.getLocalitySuccess({
                locality: resData.locality,
              });
            }
            return LocalitiesActions.getLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalitiesActions.getLocalityFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateLocality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActions.updateLocalityRequest),
      switchMap((action) => {
        return this.localitiesApi
          .update(action.id, { name: action.name, status: action.status })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedLocality) {
                return LocalitiesActions.updateLocalitySuccess({
                  locality: resData.updatedLocality,
                });
              }
              return LocalitiesActions.updateLocalityFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                LocalitiesActions.updateLocalityFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addLocality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActions.addLocalityRequest),
      switchMap((action) => {
        return this.localitiesApi.add({ name: action.name }).pipe(
          map((resData) => {
            if (resData && resData.addedLocality) {
              return LocalitiesActions.addLocalitySuccess({
                locality: resData.addedLocality,
              });
            }
            return LocalitiesActions.addLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalitiesActions.addLocalityFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  removeLocality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActions.removeLocalityRequest),
      switchMap((action) => {
        return this.localitiesApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedLocality) {
              return LocalitiesActions.removeLocalitySuccess({
                locality: resData.removedLocality,
              });
            }
            return LocalitiesActions.removeLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalitiesActions.removeLocalityFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
