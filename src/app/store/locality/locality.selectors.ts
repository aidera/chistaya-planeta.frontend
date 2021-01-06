import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { LocalityState } from './locality.reducer';

export const selectAll = (state: State) => state.locality;

export const selectLocalities = createSelector(
  selectAll,
  (state: LocalityState) => state.localities
);

export const selectFetLocalitiesIsFetching = createSelector(
  selectAll,
  (state: LocalityState) => state.getLocalitiesIsFetching
);

export const selectGetLocalitiesError = createSelector(
  selectAll,
  (state: LocalityState) => state.getLocalitiesError
);
