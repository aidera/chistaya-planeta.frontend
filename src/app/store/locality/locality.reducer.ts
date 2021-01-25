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
};
export type LocalityState = typeof localityInitialState;

const _localityReducer = createReducer(
  localityInitialState,

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

  on(LocalityActions.updateLocalityStatusRequest, (state) => ({
    ...state,
    getLocalityIsFetching: true,
    getLocalityError: null,
  })),
  on(LocalityActions.updateLocalityStatusSuccess, (state, payload) => ({
    ...state,
    locality: payload.locality,
    getLocalityIsFetching: false,
    getLocalityError: null,
  })),
  on(LocalityActions.updateLocalityStatusFailure, (state, payload) => ({
    ...state,
    getLocalityIsFetching: false,
    getLocalityError: payload.error,
  }))
);

export function localityReducer(
  state: LocalityState | undefined,
  action: Action
): LocalityState {
  return _localityReducer(state, action);
}
