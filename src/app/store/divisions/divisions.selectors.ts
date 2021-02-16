import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { DivisionsState } from './divisions.reducer';

export const selectAll = (state: State) => state.divisions;

export const selectDivisions = createSelector(
  selectAll,
  (state: DivisionsState) => state.divisions
);

export const selectGetDivisionsIsFetching = createSelector(
  selectAll,
  (state: DivisionsState) => state.getDivisionsIsFetching
);

export const selectGetDivisionsPagination = createSelector(
  selectAll,
  (state: DivisionsState) => state.getDivisionsPagination
);

export const selectGetDivisionsError = createSelector(
  selectAll,
  (state: DivisionsState) => state.getDivisionsError
);

export const selectDivision = createSelector(
  selectAll,
  (state: DivisionsState) => state.division
);

export const selectGetDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionsState) => state.getDivisionIsFetching
);

export const selectGetDivisionError = createSelector(
  selectAll,
  (state: DivisionsState) => state.getDivisionError
);

export const selectUpdateDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionsState) => state.updateDivisionIsFetching
);

export const selectUpdateDivisionError = createSelector(
  selectAll,
  (state: DivisionsState) => state.updateDivisionError
);

export const selectUpdateDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionsState) => state.updateDivisionSucceed
);

export const selectAddDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionsState) => state.addDivisionIsFetching
);

export const selectAddDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionsState) => state.addDivisionSucceed
);

export const selectAddDivisionError = createSelector(
  selectAll,
  (state: DivisionsState) => state.addDivisionError
);

export const selectRemoveDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionsState) => state.removeDivisionIsFetching
);

export const selectRemoveDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionsState) => state.removeDivisionSucceed
);

export const selectRemoveDivisionError = createSelector(
  selectAll,
  (state: DivisionsState) => state.removeDivisionError
);
