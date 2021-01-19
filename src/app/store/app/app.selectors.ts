import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { AppState } from './app.reducer';

export const selectAll = (state: State) => state.app;

/* ---------------------------- */
/* ------ Main interface ------ */
/* ---------------------------- */

export const selectIsFullScreenMenuOpen = createSelector(
  selectAll,
  (state: AppState) => state.isFullScreenMenuOpen
);

/* ---------------------------------- */
/* ------ Localities to select ------ */
/* ---------------------------------- */

export const selectLocalitiesToSelect = createSelector(
  selectAll,
  (state: AppState) => state.localitiesToSelect
);
export const selectLocalitiesToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.localitiesToSelectIsFetching
);
export const selectLocalitiesToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.localitiesToSelectError
);

/* --------------------------------- */
/* ------ Divisions to select ------ */
/* --------------------------------- */

export const selectDivisionsToSelect = createSelector(
  selectAll,
  (state: AppState) => state.divisionsToSelect
);
export const selectDivisionsToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.divisionsToSelectIsFetching
);
export const selectDivisionsToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.divisionsToSelectError
);

/* -------------------------------- */
/* ------ Managers to select ------ */
/* -------------------------------- */

export const selectManagersToSelect = createSelector(
  selectAll,
  (state: AppState) => state.managersToSelect
);
export const selectManagersToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.managersToSelectIsFetching
);
export const selectManagersToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.managersToSelectError
);

/* ------------------------------- */
/* ------ Drivers to select ------ */
/* ------------------------------- */

export const selectDriversToSelect = createSelector(
  selectAll,
  (state: AppState) => state.driversToSelect
);
export const selectDriversToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.driversToSelectIsFetching
);
export const selectDriversToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.driversToSelectError
);

/* --------------------------------- */
/* ------ Employees to select ------ */
/* --------------------------------- */

export const selectEmployeesToSelect = createSelector(
  selectAll,
  (state: AppState) => state.employeesToSelect
);
export const selectEmployeesToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.employeesToSelectIsFetching
);
export const selectEmployeesToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.employeesToSelectError
);
