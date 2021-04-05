import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { IClient } from '../../models/Client';
import { ClientStatus } from '../../models/enums/ClientStatus';

/* ------------------- */
/* --- Get Clients --- */
/* ------------------- */

export const GET_CLIENTS_REQUEST = '[clients] get - clients - request';
export const GET_CLIENTS_SUCCESS = '[clients] get - clients - success';
export const GET_CLIENTS_FAILURE = '[clients] get - clients - failure';

/* ------------------ */
/* --- Get Client --- */
/* ------------------ */

export const GET_CLIENT_REQUEST = '[clients] get - client - request';
export const GET_CLIENT_SUCCESS = '[clients] get - client - success';
export const GET_CLIENT_FAILURE = '[clients] get - client - failure';

/* ----------------------- */
/* --- Update Client's --- */
/* ----------------------- */

export const UPDATE_CLIENT_STATUS_REQUEST =
  '[clients] update - client status - request';

export const UPDATE_CLIENT_SUCCESS = '[clients] update - client - success';
export const UPDATE_CLIENT_FAILURE = '[clients] update - client - failure';
export const REFRESH_UPDATE_CLIENT_SUCCESS =
  '[clients] refresh - update client success';
export const REFRESH_UPDATE_CLIENT_FAILURE =
  '[clients] refresh - update client failure';

/* ------------------- */
/* --- Get Clients --- */
/* ------------------- */

export const getClientsRequest = createAction(
  GET_CLIENTS_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getClientsSuccess = createAction(
  GET_CLIENTS_SUCCESS,
  props<{
    clients: IClient[];
    pagination: PaginationType;
  }>()
);
export const getClientsFailure = createAction(
  GET_CLIENTS_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------ */
/* --- Get Client --- */
/* ------------------ */

export const getClientRequest = createAction(
  GET_CLIENT_REQUEST,
  props<{ id: string; withLoading: boolean }>()
);
export const getClientSuccess = createAction(
  GET_CLIENT_SUCCESS,
  props<{
    client: IClient;
  }>()
);
export const getClientFailure = createAction(
  GET_CLIENT_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------------------ */
/* --- Update Client's Status --- */
/* ------------------------------ */

export const updateClientStatusRequest = createAction(
  UPDATE_CLIENT_STATUS_REQUEST,
  props<{
    id: string;
    status: ClientStatus;
    blockReason?: string;
  }>()
);

export const updateClientSuccess = createAction(
  UPDATE_CLIENT_SUCCESS,
  props<{
    client: IClient;
  }>()
);
export const updateClientFailure = createAction(
  UPDATE_CLIENT_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateClientSucceed = createAction(
  REFRESH_UPDATE_CLIENT_SUCCESS
);
export const refreshUpdateClientFailure = createAction(
  REFRESH_UPDATE_CLIENT_FAILURE
);
