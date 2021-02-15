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

  addLocalityIsFetching: false,
  addLocalityError: null as ServerError | null,
  addLocalitySucceed: false as boolean,

  removeLocalityIsFetching: false,
  removeLocalityError: null as ServerError | null,
  removeLocalitySucceed: false as boolean,
};
export type LocalityState = typeof localityInitialState;

const _localityReducer = createReducer(
  localityInitialState,

  /* ---------------------- */
  /* --- Get Localities --- */
  /* ---------------------- */

  on(LocalityActions.getLocalitiesRequest, (state, payload) => ({
    ...state,
    getLocalitiesIsFetching: payload.withLoading,
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
  })),
  on(LocalityActions.refreshUpdateLocalityFailure, (state) => ({
    ...state,
    updateLocalityError: null,
  })),

  /* -------------------- */
  /* --- Add Locality --- */
  /* -------------------- */

  on(LocalityActions.addLocalityRequest, (state) => ({
    ...state,
    addLocalityIsFetching: true,
    addLocalityError: null,
  })),
  on(LocalityActions.addLocalitySuccess, (state) => ({
    ...state,
    addLocalityIsFetching: false,
    addLocalityError: null,
    addLocalitySucceed: true,
  })),
  on(LocalityActions.addLocalityFailure, (state, payload) => ({
    ...state,
    addLocalityIsFetching: false,
    addLocalityError: payload.error,
  })),
  on(LocalityActions.refreshAddLocalitySucceed, (state) => ({
    ...state,
    addLocalitySucceed: false,
  })),
  on(LocalityActions.refreshAddLocalityFailure, (state) => ({
    ...state,
    addLocalityError: null,
  })),

  /* ----------------------- */
  /* --- Remove Locality --- */
  /* ----------------------- */

  on(LocalityActions.removeLocalityRequest, (state) => ({
    ...state,
    removeLocalityIsFetching: true,
    removeLocalityError: null,
  })),
  on(LocalityActions.removeLocalitySuccess, (state) => ({
    ...state,
    removeLocalityIsFetching: false,
    removeLocalityError: null,
    removeLocalitySucceed: true,
  })),
  on(LocalityActions.removeLocalityFailure, (state, payload) => ({
    ...state,
    removeLocalityIsFetching: false,
    removeLocalityError: payload.error,
  })),
  on(LocalityActions.refreshRemoveLocalitySucceed, (state) => ({
    ...state,
    removeLocalitySucceed: false,
  })),
  on(LocalityActions.refreshRemoveLocalityFailure, (state) => ({
    ...state,
    removeLocalityError: null,
  }))
);

export function localityReducer(
  state: LocalityState | undefined,
  action: Action
): LocalityState {
  return _localityReducer(state, action);
}
