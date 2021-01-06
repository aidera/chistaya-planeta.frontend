import { Action, createReducer, on } from '@ngrx/store';

import * as LocalityActions from './locality.actions';
import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';

export const localityInitialState = {
  localities: [] as ILocality[],
  getLocalitiesIsFetching: false,
  getLocalitiesError: null as ServerError | null,
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
