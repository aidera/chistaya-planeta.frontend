import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AppActions from '../app/app.actions';
import { DivisionsApiService } from '../../services/api/divisions-api.service';
import { LocalitiesApiService } from '../../services/api/localities-api.service';
import { CarsApiService } from '../../services/api/cars-api.service';
import { EmployeesApiService } from '../../services/api/employees-api.service';
import { OffersApiService } from '../../services/api/offers-api.service';
import { ServicesApiService } from '../../services/api/services-api.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private localitiesApi: LocalitiesApiService,
    private divisionsApi: DivisionsApiService,
    private carsApi: CarsApiService,
    private employeesApi: EmployeesApiService,
    private offersApi: OffersApiService,
    private servicesApi: ServicesApiService
  ) {}

  getLocalitiesToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getLocalitiesToSelectRequest),
      switchMap((_) => {
        return this.localitiesApi.getAllLessInfo().pipe(
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
      switchMap((_) => {
        return this.divisionsApi.getAllLessInfo().pipe(
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

  getCarsToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCarsToSelectRequest),
      switchMap((_) => {
        return this.carsApi.getAllLessInfo().pipe(
          map((resData) => {
            if (resData && resData.cars) {
              return AppActions.getCarsToSelectSuccess({
                cars: resData.cars,
              });
            }
            return AppActions.getCarsToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getCarsToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  getEmployeesToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getEmployeesToSelectRequest),
      switchMap((_) => {
        return this.employeesApi.getAllLessInfo().pipe(
          map((resData) => {
            if (resData && resData.employees) {
              return AppActions.getEmployeesToSelectSuccess({
                employees: resData.employees,
              });
            }
            return AppActions.getEmployeesToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getEmployeesToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  getOffersToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getOffersToSelectRequest),
      switchMap((_) => {
        return this.offersApi.getAllLessInfo().pipe(
          map((resData) => {
            if (resData && resData.offers) {
              return AppActions.getOffersToSelectSuccess({
                offers: resData.offers,
              });
            }
            return AppActions.getOffersToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getOffersToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  getServicesToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getServicesToSelectRequest),
      switchMap((_) => {
        return this.servicesApi.getAllLessInfo().pipe(
          map((resData) => {
            if (resData && resData.services) {
              return AppActions.getServicesToSelectSuccess({
                services: resData.services,
              });
            }
            return AppActions.getServicesToSelectFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              AppActions.getServicesToSelectFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
