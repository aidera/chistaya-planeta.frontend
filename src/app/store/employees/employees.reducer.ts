import { Action, createReducer, on } from '@ngrx/store';

import * as EmployeesActions from './employees.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IEmployee } from '../../models/Employee';

export const employeesInitialState = {
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
export type EmployeesState = typeof employeesInitialState;

const _employeesReducer = createReducer(
  employeesInitialState,

  /* --------------------- */
  /* --- Get Employees --- */
  /* --------------------- */

  on(EmployeesActions.getEmployeesRequest, (state, payload) => ({
    ...state,
    getEmployeesIsFetching: payload.withLoading,
    getEmployeesError: null,
  })),
  on(EmployeesActions.getEmployeesSuccess, (state, payload) => ({
    ...state,
    employees: payload.employees,
    getEmployeesIsFetching: false,
    getEmployeesError: null,
    getEmployeesPagination: payload.pagination,
  })),
  on(EmployeesActions.getEmployeesFailure, (state, payload) => ({
    ...state,
    getEmployeesIsFetching: false,
    getEmployeesError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Employee --- */
  /* -------------------- */

  on(EmployeesActions.getEmployeeRequest, (state, payload) => ({
    ...state,
    employee: null,
    getEmployeeIsFetching: payload.withLoading,
    getEmployeeError: null,
  })),
  on(EmployeesActions.getEmployeeSuccess, (state, payload) => ({
    ...state,
    employee: payload.employee,
    getEmployeeIsFetching: false,
    getEmployeeError: null,
  })),
  on(EmployeesActions.getEmployeeFailure, (state, payload) => ({
    ...state,
    getEmployeeIsFetching: false,
    getEmployeeError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Employee --- */
  /* ----------------------- */

  on(EmployeesActions.updateEmployeeRequest, (state) => ({
    ...state,
    updateEmployeeIsFetching: true,
    updateEmployeeError: null,
  })),
  on(EmployeesActions.updateEmployeeSuccess, (state, payload) => ({
    ...state,
    employee: payload.employee,
    updateEmployeeIsFetching: false,
    updateEmployeeError: null,
    updateEmployeeSucceed: true,
  })),
  on(EmployeesActions.updateEmployeeFailure, (state, payload) => ({
    ...state,
    updateEmployeeIsFetching: false,
    updateEmployeeError: payload.error,
  })),
  on(EmployeesActions.refreshUpdateEmployeeSucceed, (state) => ({
    ...state,
    updateEmployeeSucceed: false,
  })),
  on(EmployeesActions.refreshUpdateEmployeeFailure, (state) => ({
    ...state,
    updateEmployeeError: null,
  })),

  /* -------------------- */
  /* --- Add Employee --- */
  /* -------------------- */

  on(EmployeesActions.addEmployeeRequest, (state) => ({
    ...state,
    addEmployeeIsFetching: true,
    addEmployeeError: null,
  })),
  on(EmployeesActions.addEmployeeSuccess, (state) => ({
    ...state,
    addEmployeeIsFetching: false,
    addEmployeeError: null,
    addEmployeeSucceed: true,
  })),
  on(EmployeesActions.addEmployeeFailure, (state, payload) => ({
    ...state,
    addEmployeeIsFetching: false,
    addEmployeeError: payload.error,
  })),
  on(EmployeesActions.refreshAddEmployeeSucceed, (state) => ({
    ...state,
    addEmployeeSucceed: false,
  })),
  on(EmployeesActions.refreshAddEmployeeFailure, (state) => ({
    ...state,
    addEmployeeError: null,
  })),

  /* ----------------------- */
  /* --- Remove Employee --- */
  /* ----------------------- */

  on(EmployeesActions.removeEmployeeRequest, (state) => ({
    ...state,
    removeEmployeeIsFetching: true,
    removeEmployeeError: null,
  })),
  on(EmployeesActions.removeEmployeeSuccess, (state) => ({
    ...state,
    removeEmployeeIsFetching: false,
    removeEmployeeError: null,
    removeEmployeeSucceed: true,
  })),
  on(EmployeesActions.removeEmployeeFailure, (state, payload) => ({
    ...state,
    removeEmployeeIsFetching: false,
    removeEmployeeError: payload.error,
  })),
  on(EmployeesActions.refreshRemoveEmployeeSucceed, (state) => ({
    ...state,
    removeEmployeeSucceed: false,
  })),
  on(EmployeesActions.refreshRemoveEmployeeFailure, (state) => ({
    ...state,
    removeEmployeeError: null,
  }))
);

export function employeesReducer(
  state: EmployeesState | undefined,
  action: Action
): EmployeesState {
  return _employeesReducer(state, action);
}
