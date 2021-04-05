import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { IService } from '../../models/Service';
import { Price } from '../../models/types/Price';

/* -------------------- */
/* --- Get Services --- */
/* -------------------- */

export const GET_SERVICES_REQUEST = '[services] get - services - request';
export const GET_SERVICES_SUCCESS = '[services] get - services - success';
export const GET_SERVICES_FAILURE = '[services] get - services - failure';

/* ---------------------- */
/* --- Update Service --- */
/* ---------------------- */

export const UPDATE_SERVICE_REQUEST = '[services] update - service - request';
export const UPDATE_SERVICE_SUCCESS = '[services] update - service - success';
export const UPDATE_SERVICE_FAILURE = '[services] update - service - failure';
export const REFRESH_UPDATE_SERVICE_SUCCESS =
  '[services] refresh - update service success';
export const REFRESH_UPDATE_SERVICE_FAILURE =
  '[services] refresh - update service failure';

/* ------------------- */
/* --- Add Service --- */
/* ------------------- */

export const ADD_SERVICE_REQUEST = '[services] add - service - request';
export const ADD_SERVICE_SUCCESS = '[services] add - service - success';
export const ADD_SERVICE_FAILURE = '[services] add - service - failure';
export const REFRESH_ADD_SERVICE_SUCCESS =
  '[services] refresh - add service success';
export const REFRESH_ADD_SERVICE_FAILURE =
  '[services] refresh - add service failure';

/* ---------------------- */
/* --- Remove Service --- */
/* ---------------------- */

export const REMOVE_SERVICE_REQUEST = '[services] remove - service - request';
export const REMOVE_SERVICE_SUCCESS = '[services] remove - service - success';
export const REMOVE_SERVICE_FAILURE = '[services] remove - service - failure';
export const REFRESH_REMOVE_SERVICE_SUCCESS =
  '[services] refresh - remove service success';
export const REFRESH_REMOVE_SERVICE_FAILURE =
  '[services] refresh - remove service failure';

/* -------------------- */
/* --- Get Services --- */
/* -------------------- */

export const getServicesRequest = createAction(GET_SERVICES_REQUEST);
export const getServicesSuccess = createAction(
  GET_SERVICES_SUCCESS,
  props<{
    services: IService[];
  }>()
);
export const getServicesFailure = createAction(
  GET_SERVICES_FAILURE,
  props<{ error: ServerError }>()
);

/* ---------------------- */
/* --- Update Service --- */
/* ---------------------- */

export const updateServiceRequest = createAction(
  UPDATE_SERVICE_REQUEST,
  props<{
    id: string;
    name?: string;
    status?: SimpleStatus;
    description?: string;
    prices?: Price[];
  }>()
);
export const updateServiceSuccess = createAction(
  UPDATE_SERVICE_SUCCESS,
  props<{
    service: IService;
  }>()
);
export const updateServiceFailure = createAction(
  UPDATE_SERVICE_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateServiceSucceed = createAction(
  REFRESH_UPDATE_SERVICE_SUCCESS
);
export const refreshUpdateServiceFailure = createAction(
  REFRESH_UPDATE_SERVICE_FAILURE
);

/* ------------------- */
/* --- Add Service --- */
/* ------------------- */

export const addServiceRequest = createAction(
  ADD_SERVICE_REQUEST,
  props<{ name: string; description?: string; prices: Price[] }>()
);
export const addServiceSuccess = createAction(
  ADD_SERVICE_SUCCESS,
  props<{
    service: IService;
  }>()
);
export const addServiceFailure = createAction(
  ADD_SERVICE_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshAddServiceSucceed = createAction(
  REFRESH_ADD_SERVICE_SUCCESS
);
export const refreshAddServiceFailure = createAction(
  REFRESH_ADD_SERVICE_FAILURE
);

/* ---------------------- */
/* --- Remove Service --- */
/* ---------------------- */

export const removeServiceRequest = createAction(
  REMOVE_SERVICE_REQUEST,
  props<{ id: string }>()
);
export const removeServiceSuccess = createAction(
  REMOVE_SERVICE_SUCCESS,
  props<{
    service: IService;
  }>()
);
export const removeServiceFailure = createAction(
  REMOVE_SERVICE_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshRemoveServiceSucceed = createAction(
  REFRESH_REMOVE_SERVICE_SUCCESS
);
export const refreshRemoveServiceFailure = createAction(
  REFRESH_REMOVE_SERVICE_FAILURE
);
