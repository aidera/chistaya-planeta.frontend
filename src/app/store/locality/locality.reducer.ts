import { Action, createReducer, on } from '@ngrx/store';

import * as LocalityActions from './locality.actions';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { PaginationType } from '../../models/types/PaginationType';

export const localityInitialState = {
  localities: null as ILocality[] | null,

  getLocalitiesIsFetching: false,
  getLocalitiesError: null as ServerError | null,
  getLocalitiesPagination: null as PaginationType | null,

  locality: null as ILocality | null,

  getLocalityIsFetching: false,
  getLocalityError: null as ServerError | null,

  updateLocalityIsFetching: false,
  updateLocalityError: null as ServerError | null,
  updateLocalitySucceed: false as boolean,
};
export type LocalityState = typeof localityInitialState;

const _localityReducer = createReducer(
  localityInitialState,

  /* ---------------------- */
  /* --- Get Localities --- */
  /* ---------------------- */

  on(LocalityActions.getLocalitiesRequest, (state) => ({
    ...state,
    getLocalitiesIsFetching: true,
    getLocalitiesError: null,
  })),
  on(LocalityActions.getLocalitiesSuccess, (state, payload) => ({
    ...state,
    localities: payload.localities,
    getLocalitiesIsFetching: false,
    getLocalitiesError: null,
    getLocalitiesPagination: payload.pagination,
  })),
  on(LocalityActions.getLocalitiesFailure, (state, payload) => ({
    ...state,
    getLocalitiesIsFetching: false,
    getLocalitiesError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Locality --- */
  /* -------------------- */
  on(LocalityActions.getLocalityRequest, (state) => ({
    ...state,
    locality: null,
    getLocalityIsFetching: true,
    getLocalityError: null,
  })),
  on(LocalityActions.getLocalitySuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    getLocalityIsFetching: false,
    getLocalityError: null,
  })),
  on(LocalityActions.getLocalityFailure, (state, payload) => ({
    ...state,
    getLocalityIsFetching: false,
    getLocalityError: payload.error,
  })),

  /* ------------------------------ */
  /* --- Update Locality Status --- */
  /* ------------------------------ */

  on(LocalityActions.updateLocalityStatusRequest, (state) => ({
    ...state,
    updateLocalityIsFetching: true,
    updateLocalityError: null,
  })),
  on(LocalityActions.updateLocalityStatusSuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    updateLocalityIsFetching: false,
    updateLocalityError: null,
    updateLocalitySucceed: true,
  })),
  on(LocalityActions.updateLocalityStatusFailure, (state, payload) => ({
    ...state,
    updateLocalityIsFetching: false,
    updateLocalityError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Locality --- */
  /* ----------------------- */

  on(LocalityActions.updateLocalityRequest, (state) => ({
    ...state,
    updateLocalityIsFetching: true,
    updateLocalityError: null,
  })),
  on(LocalityActions.updateLocalitySuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    updateLocalityIsFetching: false,
    updateLocalityError: null,
    updateLocalitySucceed: true,
  })),
  on(LocalityActions.updateLocalityFailure, (state, payload) => ({
    ...state,
    updateLocalityIsFetching: false,
    updateLocalityError: payload.error,
  })),
  on(LocalityActions.refreshUpdateLocalitySucceed, (state) => ({
    ...state,
    updateLocalitySucceed: false,
  }))
);

export function localityReducer(
  state: LocalityState | undefined,
  action: Action
): LocalityState {
  return _localityReducer(state, action);
}
