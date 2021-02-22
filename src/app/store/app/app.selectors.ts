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
/* ------ Cars to select ------ */
/* -------------------------------- */

export const selectCarsToSelect = createSelector(
  selectAll,
  (state: AppState) => state.carsToSelect
);
export const selectCarsToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.carsToSelectIsFetching
);
export const selectCarsToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.carsToSelectError
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

/* ------------------------------ */
/* ------ Offers to select ------ */
/* ------------------------------ */

export const selectOffersToSelect = createSelector(
  selectAll,
  (state: AppState) => state.offersToSelect
);
export const selectOffersToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.offersToSelectIsFetching
);
export const selectOffersToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.offersToSelectError
);

/* -------------------------------- */
/* ------ Services to select ------ */
/* -------------------------------- */

export const selectServicesToSelect = createSelector(
  selectAll,
  (state: AppState) => state.servicesToSelect
);
export const selectServicesToSelectIsFetching = createSelector(
  selectAll,
  (state: AppState) => state.servicesToSelectIsFetching
);
export const selectServicesToSelectError = createSelector(
  selectAll,
  (state: AppState) => state.servicesToSelectError
);
