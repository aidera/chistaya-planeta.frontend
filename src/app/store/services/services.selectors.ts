import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { ServicesState } from './services.reducer';

export const selectAll = (state: State) => state.services;

export const selectServices = createSelector(
  selectAll,
  (state: ServicesState) => state.services
);

export const selectGetServicesIsFetching = createSelector(
  selectAll,
  (state: ServicesState) => state.getServicesIsFetching
);

export const selectGetServicesError = createSelector(
  selectAll,
  (state: ServicesState) => state.getServicesError
);

export const selectUpdateServiceIsFetching = createSelector(
  selectAll,
  (state: ServicesState) => state.updateServiceIsFetching
);

export const selectUpdateServiceError = createSelector(
  selectAll,
  (state: ServicesState) => state.updateServiceError
);

export const selectUpdateServiceSucceed = createSelector(
  selectAll,
  (state: ServicesState) => state.updateServiceSucceed
);

export const selectAddServiceIsFetching = createSelector(
  selectAll,
  (state: ServicesState) => state.addServiceIsFetching
);

export const selectAddServiceSucceed = createSelector(
  selectAll,
  (state: ServicesState) => state.addServiceSucceed
);

export const selectAddServiceError = createSelector(
  selectAll,
  (state: ServicesState) => state.addServiceError
);

export const selectRemoveServiceIsFetching = createSelector(
  selectAll,
  (state: ServicesState) => state.removeServiceIsFetching
);

export const selectRemoveServiceSucceed = createSelector(
  selectAll,
  (state: ServicesState) => state.removeServiceSucceed
);

export const selectRemoveServiceError = createSelector(
  selectAll,
  (state: ServicesState) => state.removeServiceError
);
