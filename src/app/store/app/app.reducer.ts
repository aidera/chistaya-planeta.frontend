import { Action, createReducer, on } from '@ngrx/store';

import * as AppActions from './app.actions';
import { ILocalityLessInfo } from '../../models/Locality';
import { ServerError } from '../../models/ServerResponse';
import { IDivisionLessInfo } from '../../models/Division';
import { ILessInfoItem } from '../../models/LessInfoItem';
import { OptionType } from '../../models/types/OptionType';

export const appInitialState = {
  /* ---------------------------- */
  /* ------ Main interface ------ */
  /* ---------------------------- */
  isFullScreenMenuOpen: false,

  /* ---------------------------------- */
  /* ------ Localities to select ------ */
  /* ---------------------------------- */
  localitiesToSelect: null as ILocalityLessInfo[] | null,
  localitiesOptionsToSelect: null as OptionType[] | null,
  localitiesToSelectIsFetching: false,
  localitiesToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Divisions to select ------ */
  /* --------------------------------- */
  divisionsToSelect: null as IDivisionLessInfo[] | null,
  divisionsOptionsToSelect: null as OptionType[] | null,
  divisionsToSelectIsFetching: false,
  divisionsToSelectError: null as ServerError | null,

  /* -------------------------------- */
  /* ------ Managers to select ------ */
  /* -------------------------------- */
  managersToSelect: null as ILessInfoItem[] | null,
  managersOptionsToSelect: null as OptionType[] | null,
  managersToSelectIsFetching: false,
  managersToSelectError: null as ServerError | null,

  /* ------------------------------- */
  /* ------ Drivers to select ------ */
  /* ------------------------------- */
  driversToSelect: null as ILessInfoItem[] | null,
  driversOptionsToSelect: null as OptionType[] | null,
  driversToSelectIsFetching: false,
  driversToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Employees to select ------ */
  /* --------------------------------- */
  employeesToSelect: null as ILessInfoItem[] | null,
  employeesOptionsToSelect: null as OptionType[] | null,
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
    localitiesOptionsToSelect: payload.localities.map((locality) => {
      return {
        value: locality._id,
        text: locality.name,
      };
    }),
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
    divisionsOptionsToSelect: payload.divisions.map((division) => {
      return {
        value: division._id,
        text: division.name,
      };
    }),
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
    managersOptionsToSelect: payload.managers.map((manager) => {
      return {
        value: manager.id,
        text: manager.name,
      };
    }),
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
    driversOptionsToSelect: payload.drivers.map((driver) => {
      return {
        value: driver.id,
        text: driver.name,
      };
    }),
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
    employeesOptionsToSelect: payload.employees.map((employee) => {
      return {
        value: employee.id,
        text: employee.name,
      };
    }),
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
