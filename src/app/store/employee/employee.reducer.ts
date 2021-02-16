import { Action, createReducer, on } from '@ngrx/store';

import * as EmployeeActions from './employee.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IEmployee } from '../../models/Employee';

export const employeeInitialState = {
  employees: null as IEmployee[] | null,

  getEmployeesIsFetching: false,
  getEmployeesError: null as ServerError | null,
  getEmployeesPagination: null as PaginationType | null,

  employee: null as IEmployee | null,

  getEmployeeIsFetching: false,
  getEmployeeError: null as ServerError | null,

  updateEmployeeIsFetching: false,
  updateEmployeeError: null as ServerError | null,
  updateEmployeeSucceed: false as boolean,

  addEmployeeIsFetching: false,
  addEmployeeError: null as ServerError | null,
  addEmployeeSucceed: false as boolean,

  removeEmployeeIsFetching: false,
  removeEmployeeError: null as ServerError | null,
  removeEmployeeSucceed: false as boolean,
};
export type EmployeeState = typeof employeeInitialState;

const _employeeReducer = createReducer(
  employeeInitialState,

  /* --------------------- */
  /* --- Get Employees --- */
  /* --------------------- */

  on(EmployeeActions.getEmployeesRequest, (state, payload) => ({
    ...state,
    getEmployeesIsFetching: payload.withLoading,
    getEmployeesError: null,
  })),
  on(EmployeeActions.getEmployeesSuccess, (state, payload) => ({
    ...state,
    employees: payload.employees,
    getEmployeesIsFetching: false,
    getEmployeesError: null,
    getEmployeesPagination: payload.pagination,
  })),
  on(EmployeeActions.getEmployeesFailure, (state, payload) => ({
    ...state,
    getEmployeesIsFetching: false,
    getEmployeesError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Employee --- */
  /* -------------------- */

  on(EmployeeActions.getEmployeeRequest, (state, payload) => ({
    ...state,
    employee: null,
    getEmployeeIsFetching: payload.withLoading,
    getEmployeeError: null,
  })),
  on(EmployeeActions.getEmployeeSuccess, (state, payload) => ({
    ...state,
    employee: payload.employee,
    getEmployeeIsFetching: false,
    getEmployeeError: null,
  })),
  on(EmployeeActions.getEmployeeFailure, (state, payload) => ({
    ...state,
    getEmployeeIsFetching: false,
    getEmployeeError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Employee --- */
  /* ----------------------- */

  on(EmployeeActions.updateEmployeeRequest, (state) => ({
    ...state,
    updateEmployeeIsFetching: true,
    updateEmployeeError: null,
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, payload) => ({
    ...state,
    employee: payload.employee,
    updateEmployeeIsFetching: false,
    updateEmployeeError: null,
    updateEmployeeSucceed: true,
  })),
  on(EmployeeActions.updateEmployeeFailure, (state, payload) => ({
    ...state,
    updateEmployeeIsFetching: false,
    updateEmployeeError: payload.error,
  })),
  on(EmployeeActions.refreshUpdateEmployeeSucceed, (state) => ({
    ...state,
    updateEmployeeSucceed: false,
  })),
  on(EmployeeActions.refreshUpdateEmployeeFailure, (state) => ({
    ...state,
    updateEmployeeError: null,
  })),

  /* -------------------- */
  /* --- Add Employee --- */
  /* -------------------- */

  on(EmployeeActions.addEmployeeRequest, (state) => ({
    ...state,
    addEmployeeIsFetching: true,
    addEmployeeError: null,
  })),
  on(EmployeeActions.addEmployeeSuccess, (state) => ({
    ...state,
    addEmployeeIsFetching: false,
    addEmployeeError: null,
    addEmployeeSucceed: true,
  })),
  on(EmployeeActions.addEmployeeFailure, (state, payload) => ({
    ...state,
    addEmployeeIsFetching: false,
    addEmployeeError: payload.error,
  })),
  on(EmployeeActions.refreshAddEmployeeSucceed, (state) => ({
    ...state,
    addEmployeeSucceed: false,
  })),
  on(EmployeeActions.refreshAddEmployeeFailure, (state) => ({
    ...state,
    addEmployeeError: null,
  })),

  /* ----------------------- */
  /* --- Remove Employee --- */
  /* ----------------------- */

  on(EmployeeActions.removeEmployeeRequest, (state) => ({
    ...state,
    removeEmployeeIsFetching: true,
    removeEmployeeError: null,
  })),
  on(EmployeeActions.removeEmployeeSuccess, (state) => ({
    ...state,
    removeEmployeeIsFetching: false,
    removeEmployeeError: null,
    removeEmployeeSucceed: true,
  })),
  on(EmployeeActions.removeEmployeeFailure, (state, payload) => ({
    ...state,
    removeEmployeeIsFetching: false,
    removeEmployeeError: payload.error,
  })),
  on(EmployeeActions.refreshRemoveEmployeeSucceed, (state) => ({
    ...state,
    removeEmployeeSucceed: false,
  })),
  on(EmployeeActions.refreshRemoveEmployeeFailure, (state) => ({
    ...state,
    removeEmployeeError: null,
  }))
);

export function employeeReducer(
  state: EmployeeState | undefined,
  action: Action
): EmployeeState {
  return _employeeReducer(state, action);
}
