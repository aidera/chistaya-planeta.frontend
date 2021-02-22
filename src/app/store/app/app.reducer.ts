import { Action, createReducer, on } from '@ngrx/store';

import * as AppActions from './app.actions';
import { ILocalityLessInfo } from '../../models/Locality';
import { ServerError } from '../../models/ServerResponse';
import { IDivisionLessInfo } from '../../models/Division';
import { IEmployeeLessInfo } from '../../models/Employee';
import { ICarLessInfo } from '../../models/Car';
import { IOfferLessInfo } from '../../models/Offer';
import { IServiceLessInfo } from '../../models/Service';

export const appInitialState = {
  /* ---------------------------- */
  /* ------ Main interface ------ */
  /* ---------------------------- */
  isFullScreenMenuOpen: false,

  /* ---------------------------------- */
  /* ------ Localities to select ------ */
  /* ---------------------------------- */
  localitiesToSelect: null as ILocalityLessInfo[] | null,
  localitiesToSelectIsFetching: false,
  localitiesToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Divisions to select ------ */
  /* --------------------------------- */
  divisionsToSelect: null as IDivisionLessInfo[] | null,
  divisionsToSelectIsFetching: false,
  divisionsToSelectError: null as ServerError | null,

  /* ---------------------------- */
  /* ------ Cars to select ------ */
  /* ---------------------------- */
  carsToSelect: null as ICarLessInfo[] | null,
  carsToSelectIsFetching: false,
  carsToSelectError: null as ServerError | null,

  /* --------------------------------- */
  /* ------ Employees to select ------ */
  /* --------------------------------- */
  employeesToSelect: null as IEmployeeLessInfo[] | null,
  employeesToSelectIsFetching: false,
  employeesToSelectError: null as ServerError | null,

  /* ------------------------------ */
  /* ------ Offers to select ------ */
  /* ------------------------------ */
  offersToSelect: null as IOfferLessInfo[] | null,
  offersToSelectIsFetching: false,
  offersToSelectError: null as ServerError | null,

  /* -------------------------------- */
  /* ------ Services to select ------ */
  /* -------------------------------- */
  servicesToSelect: null as IServiceLessInfo[] | null,
  servicesToSelectIsFetching: false,
  servicesToSelectError: null as ServerError | null,
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

  /* ---------------------------- */
  /* ------ Cars to select ------ */
  /* ---------------------------- */

  on(AppActions.getCarsToSelectSuccess, (state) => ({
    ...state,
    carsToSelectIsFetching: true,
    carsToSelectError: null,
  })),
  on(AppActions.getCarsToSelectSuccess, (state, payload) => ({
    ...state,
    carsToSelect: payload.cars,
    carsToSelectIsFetching: false,
    carsToSelectError: null,
  })),
  on(AppActions.getCarsToSelectFailure, (state, payload) => ({
    ...state,
    carsToSelectIsFetching: false,
    carsToSelectError: payload.error,
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
  })),

  /* ------------------------------ */
  /* ------ Offers to select ------ */
  /* ------------------------------ */

  on(AppActions.getOffersToSelectSuccess, (state) => ({
    ...state,
    offersToSelectIsFetching: true,
    offersToSelectError: null,
  })),
  on(AppActions.getOffersToSelectSuccess, (state, payload) => ({
    ...state,
    offersToSelect: payload.offers,
    offersToSelectIsFetching: false,
    offersToSelectError: null,
  })),
  on(AppActions.getOffersToSelectFailure, (state, payload) => ({
    ...state,
    offersToSelectIsFetching: false,
    offersToSelectError: payload.error,
  })),

  /* -------------------------------- */
  /* ------ Services to select ------ */
  /* -------------------------------- */

  on(AppActions.getServicesToSelectSuccess, (state) => ({
    ...state,
    servicesToSelectIsFetching: true,
    servicesToSelectError: null,
  })),
  on(AppActions.getServicesToSelectSuccess, (state, payload) => ({
    ...state,
    servicesToSelect: payload.services,
    servicesToSelectIsFetching: false,
    servicesToSelectError: null,
  })),
  on(AppActions.getServicesToSelectFailure, (state, payload) => ({
    ...state,
    servicesToSelectIsFetching: false,
    servicesToSelectError: payload.error,
  }))
);

export function appReducer(
  state: AppState | undefined,
  action: Action
): AppState {
  return _appReducer(state, action);
}
