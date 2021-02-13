import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocalityLessInfo } from '../../models/Locality';
import { IDivisionLessInfo } from '../../models/Division';
import { IEmployeeLessInfo } from '../../models/Employee';
import { ICarLessInfo } from '../../models/Car';

export const SET_IS_FULLSCREEN_MENU_OPEN =
  '[app] set - is fullscreen menu open';

export const GET_LOCALITIES_TO_SELECT_REQUEST =
  '[app] get - localities to select - request';
export const GET_LOCALITIES_TO_SELECT_SUCCESS =
  '[app] get - localities to select - success';
export const GET_LOCALITIES_TO_SELECT_FAILURE =
  '[app] get - localities to select - failure';

export const GET_DIVISIONS_TO_SELECT_REQUEST =
  '[app] get - divisions to select - request';
export const GET_DIVISIONS_TO_SELECT_SUCCESS =
  '[app] get - divisions to select - success';
export const GET_DIVISIONS_TO_SELECT_FAILURE =
  '[app] get - divisions to select - failure';

export const GET_CARS_TO_SELECT_REQUEST =
  '[app] get - cars to select - request';
export const GET_CARS_TO_SELECT_SUCCESS =
  '[app] get - cars to select - success';
export const GET_CARS_TO_SELECT_FAILURE =
  '[app] get - cars to select - failure';

export const GET_MANAGERS_TO_SELECT_REQUEST =
  '[app] get - managers to select - request';
export const GET_MANAGERS_TO_SELECT_SUCCESS =
  '[app] get - managers to select - success';
export const GET_MANAGERS_TO_SELECT_FAILURE =
  '[app] get - managers to select - failure';

export const GET_DRIVERS_TO_SELECT_REQUEST =
  '[app] get - drivers to select - request';
export const GET_DRIVERS_TO_SELECT_SUCCESS =
  '[app] get - drivers to select - success';
export const GET_DRIVERS_TO_SELECT_FAILURE =
  '[app] get - drivers to select - failure';

export const GET_EMPLOYEES_TO_SELECT_REQUEST =
  '[app] get - employees to select - request';
export const GET_EMPLOYEES_TO_SELECT_SUCCESS =
  '[app] get - employees to select - success';
export const GET_EMPLOYEES_TO_SELECT_FAILURE =
  '[app] get - employees to select - failure';

/* ---------------------------- */
/* ------ Main interface ------ */
/* ---------------------------- */

export const setIsFullscreenMenuOpen = createAction(
  SET_IS_FULLSCREEN_MENU_OPEN,
  props<{ isOpen: boolean }>()
);

/* ---------------------------------- */
/* ------ Localities to select ------ */
/* ---------------------------------- */

export const getLocalitiesToSelectRequest = createAction(
  GET_LOCALITIES_TO_SELECT_REQUEST
);
export const getLocalitiesToSelectSuccess = createAction(
  GET_LOCALITIES_TO_SELECT_SUCCESS,
  props<{
    localities: ILocalityLessInfo[];
  }>()
);
export const getLocalitiesToSelectFailure = createAction(
  GET_LOCALITIES_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* --------------------------------- */
/* ------ Divisions to select ------ */
/* --------------------------------- */

export const getDivisionsToSelectRequest = createAction(
  GET_DIVISIONS_TO_SELECT_REQUEST
);
export const getDivisionsToSelectSuccess = createAction(
  GET_DIVISIONS_TO_SELECT_SUCCESS,
  props<{
    divisions: IDivisionLessInfo[];
  }>()
);
export const getDivisionsToSelectFailure = createAction(
  GET_DIVISIONS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* ---------------------------- */
/* ------ Cars to select ------ */
/* ---------------------------- */

export const getCarsToSelectRequest = createAction(GET_CARS_TO_SELECT_REQUEST);
export const getCarsToSelectSuccess = createAction(
  GET_CARS_TO_SELECT_SUCCESS,
  props<{
    cars: ICarLessInfo[];
  }>()
);
export const getCarsToSelectFailure = createAction(
  GET_CARS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------------------- */
/* ------ Managers to select ------ */
/* -------------------------------- */

export const getManagersToSelectRequest = createAction(
  GET_MANAGERS_TO_SELECT_REQUEST
);
export const getManagersToSelectSuccess = createAction(
  GET_MANAGERS_TO_SELECT_SUCCESS,
  props<{
    managers: IEmployeeLessInfo[];
  }>()
);
export const getManagersToSelectFailure = createAction(
  GET_MANAGERS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------------------- */
/* ------ Drivers to select ------ */
/* ------------------------------- */

export const getDriversToSelectRequest = createAction(
  GET_DRIVERS_TO_SELECT_REQUEST
);
export const getDriversToSelectSuccess = createAction(
  GET_DRIVERS_TO_SELECT_SUCCESS,
  props<{
    drivers: IEmployeeLessInfo[];
  }>()
);
export const getDriversToSelectFailure = createAction(
  GET_DRIVERS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------------------- */
/* ------ Employees to select ------ */
/* ------------------------------- */

export const getEmployeesToSelectRequest = createAction(
  GET_EMPLOYEES_TO_SELECT_REQUEST
);
export const getEmployeesToSelectSuccess = createAction(
  GET_EMPLOYEES_TO_SELECT_SUCCESS,
  props<{
    employees: IEmployeeLessInfo[];
  }>()
);
export const getEmployeesToSelectFailure = createAction(
  GET_EMPLOYEES_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);
