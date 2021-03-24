import { Action, createReducer, on } from '@ngrx/store';

import * as ClientsActions from './clients.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { IClient } from '../../models/Client';

export const clientsInitialState = {
  clients: null as IClient[] | null,

  getClientsIsFetching: false,
  getClientsError: null as ServerError | null,
  getClientsPagination: null as PaginationType | null,

  client: null as IClient | null,

  getClientIsFetching: false,
  getClientError: null as ServerError | null,

  updateClientIsFetching: false,
  updateClientError: null as ServerError | null,
  updateClientSucceed: false as boolean,
};
export type ClientsState = typeof clientsInitialState;

const _clientsReducer = createReducer(
  clientsInitialState,

  /* ------------------- */
  /* --- Get Clients --- */
  /* ------------------- */

  on(ClientsActions.getClientsRequest, (state, payload) => ({
    ...state,
    getClientsIsFetching: payload.withLoading,
    getClientsError: null,
  })),
  on(ClientsActions.getClientsSuccess, (state, payload) => ({
    ...state,
    clients: payload.clients,
    getClientsIsFetching: false,
    getClientsError: null,
    getClientsPagination: payload.pagination,
  })),
  on(ClientsActions.getClientsFailure, (state, payload) => ({
    ...state,
    getClientsIsFetching: false,
    getClientsError: payload.error,
  })),

  /* ------------------ */
  /* --- Get Client --- */
  /* ------------------ */

  on(ClientsActions.getClientRequest, (state, payload) => ({
    ...state,
    getClientIsFetching: payload.withLoading,
    getClientError: null,
  })),
  on(ClientsActions.getClientSuccess, (state, payload) => ({
    ...state,
    client: payload.client,
    getClientIsFetching: false,
    getClientError: null,
  })),
  on(ClientsActions.getClientFailure, (state, payload) => ({
    ...state,
    client: null,
    getClientIsFetching: false,
    getClientError: payload.error,
  })),

  /* --------------------- */
  /* --- Update Client --- */
  /* --------------------- */

  on(ClientsActions.updateClientStatusRequest, (state) => ({
    ...state,
    updateClientIsFetching: true,
    updateClientError: null,
  })),
  on(ClientsActions.updateClientSuccess, (state, payload) => ({
    ...state,
    client: payload.client,
    updateClientIsFetching: false,
    updateClientError: null,
    updateClientSucceed: true,
  })),
  on(ClientsActions.updateClientFailure, (state, payload) => ({
    ...state,
    updateClientIsFetching: false,
    updateClientError: payload.error,
  })),
  on(ClientsActions.refreshUpdateClientSucceed, (state) => ({
    ...state,
    updateClientSucceed: false,
  })),
  on(ClientsActions.refreshUpdateClientFailure, (state) => ({
    ...state,
    updateClientError: null,
  }))
);

export function clientsReducer(
  state: ClientsState | undefined,
  action: Action
): ClientsState {
  return _clientsReducer(state, action);
}
