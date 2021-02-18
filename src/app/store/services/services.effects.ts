import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as ServicesActions from './services.actions';
import { ServicesApiService } from '../../services/api/services-api.service';

@Injectable()
export class ServicesEffects {
  constructor(
    private actions$: Actions,
    private servicesApi: ServicesApiService
  ) {}

  getServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.getServicesRequest),
      switchMap((_) => {
        return this.servicesApi.get().pipe(
          map((resData) => {
            if (resData && resData.services) {
              return ServicesActions.getServicesSuccess({
                services: resData.services,
              });
            }
            return ServicesActions.getServicesFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ServicesActions.getServicesFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.updateServiceRequest),
      switchMap((action) => {
        return this.servicesApi
          .update(action.id, {
            name: action.name,
            description: action.description,
            status: action.status,
            prices: action.prices,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedService) {
                return ServicesActions.updateServiceSuccess({
                  service: resData.updatedService,
                });
              }
              return ServicesActions.updateServiceFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ServicesActions.updateServiceFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.addServiceRequest),
      switchMap((action) => {
        return this.servicesApi
          .add({
            name: action.name,
            description: action.description,
            prices: action.prices,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedService) {
                return ServicesActions.addServiceSuccess({
                  service: resData.addedService,
                });
              }
              return ServicesActions.addServiceFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ServicesActions.addServiceFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  removeService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.removeServiceRequest),
      switchMap((action) => {
        return this.servicesApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedService) {
              return ServicesActions.removeServiceSuccess({
                service: resData.removedService,
              });
            }
            return ServicesActions.removeServiceFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ServicesActions.removeServiceFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
