import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { SimpleStatus } from '../../models/enums/SimpleStatus';

/* ---------------------- */
/* --- Get Localities --- */
/* ---------------------- */

export const GET_LOCALITIES_REQUEST = '[locality] get - localities - request';
export const GET_LOCALITIES_SUCCESS = '[locality] get - localities - success';
export const GET_LOCALITIES_FAILURE = '[locality] get - localities - failure';

/* -------------------- */
/* --- Get Locality --- */
/* -------------------- */

export const GET_LOCALITY_REQUEST = '[locality] get - locality - request';
export const GET_LOCALITY_SUCCESS = '[locality] get - locality - success';
export const GET_LOCALITY_FAILURE = '[locality] get - locality - failure';

/* ----------------------- */
/* --- Update Locality --- */
/* ----------------------- */

export const UPDATE_LOCALITY_REQUEST = '[locality] update - locality - request';
export const UPDATE_LOCALITY_SUCCESS = '[locality] update - locality - success';
export const UPDATE_LOCALITY_FAILURE = '[locality] update - locality - failure';
export const REFRESH_UPDATE_LOCALITY_SUCCESS =
  '[locality] refresh - update locality success';
export const REFRESH_UPDATE_LOCALITY_FAILURE =
  '[locality] refresh - update locality failure';

/* -------------------- */
/* --- Add Locality --- */
/* -------------------- */

export const ADD_LOCALITY_REQUEST = '[locality] add - locality - request';
export const ADD_LOCALITY_SUCCESS = '[locality] add - locality - success';
export const ADD_LOCALITY_FAILURE = '[locality] add - locality - failure';
export const REFRESH_ADD_LOCALITY_SUCCESS =
  '[locality] refresh - add locality success';
export const REFRESH_ADD_LOCALITY_FAILURE =
  '[locality] refresh - add locality failure';

/* ----------------------- */
/* --- Remove Locality --- */
/* ----------------------- */

export const REMOVE_LOCALITY_REQUEST = '[locality] remove - locality - request';
export const REMOVE_LOCALITY_SUCCESS = '[locality] remove - locality - success';
export const REMOVE_LOCALITY_FAILURE = '[locality] remove - locality - failure';
export const REFRESH_REMOVE_LOCALITY_SUCCESS =
  '[locality] refresh - remove locality success';
export const REFRESH_REMOVE_LOCALITY_FAILURE =
  '[locality] refresh - remove locality failure';

/* ---------------------- */
/* --- Get Localities --- */
/* ---------------------- */

export const getLocalitiesRequest = createAction(
  GET_LOCALITIES_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getLocalitiesSuccess = createAction(
  GET_LOCALITIES_SUCCESS,
  props<{
    localities: ILocality[];
    pagination: PaginationType;
  }>()
);
export const getLocalitiesFailure = createAction(
  GET_LOCALITIES_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------- */
/* --- Get Locality --- */
/* -------------------- */

export const getLocalityRequest = createAction(
  GET_LOCALITY_REQUEST,
  props<{ id: string }>()
);
export const getLocalitySuccess = createAction(
  GET_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const getLocalityFailure = createAction(
  GET_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);

/* ----------------------- */
/* --- Update Locality --- */
/* ----------------------- */

export const updateLocalityRequest = createAction(
  UPDATE_LOCALITY_REQUEST,
  props<{ id: string; name?: string; status?: SimpleStatus }>()
);
export const updateLocalitySuccess = createAction(
  UPDATE_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const updateLocalityFailure = createAction(
  UPDATE_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateLocalitySucceed = createAction(
  REFRESH_UPDATE_LOCALITY_SUCCESS
);
export const refreshUpdateLocalityFailure = createAction(
  REFRESH_UPDATE_LOCALITY_FAILURE
);

/* -------------------- */
/* --- Add Locality --- */
/* -------------------- */

export const addLocalityRequest = createAction(
  ADD_LOCALITY_REQUEST,
  props<{ name: string }>()
);
export const addLocalitySuccess = createAction(
  ADD_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const addLocalityFailure = createAction(
  ADD_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshAddLocalitySucceed = createAction(
  REFRESH_ADD_LOCALITY_SUCCESS
);
export const refreshAddLocalityFailure = createAction(
  REFRESH_ADD_LOCALITY_FAILURE
);

/* ----------------------- */
/* --- Remove Locality --- */
/* ----------------------- */

export const removeLocalityRequest = createAction(
  REMOVE_LOCALITY_REQUEST,
  props<{ id: string }>()
);
export const removeLocalitySuccess = createAction(
  REMOVE_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const removeLocalityFailure = createAction(
  REMOVE_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshRemoveLocalitySucceed = createAction(
  REFRESH_REMOVE_LOCALITY_SUCCESS
);
export const refreshRemoveLocalityFailure = createAction(
  REFRESH_REMOVE_LOCALITY_FAILURE
);
