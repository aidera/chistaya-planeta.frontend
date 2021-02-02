import { Action, createReducer, on } from '@ngrx/store';

import * as DivisionActions from './division.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IDivision } from '../../models/Division';

export const divisionInitialState = {
  divisions: null as IDivision[] | null,

  getDivisionsIsFetching: false,
  getDivisionsError: null as ServerError | null,
  getDivisionsPagination: null as PaginationType | null,

  division: null as IDivision | null,

  getDivisionIsFetching: false,
  getDivisionError: null as ServerError | null,

  updateDivisionIsFetching: false,
  updateDivisionError: null as ServerError | null,
  updateDivisionSucceed: false as boolean,

  addDivisionIsFetching: false,
  addDivisionError: null as ServerError | null,
  addDivisionSucceed: false as boolean,

  removeDivisionIsFetching: false,
  removeDivisionError: null as ServerError | null,
  removeDivisionSucceed: false as boolean,
};
export type DivisionState = typeof divisionInitialState;

const _divisionReducer = createReducer(
  divisionInitialState,

  /* --------------------- */
  /* --- Get Divisions --- */
  /* --------------------- */

  on(DivisionActions.getDivisionsRequest, (state, payload) => ({
    ...state,
    getDivisionsIsFetching: payload.withLoading,
    getDivisionsError: null,
  })),
  on(DivisionActions.getDivisionsSuccess, (state, payload) => ({
    ...state,
    divisions: payload.divisions,
    getDivisionsIsFetching: false,
    getDivisionsError: null,
    getDivisionsPagination: payload.pagination,
  })),
  on(DivisionActions.getDivisionsFailure, (state, payload) => ({
    ...state,
    getDivisionsIsFetching: false,
    getDivisionsError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Division --- */
  /* -------------------- */

  on(DivisionActions.getDivisionRequest, (state) => ({
    ...state,
    division: null,
    getDivisionIsFetching: true,
    getDivisionError: null,
  })),
  on(DivisionActions.getDivisionSuccess, (state, payload) => ({
    ...state,
    division: payload.division,
    getDivisionIsFetching: false,
    getDivisionError: null,
  })),
  on(DivisionActions.getDivisionFailure, (state, payload) => ({
    ...state,
    getDivisionIsFetching: false,
    getDivisionError: payload.error,
  })),

  /* ------------------------------ */
  /* --- Update Division Status --- */
  /* ------------------------------ */

  on(DivisionActions.updateDivisionStatusRequest, (state) => ({
    ...state,
    updateDivisionIsFetching: true,
    updateDivisionError: null,
  })),
  on(DivisionActions.updateDivisionStatusSuccess, (state, payload) => ({
    ...state,
    division: payload.division,
    updateDivisionIsFetching: false,
    updateDivisionError: null,
    updateDivisionSucceed: true,
  })),
  on(DivisionActions.updateDivisionStatusFailure, (state, payload) => ({
    ...state,
    updateDivisionIsFetching: false,
    updateDivisionError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Division --- */
  /* ----------------------- */

  on(DivisionActions.updateDivisionRequest, (state) => ({
    ...state,
    updateDivisionIsFetching: true,
    updateDivisionError: null,
  })),
  on(DivisionActions.updateDivisionSuccess, (state, payload) => ({
    ...state,
    division: payload.division,
    updateDivisionIsFetching: false,
    updateDivisionError: null,
    updateDivisionSucceed: true,
  })),
  on(DivisionActions.updateDivisionFailure, (state, payload) => ({
    ...state,
    updateDivisionIsFetching: false,
    updateDivisionError: payload.error,
  })),
  on(DivisionActions.refreshUpdateDivisionSucceed, (state) => ({
    ...state,
    updateDivisionSucceed: false,
  })),

  /* -------------------- */
  /* --- Add Division --- */
  /* -------------------- */

  on(DivisionActions.addDivisionRequest, (state) => ({
    ...state,
    addDivisionIsFetching: true,
    addDivisionError: null,
  })),
  on(DivisionActions.addDivisionSuccess, (state) => ({
    ...state,
    addDivisionIsFetching: false,
    addDivisionError: null,
    addDivisionSucceed: true,
  })),
  on(DivisionActions.addDivisionFailure, (state, payload) => ({
    ...state,
    addDivisionIsFetching: false,
    addDivisionError: payload.error,
  })),
  on(DivisionActions.refreshAddDivisionSucceed, (state) => ({
    ...state,
    addDivisionSucceed: false,
  })),

  /* ----------------------- */
  /* --- Remove Division --- */
  /* ----------------------- */

  on(DivisionActions.removeDivisionRequest, (state) => ({
    ...state,
    removeDivisionIsFetching: true,
    removeDivisionError: null,
  })),
  on(DivisionActions.removeDivisionSuccess, (state) => ({
    ...state,
    removeDivisionIsFetching: false,
    removeDivisionError: null,
    removeDivisionSucceed: true,
  })),
  on(DivisionActions.removeDivisionFailure, (state, payload) => ({
    ...state,
    removeDivisionIsFetching: false,
    removeDivisionError: payload.error,
  })),
  on(DivisionActions.refreshRemoveDivisionSucceed, (state) => ({
    ...state,
    removeDivisionSucceed: false,
  }))
);

export function divisionReducer(
  state: DivisionState | undefined,
  action: Action
): DivisionState {
  return _divisionReducer(state, action);
}
