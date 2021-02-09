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
        return this.localityApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.localities) {
                return LocalityActions.getLocalitiesSuccess({
                  localities: resData.localities,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
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

  getLocality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalityActions.getLocalityRequest),
      switchMap((action) => {
        return this.localityApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.locality) {
              return LocalityActions.getLocalitySuccess({
                locality: resData.locality,
              });
            }
            return LocalityActions.getLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalityActions.getLocalityFailure({
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
      ofType(LocalityActions.updateLocalityRequest),
      switchMap((action) => {
        return this.localityApi
          .update(action.id, { name: action.name, status: action.status })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedLocality) {
                return LocalityActions.updateLocalitySuccess({
                  locality: resData.updatedLocality,
                });
              }
              return LocalityActions.updateLocalityFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                LocalityActions.updateLocalityFailure({
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
      ofType(LocalityActions.addLocalityRequest),
      switchMap((action) => {
        return this.localityApi.add({ name: action.name }).pipe(
          map((resData) => {
            if (resData && resData.addedLocality) {
              return LocalityActions.addLocalitySuccess({
                locality: resData.addedLocality,
              });
            }
            return LocalityActions.addLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalityActions.addLocalityFailure({
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
      ofType(LocalityActions.removeLocalityRequest),
      switchMap((action) => {
        return this.localityApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedLocality) {
              return LocalityActions.removeLocalitySuccess({
                locality: resData.removedLocality,
              });
            }
            return LocalityActions.removeLocalityFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              LocalityActions.removeLocalityFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
