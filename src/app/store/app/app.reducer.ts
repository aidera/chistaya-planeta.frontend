import { Action, createReducer, on } from '@ngrx/store';

import * as AppActions from './app.actions';

export const appInitialState = {
  isFullScreenMenuOpen: false,
};
export type AppState = typeof appInitialState;

const _appReducer = createReducer(
  appInitialState,

  on(AppActions.setIsFullscreenMenuOpen, (state, payload) => ({
    ...state,
    isFullScreenMenuOpen: payload.isOpen,
  }))
);

export function appReducer(
  state: AppState | undefined,
  action: Action
): AppState {
  return _appReducer(state, action);
}
