import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { IEmployee } from '../../models/Employee';
import EmployeeStatus from '../../models/enums/EmployeeStatus';
import EmployeeRole from '../../models/enums/EmployeeRole';

/* --------------------- */
/* --- Get Employees --- */
/* --------------------- */

export const GET_EMPLOYEES_REQUEST = '[employee] get - employees - request';
export const GET_EMPLOYEES_SUCCESS = '[employee] get - employees - success';
export const GET_EMPLOYEES_FAILURE = '[employee] get - employees - failure';

/* -------------------- */
/* --- Get Employee --- */
/* -------------------- */

export const GET_EMPLOYEE_REQUEST = '[employee] get - employee - request';
export const GET_EMPLOYEE_SUCCESS = '[employee] get - employee - success';
export const GET_EMPLOYEE_FAILURE = '[employee] get - employee - failure';

/* ----------------------- */
/* --- Update Employee --- */
/* ----------------------- */

export const UPDATE_EMPLOYEE_REQUEST = '[employee] update - employee - request';
export const UPDATE_EMPLOYEE_SUCCESS = '[employee] update - employee - success';
export const UPDATE_EMPLOYEE_FAILURE = '[employee] update - employee - failure';
export const REFRESH_UPDATE_EMPLOYEE_SUCCESS =
  '[employee] refresh - update employee success';

/* -------------------- */
/* --- Add Employee --- */
/* -------------------- */

export const ADD_EMPLOYEE_REQUEST = '[employee] add - employee - request';
export const ADD_EMPLOYEE_SUCCESS = '[employee] add - employee - success';
export const ADD_EMPLOYEE_FAILURE = '[employee] add - employee - failure';
export const REFRESH_ADD_EMPLOYEE_SUCCESS =
  '[employee] refresh - add employee success';

/* ----------------------- */
/* --- Remove Employee --- */
/* ----------------------- */

export const REMOVE_EMPLOYEE_REQUEST = '[employee] remove - employee - request';
export const REMOVE_EMPLOYEE_SUCCESS = '[employee] remove - employee - success';
export const REMOVE_EMPLOYEE_FAILURE = '[employee] remove - employee - failure';
export const REFRESH_REMOVE_EMPLOYEE_SUCCESS =
  '[employee] refresh - remove employee success';

/* --------------------- */
/* --- Get Employees --- */
/* --------------------- */

export const getEmployeesRequest = createAction(
  GET_EMPLOYEES_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getEmployeesSuccess = createAction(
  GET_EMPLOYEES_SUCCESS,
  props<{
    employees: IEmployee[];
    pagination: PaginationType;
  }>()
);
export const getEmployeesFailure = createAction(
  GET_EMPLOYEES_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------- */
/* --- Get Employee --- */
/* -------------------- */

export const getEmployeeRequest = createAction(
  GET_EMPLOYEE_REQUEST,
  props<{ id: string }>()
);
export const getEmployeeSuccess = createAction(
  GET_EMPLOYEE_SUCCESS,
  props<{
    employee: IEmployee;
  }>()
);
export const getEmployeeFailure = createAction(
  GET_EMPLOYEE_FAILURE,
  props<{ error: ServerError }>()
);

/* ----------------------- */
/* --- Update Employee --- */
/* ----------------------- */

export const updateEmployeeRequest = createAction(
  UPDATE_EMPLOYEE_REQUEST,
  props<{
    id: string;
    status?: EmployeeStatus;
    role?: EmployeeRole;
    name?: string;
    surname?: string;
    patronymic?: string;
    phone?: string;
    email?: string;
    division?: string;
    locality?: string;
    cars?: string[];
  }>()
);
export const updateEmployeeSuccess = createAction(
  UPDATE_EMPLOYEE_SUCCESS,
  props<{
    employee: IEmployee;
  }>()
);
export const updateEmployeeFailure = createAction(
  UPDATE_EMPLOYEE_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshUpdateEmployeeSucceed = createAction(
  REFRESH_UPDATE_EMPLOYEE_SUCCESS
);

/* -------------------- */
/* --- Add Employee --- */
/* -------------------- */

export const addEmployeeRequest = createAction(
  ADD_EMPLOYEE_REQUEST,
  props<{
    role: EmployeeRole;
    name: string;
    surname: string;
    patronymic?: string;
    phone: string;
    email: string;
    division: string;
    locality: string;
    cars?: string[];
  }>()
);
export const addEmployeeSuccess = createAction(
  ADD_EMPLOYEE_SUCCESS,
  props<{ employee: IEmployee }>()
);
export const addEmployeeFailure = createAction(
  ADD_EMPLOYEE_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshAddEmployeeSucceed = createAction(
  REFRESH_ADD_EMPLOYEE_SUCCESS
);

/* ----------------------- */
/* --- Remove Employee --- */
/* ----------------------- */

export const removeEmployeeRequest = createAction(
  REMOVE_EMPLOYEE_REQUEST,
  props<{ id: string }>()
);
export const removeEmployeeSuccess = createAction(
  REMOVE_EMPLOYEE_SUCCESS,
  props<{
    employee: IEmployee;
  }>()
);
export const removeEmployeeFailure = createAction(
  REMOVE_EMPLOYEE_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshRemoveEmployeeSucceed = createAction(
  REFRESH_REMOVE_EMPLOYEE_SUCCESS
);
