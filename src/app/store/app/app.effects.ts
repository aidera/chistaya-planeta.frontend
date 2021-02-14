import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AppActions from '../app/app.actions';
import { DivisionService } from '../../services/api/division.service';
import { LocalityService } from '../../services/api/locality.service';
import { CarService } from '../../services/api/car.service';
import { EmployeeService } from '../../services/api/employee.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private localityApi: LocalityService,
    private divisionApi: DivisionService,
    private carApi: CarService,
    private employeesApi: EmployeeService
  ) {}

  getLocalitiesToSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getLocalitiesToSelectRequest),
      switchMap((_) => {
        return this.localityApi.getAllLessInfo().pipe(
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
        return this.divisionApi.getAllLessInfo().pipe(
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
        return this.carApi.getAllLessInfo().pipe(
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
}
