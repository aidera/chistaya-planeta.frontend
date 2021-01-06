import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { AppState } from './app.reducer';

export const selectAll = (state: State) => state.app;

export const selectIsFullScreenMenuOpen = createSelector(
  selectAll,
  (state: AppState) => state.isFullScreenMenuOpen
);
