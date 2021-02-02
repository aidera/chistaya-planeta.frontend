import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { DivisionState } from './division.reducer';

export const selectAll = (state: State) => state.division;

export const selectDivisions = createSelector(
  selectAll,
  (state: DivisionState) => state.divisions
);

export const selectGetDivisionsIsFetching = createSelector(
  selectAll,
  (state: DivisionState) => state.getDivisionsIsFetching
);

export const selectGetDivisionsPagination = createSelector(
  selectAll,
  (state: DivisionState) => state.getDivisionsPagination
);

export const selectGetDivisionsError = createSelector(
  selectAll,
  (state: DivisionState) => state.getDivisionsError
);

export const selectDivision = createSelector(
  selectAll,
  (state: DivisionState) => state.division
);

export const selectGetDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionState) => state.getDivisionIsFetching
);

export const selectGetDivisionError = createSelector(
  selectAll,
  (state: DivisionState) => state.getDivisionError
);

export const selectUpdateDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionState) => state.updateDivisionIsFetching
);

export const selectUpdateDivisionError = createSelector(
  selectAll,
  (state: DivisionState) => state.updateDivisionError
);

export const selectUpdateDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionState) => state.updateDivisionSucceed
);

export const selectAddDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionState) => state.addDivisionIsFetching
);

export const selectAddDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionState) => state.addDivisionSucceed
);

export const selectAddDivisionError = createSelector(
  selectAll,
  (state: DivisionState) => state.addDivisionError
);

export const selectRemoveDivisionIsFetching = createSelector(
  selectAll,
  (state: DivisionState) => state.removeDivisionIsFetching
);

export const selectRemoveDivisionSucceed = createSelector(
  selectAll,
  (state: DivisionState) => state.removeDivisionSucceed
);

export const selectRemoveDivisionError = createSelector(
  selectAll,
  (state: DivisionState) => state.removeDivisionError
);
