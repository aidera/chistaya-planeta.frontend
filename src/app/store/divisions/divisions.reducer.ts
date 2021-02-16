import { Action, createReducer, on } from '@ngrx/store';

import * as DivisionsActions from './divisions.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IDivision } from '../../models/Division';

export const divisionsInitialState = {
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
export type DivisionsState = typeof divisionsInitialState;

const _divisionsReducer = createReducer(
  divisionsInitialState,

  /* --------------------- */
  /* --- Get Divisions --- */
  /* --------------------- */

  on(DivisionsActions.getDivisionsRequest, (state, payload) => ({
    ...state,
    getDivisionsIsFetching: payload.withLoading,
    getDivisionsError: null,
  })),
  on(DivisionsActions.getDivisionsSuccess, (state, payload) => ({
    ...state,
    divisions: payload.divisions,
    getDivisionsIsFetching: false,
    getDivisionsError: null,
    getDivisionsPagination: payload.pagination,
  })),
  on(DivisionsActions.getDivisionsFailure, (state, payload) => ({
    ...state,
    getDivisionsIsFetching: false,
    getDivisionsError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Division --- */
  /* -------------------- */

  on(DivisionsActions.getDivisionRequest, (state, payload) => ({
    ...state,
    division: null,
    getDivisionIsFetching: payload.withLoading,
    getDivisionError: null,
  })),
  on(DivisionsActions.getDivisionSuccess, (state, payload) => ({
    ...state,
    division: payload.division,
    getDivisionIsFetching: false,
    getDivisionError: null,
  })),
  on(DivisionsActions.getDivisionFailure, (state, payload) => ({
    ...state,
    getDivisionIsFetching: false,
    getDivisionError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Division --- */
  /* ----------------------- */

  on(DivisionsActions.updateDivisionRequest, (state) => ({
    ...state,
    updateDivisionIsFetching: true,
    updateDivisionError: null,
  })),
  on(DivisionsActions.updateDivisionSuccess, (state, payload) => ({
    ...state,
    division: payload.division,
    updateDivisionIsFetching: false,
    updateDivisionError: null,
    updateDivisionSucceed: true,
  })),
  on(DivisionsActions.updateDivisionFailure, (state, payload) => ({
    ...state,
    updateDivisionIsFetching: false,
    updateDivisionError: payload.error,
  })),
  on(DivisionsActions.refreshUpdateDivisionSucceed, (state) => ({
    ...state,
    updateDivisionSucceed: false,
  })),
  on(DivisionsActions.refreshUpdateDivisionFailure, (state) => ({
    ...state,
    updateDivisionError: null,
  })),

  /* -------------------- */
  /* --- Add Division --- */
  /* -------------------- */

  on(DivisionsActions.addDivisionRequest, (state) => ({
    ...state,
    addDivisionIsFetching: true,
    addDivisionError: null,
  })),
  on(DivisionsActions.addDivisionSuccess, (state) => ({
    ...state,
    addDivisionIsFetching: false,
    addDivisionError: null,
    addDivisionSucceed: true,
  })),
  on(DivisionsActions.addDivisionFailure, (state, payload) => ({
    ...state,
    addDivisionIsFetching: false,
    addDivisionError: payload.error,
  })),
  on(DivisionsActions.refreshAddDivisionSucceed, (state) => ({
    ...state,
    addDivisionSucceed: false,
  })),
  on(DivisionsActions.refreshAddDivisionFailure, (state) => ({
    ...state,
    addDivisionError: null,
  })),

  /* ----------------------- */
  /* --- Remove Division --- */
  /* ----------------------- */

  on(DivisionsActions.removeDivisionRequest, (state) => ({
    ...state,
    removeDivisionIsFetching: true,
    removeDivisionError: null,
  })),
  on(DivisionsActions.removeDivisionSuccess, (state) => ({
    ...state,
    removeDivisionIsFetching: false,
    removeDivisionError: null,
    removeDivisionSucceed: true,
  })),
  on(DivisionsActions.removeDivisionFailure, (state, payload) => ({
    ...state,
    removeDivisionIsFetching: false,
    removeDivisionError: payload.error,
  })),
  on(DivisionsActions.refreshRemoveDivisionSucceed, (state) => ({
    ...state,
    removeDivisionSucceed: false,
  })),
  on(DivisionsActions.refreshRemoveDivisionFailure, (state) => ({
    ...state,
    removeDivisionError: null,
  }))
);

export function divisionsReducer(
  state: DivisionsState | undefined,
  action: Action
): DivisionsState {
  return _divisionsReducer(state, action);
}
