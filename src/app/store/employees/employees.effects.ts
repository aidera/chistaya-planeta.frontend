import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as EmployeesActions from './employees.actions';
import { EmployeesApiService } from '../../services/api/employees-api.service';

@Injectable()
export class EmployeesEffects {
  constructor(
    private actions$: Actions,
    private employeesApi: EmployeesApiService
  ) {}

  getEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.getEmployeesRequest),
      switchMap((action) => {
        return this.employeesApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.employees) {
                return EmployeesActions.getEmployeesSuccess({
                  employees: resData.employees,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return EmployeesActions.getEmployeesFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeesActions.getEmployeesFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.getEmployeeRequest),
      switchMap((action) => {
        return this.employeesApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.employee) {
              return EmployeesActions.getEmployeeSuccess({
                employee: resData.employee,
              });
            }
            return EmployeesActions.getEmployeeFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              EmployeesActions.getEmployeeFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.updateEmployeeRequest),
      switchMap((action) => {
        return this.employeesApi
          .update(action.id, {
            status: action.status,
            email: action.email,
            division: action.division,
            locality: action.locality,
            cars: action.cars,
            name: action.name,
            phone: action.phone,
            patronymic: action.patronymic,
            role: action.role,
            surname: action.surname,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedEmployee) {
                return EmployeesActions.updateEmployeeSuccess({
                  employee: resData.updatedEmployee,
                });
              }
              return EmployeesActions.updateEmployeeFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeesActions.updateEmployeeFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.addEmployeeRequest),
      switchMap((action) => {
        return this.employeesApi
          .add({
            surname: action.surname,
            role: action.role,
            patronymic: action.patronymic,
            phone: action.phone,
            name: action.name,
            cars: action.cars,
            locality: action.locality,
            division: action.division,
            email: action.email,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedEmployee) {
                return EmployeesActions.addEmployeeSuccess({
                  employee: resData.addedEmployee,
                });
              }
              return EmployeesActions.addEmployeeFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeesActions.addEmployeeFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  removeEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.removeEmployeeRequest),
      switchMap((action) => {
        return this.employeesApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedEmployee) {
              return EmployeesActions.removeEmployeeSuccess({
                employee: resData.removedEmployee,
              });
            }
            return EmployeesActions.removeEmployeeFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              EmployeesActions.removeEmployeeFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
