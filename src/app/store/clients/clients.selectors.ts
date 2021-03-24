import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { ClientsState } from './clients.reducer';

export const selectAll = (state: State) => state.clients;

export const selectClients = createSelector(
  selectAll,
  (state: ClientsState) => state.clients
);

export const selectGetClientsIsFetching = createSelector(
  selectAll,
  (state: ClientsState) => state.getClientsIsFetching
);

export const selectGetClientsPagination = createSelector(
  selectAll,
  (state: ClientsState) => state.getClientsPagination
);

export const selectGetClientsError = createSelector(
  selectAll,
  (state: ClientsState) => state.getClientsError
);

export const selectClient = createSelector(
  selectAll,
  (state: ClientsState) => state.client
);

export const selectGetClientIsFetching = createSelector(
  selectAll,
  (state: ClientsState) => state.getClientIsFetching
);

export const selectGetClientError = createSelector(
  selectAll,
  (state: ClientsState) => state.getClientError
);

export const selectUpdateClientIsFetching = createSelector(
  selectAll,
  (state: ClientsState) => state.updateClientIsFetching
);

export const selectUpdateClientError = createSelector(
  selectAll,
  (state: ClientsState) => state.updateClientError
);

export const selectUpdateClientSucceed = createSelector(
  selectAll,
  (state: ClientsState) => state.updateClientSucceed
);
