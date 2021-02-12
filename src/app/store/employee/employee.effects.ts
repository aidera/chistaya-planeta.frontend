import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as EmployeeActions from './employee.actions';
import { EmployeeService } from '../../services/api/employee.service';

@Injectable()
export class EmployeeEffects {
  constructor(
    private actions$: Actions,
    private employeeApi: EmployeeService
  ) {}

  getEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.getEmployeesRequest),
      switchMap((action) => {
        return this.employeeApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.employees) {
                return EmployeeActions.getEmployeesSuccess({
                  employees: resData.employees,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return EmployeeActions.getEmployeesFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeeActions.getEmployeesFailure({
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
      ofType(EmployeeActions.getEmployeeRequest),
      switchMap((action) => {
        return this.employeeApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.employee) {
              return EmployeeActions.getEmployeeSuccess({
                employee: resData.employee,
              });
            }
            return EmployeeActions.getEmployeeFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              EmployeeActions.getEmployeeFailure({
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
      ofType(EmployeeActions.updateEmployeeRequest),
      switchMap((action) => {
        return this.employeeApi
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
                return EmployeeActions.updateEmployeeSuccess({
                  employee: resData.updatedEmployee,
                });
              }
              return EmployeeActions.updateEmployeeFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeeActions.updateEmployeeFailure({
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
      ofType(EmployeeActions.addEmployeeRequest),
      switchMap((action) => {
        return this.employeeApi
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
                return EmployeeActions.addEmployeeSuccess({
                  employee: resData.addedEmployee,
                });
              }
              return EmployeeActions.addEmployeeFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                EmployeeActions.addEmployeeFailure({
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
      ofType(EmployeeActions.removeEmployeeRequest),
      switchMap((action) => {
        return this.employeeApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedEmployee) {
              return EmployeeActions.removeEmployeeSuccess({
                employee: resData.removedEmployee,
              });
            }
            return EmployeeActions.removeEmployeeFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              EmployeeActions.removeEmployeeFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
