import { Action, createReducer, on } from '@ngrx/store';

import * as LocalitiesActions from './localities.actions';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { PaginationType } from '../../models/types/PaginationType';

export const localitiesInitialState = {
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
export type LocalitiesState = typeof localitiesInitialState;

const _localitiesReducer = createReducer(
  localitiesInitialState,

  /* ---------------------- */
  /* --- Get Localities --- */
  /* ---------------------- */

  on(LocalitiesActions.getLocalitiesRequest, (state, payload) => ({
    ...state,
    getLocalitiesIsFetching: payload.withLoading,
    getLocalitiesError: null,
  })),
  on(LocalitiesActions.getLocalitiesSuccess, (state, payload) => ({
    ...state,
    localities: payload.localities,
    getLocalitiesIsFetching: false,
    getLocalitiesError: null,
    getLocalitiesPagination: payload.pagination,
  })),
  on(LocalitiesActions.getLocalitiesFailure, (state, payload) => ({
    ...state,
    getLocalitiesIsFetching: false,
    getLocalitiesError: payload.error,
  })),

  /* -------------------- */
  /* --- Get Locality --- */
  /* -------------------- */

  on(LocalitiesActions.getLocalityRequest, (state, payload) => ({
    ...state,
    getLocalityIsFetching: payload.withLoading,
    getLocalityError: null,
  })),
  on(LocalitiesActions.getLocalitySuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    getLocalityIsFetching: false,
    getLocalityError: null,
  })),
  on(LocalitiesActions.getLocalityFailure, (state, payload) => ({
    ...state,
    getLocalityIsFetching: false,
    getLocalityError: payload.error,
    locality: null,
  })),

  /* ----------------------- */
  /* --- Update Locality --- */
  /* ----------------------- */

  on(LocalitiesActions.updateLocalityRequest, (state) => ({
    ...state,
    updateLocalityIsFetching: true,
    updateLocalityError: null,
  })),
  on(LocalitiesActions.updateLocalitySuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    updateLocalityIsFetching: false,
    updateLocalityError: null,
    updateLocalitySucceed: true,
  })),
  on(LocalitiesActions.updateLocalityFailure, (state, payload) => ({
    ...state,
    updateLocalityIsFetching: false,
    updateLocalityError: payload.error,
  })),
  on(LocalitiesActions.refreshUpdateLocalitySucceed, (state) => ({
    ...state,
    updateLocalitySucceed: false,
  })),
  on(LocalitiesActions.refreshUpdateLocalityFailure, (state) => ({
    ...state,
    updateLocalityError: null,
  })),

  /* -------------------- */
  /* --- Add Locality --- */
  /* -------------------- */

  on(LocalitiesActions.addLocalityRequest, (state) => ({
    ...state,
    addLocalityIsFetching: true,
    addLocalityError: null,
  })),
  on(LocalitiesActions.addLocalitySuccess, (state) => ({
    ...state,
    addLocalityIsFetching: false,
    addLocalityError: null,
    addLocalitySucceed: true,
  })),
  on(LocalitiesActions.addLocalityFailure, (state, payload) => ({
    ...state,
    addLocalityIsFetching: false,
    addLocalityError: payload.error,
  })),
  on(LocalitiesActions.refreshAddLocalitySucceed, (state) => ({
    ...state,
    addLocalitySucceed: false,
  })),
  on(LocalitiesActions.refreshAddLocalityFailure, (state) => ({
    ...state,
    addLocalityError: null,
  })),

  /* ----------------------- */
  /* --- Remove Locality --- */
  /* ----------------------- */

  on(LocalitiesActions.removeLocalityRequest, (state) => ({
    ...state,
    removeLocalityIsFetching: true,
    removeLocalityError: null,
  })),
  on(LocalitiesActions.removeLocalitySuccess, (state) => ({
    ...state,
    removeLocalityIsFetching: false,
    removeLocalityError: null,
    removeLocalitySucceed: true,
  })),
  on(LocalitiesActions.removeLocalityFailure, (state, payload) => ({
    ...state,
    removeLocalityIsFetching: false,
    removeLocalityError: payload.error,
  })),
  on(LocalitiesActions.refreshRemoveLocalitySucceed, (state) => ({
    ...state,
    removeLocalitySucceed: false,
  })),
  on(LocalitiesActions.refreshRemoveLocalityFailure, (state) => ({
    ...state,
    removeLocalityError: null,
  }))
);

export function localitiesReducer(
  state: LocalitiesState | undefined,
  action: Action
): LocalitiesState {
  return _localitiesReducer(state, action);
}
