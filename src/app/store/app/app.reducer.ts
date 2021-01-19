import { Action, createReducer, on } from '@ngrx/store';

import * as AppActions from './app.actions';
import { ILocality } from '../../models/Locality';
import { ServerError } from '../../models/ServerResponse';
import { IDivision } from '../../models/Division';
import { IEmployee } from '../../models/Employee';

export const appInitialState = {
  /* ---------------------------- */
  /* ------ Main interface ------ */
  /* ---------------------------- */
  isFullScreenMenuOpen: false,

  /* ---------------------------------- */
  /* ------ Localities to select ------ */
  /* ---------------------------------- */
  localitiesToSelect: [] as ILocality[],
  localitiesToSelectIsFetching: false,
  localitiesToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Divisions to select ------ */
  /* --------------------------------- */
  divisionsToSelect: [] as IDivision[],
  divisionsToSelectIsFetching: false,
  divisionsToSelectError: null as ServerError | null,

  /* -------------------------------- */
  /* ------ Managers to select ------ */
  /* -------------------------------- */
  managersToSelect: [] as IEmployee[],
  managersToSelectIsFetching: false,
  managersToSelectError: null as ServerError | null,

  /* ------------------------------- */
  /* ------ Drivers to select ------ */
  /* ------------------------------- */
  driversToSelect: [] as IEmployee[],
  driversToSelectIsFetching: false,
  driversToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Employees to select ------ */
  /* --------------------------------- */
  employeesToSelect: [] as IEmployee[],
  employeesToSelectIsFetching: false,
  employeesToSelectError: null as ServerError | null,
};
export type AppState = typeof appInitialState;

const _appReducer = createReducer(
  appInitialState,

  /* ---------------------------- */
  /* ------ Main interface ------ */
  /* ---------------------------- */

  on(AppActions.setIsFullscreenMenuOpen, (state, payload) => ({
    ...state,
    isFullScreenMenuOpen: payload.isOpen,
  })),

  /* ---------------------------------- */
  /* ------ Localities to select ------ */
  /* ---------------------------------- */

  on(AppActions.getLocalitiesToSelectRequest, (state) => ({
    ...state,
    localitiesToSelectIsFetching: true,
    localitiesToSelectError: null,
  })),
  on(AppActions.getLocalitiesToSelectSuccess, (state, payload) => ({
    ...state,
    localitiesToSelect: payload.localities,
    localitiesToSelectIsFetching: false,
    localitiesToSelectError: null,
  })),
  on(AppActions.getLocalitiesToSelectFailure, (state, payload) => ({
    ...state,
    localitiesToSelectIsFetching: false,
    localitiesToSelectError: payload.error,
  })),

  /* --------------------------------- */
  /* ------ Divisions to select ------ */
  /* --------------------------------- */

  on(AppActions.getDivisionsToSelectSuccess, (state) => ({
    ...state,
    divisionsToSelectIsFetching: true,
    divisionsToSelectError: null,
  })),
  on(AppActions.getDivisionsToSelectSuccess, (state, payload) => ({
    ...state,
    divisionsToSelect: payload.divisions,
    divisionsToSelectIsFetching: false,
    divisionsToSelectError: null,
  })),
  on(AppActions.getDivisionsToSelectFailure, (state, payload) => ({
    ...state,
    divisionsToSelectIsFetching: false,
    divisionsToSelectError: payload.error,
  })),

  /* -------------------------------- */
  /* ------ Managers to select ------ */
  /* -------------------------------- */

  on(AppActions.getManagersToSelectSuccess, (state) => ({
    ...state,
    managersToSelectIsFetching: true,
    managersToSelectError: null,
  })),
  on(AppActions.getManagersToSelectSuccess, (state, payload) => ({
    ...state,
    managersToSelect: payload.managers,
    managersToSelectIsFetching: false,
    managersToSelectError: null,
  })),
  on(AppActions.getManagersToSelectFailure, (state, payload) => ({
    ...state,
    managersToSelectIsFetching: false,
    managersToSelectError: payload.error,
  })),

  /* ------------------------------- */
  /* ------ Drivers to select ------ */
  /* ------------------------------- */

  on(AppActions.getDriversToSelectSuccess, (state) => ({
    ...state,
    driversToSelectIsFetching: true,
    driversToSelectError: null,
  })),
  on(AppActions.getDriversToSelectSuccess, (state, payload) => ({
    ...state,
    driversToSelect: payload.drivers,
    driversToSelectIsFetching: false,
    driversToSelectError: null,
  })),
  on(AppActions.getDriversToSelectFailure, (state, payload) => ({
    ...state,
    driversToSelectIsFetching: false,
    driversToSelectError: payload.error,
  })),

  /* --------------------------------- */
  /* ------ Employees to select ------ */
  /* --------------------------------- */

  on(AppActions.getEmployeesToSelectSuccess, (state) => ({
    ...state,
    employeesToSelectIsFetching: true,
    employeesToSelectError: null,
  })),
  on(AppActions.getEmployeesToSelectSuccess, (state, payload) => ({
    ...state,
    employeesToSelect: payload.employees,
    employeesToSelectIsFetching: false,
    employeesToSelectError: null,
  })),
  on(AppActions.getEmployeesToSelectFailure, (state, payload) => ({
    ...state,
    employeesToSelectIsFetching: false,
    employeesToSelectError: payload.error,
  }))
);

export function appReducer(
  state: AppState | undefined,
  action: Action
): AppState {
  return _appReducer(state, action);
}
