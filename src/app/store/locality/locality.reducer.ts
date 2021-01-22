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
  }))
);

export function localityReducer(
  state: LocalityState | undefined,
  action: Action
): LocalityState {
  return _localityReducer(state, action);
}
