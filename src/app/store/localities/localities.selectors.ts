import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { LocalitiesState } from './localities.reducer';

export const selectAll = (state: State) => state.localities;

export const selectLocalities = createSelector(
  selectAll,
  (state: LocalitiesState) => state.localities
);

export const selectGetLocalitiesIsFetching = createSelector(
  selectAll,
  (state: LocalitiesState) => state.getLocalitiesIsFetching
);

export const selectGetLocalitiesPagination = createSelector(
  selectAll,
  (state: LocalitiesState) => state.getLocalitiesPagination
);

export const selectGetLocalitiesError = createSelector(
  selectAll,
  (state: LocalitiesState) => state.getLocalitiesError
);

export const selectLocality = createSelector(
  selectAll,
  (state: LocalitiesState) => state.locality
);

export const selectGetLocalityIsFetching = createSelector(
  selectAll,
  (state: LocalitiesState) => state.getLocalityIsFetching
);

export const selectGetLocalityError = createSelector(
  selectAll,
  (state: LocalitiesState) => state.getLocalityError
);

export const selectUpdateLocalityIsFetching = createSelector(
  selectAll,
  (state: LocalitiesState) => state.updateLocalityIsFetching
);

export const selectUpdateLocalityError = createSelector(
  selectAll,
  (state: LocalitiesState) => state.updateLocalityError
);

export const selectUpdateLocalitySucceed = createSelector(
  selectAll,
  (state: LocalitiesState) => state.updateLocalitySucceed
);

export const selectAddLocalityIsFetching = createSelector(
  selectAll,
  (state: LocalitiesState) => state.addLocalityIsFetching
);

export const selectAddLocalitySucceed = createSelector(
  selectAll,
  (state: LocalitiesState) => state.addLocalitySucceed
);

export const selectAddLocalityError = createSelector(
  selectAll,
  (state: LocalitiesState) => state.addLocalityError
);

export const selectRemoveLocalityIsFetching = createSelector(
  selectAll,
  (state: LocalitiesState) => state.removeLocalityIsFetching
);

export const selectRemoveLocalitySucceed = createSelector(
  selectAll,
  (state: LocalitiesState) => state.removeLocalitySucceed
);

export const selectRemoveLocalityError = createSelector(
  selectAll,
  (state: LocalitiesState) => state.removeLocalityError
);
