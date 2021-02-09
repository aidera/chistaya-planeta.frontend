import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { IDivision } from '../../models/Division';

/* --------------------- */
/* --- Get Divisions --- */
/* --------------------- */

export const GET_DIVISIONS_REQUEST = '[division] get - divisions - request';
export const GET_DIVISIONS_SUCCESS = '[division] get - divisions - success';
export const GET_DIVISIONS_FAILURE = '[division] get - divisions - failure';

/* -------------------- */
/* --- Get Division --- */
/* -------------------- */

export const GET_DIVISION_REQUEST = '[division] get - division - request';
export const GET_DIVISION_SUCCESS = '[division] get - division - success';
export const GET_DIVISION_FAILURE = '[division] get - division - failure';

/* ----------------------- */
/* --- Update Division --- */
/* ----------------------- */

export const UPDATE_DIVISION_REQUEST = '[division] update - division - request';
export const UPDATE_DIVISION_SUCCESS = '[division] update - division - success';
export const UPDATE_DIVISION_FAILURE = '[division] update - division - failure';
export const REFRESH_UPDATE_DIVISION_SUCCESS =
  '[division] refresh - update division success';

/* -------------------- */
/* --- Add Division --- */
/* -------------------- */

export const ADD_DIVISION_REQUEST = '[division] add - division - request';
export const ADD_DIVISION_SUCCESS = '[division] add - division - success';
export const ADD_DIVISION_FAILURE = '[division] add - division - failure';
export const REFRESH_ADD_DIVISION_SUCCESS =
  '[division] refresh - add division success';

/* ----------------------- */
/* --- Remove Division --- */
/* ----------------------- */

export const REMOVE_DIVISION_REQUEST = '[division] remove - division - request';
export const REMOVE_DIVISION_SUCCESS = '[division] remove - division - success';
export const REMOVE_DIVISION_FAILURE = '[division] remove - division - failure';
export const REFRESH_REMOVE_DIVISION_SUCCESS =
  '[division] refresh - remove division success';

/* --------------------- */
/* --- Get Divisions --- */
/* --------------------- */

export const getDivisionsRequest = createAction(
  GET_DIVISIONS_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getDivisionsSuccess = createAction(
  GET_DIVISIONS_SUCCESS,
  props<{
    divisions: IDivision[];
    pagination: PaginationType;
  }>()
);
export const getDivisionsFailure = createAction(
  GET_DIVISIONS_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------- */
/* --- Get Division --- */
/* -------------------- */

export const getDivisionRequest = createAction(
  GET_DIVISION_REQUEST,
  props<{ id: string }>()
);
export const getDivisionSuccess = createAction(
  GET_DIVISION_SUCCESS,
  props<{
    division: IDivision;
  }>()
);
export const getDivisionFailure = createAction(
  GET_DIVISION_FAILURE,
  props<{ error: ServerError }>()
);

/* ----------------------- */
/* --- Update Division --- */
/* ----------------------- */

export const updateDivisionRequest = createAction(
  UPDATE_DIVISION_REQUEST,
  props<{
    id: string;
    status?: SimpleStatus;
    name?: string;
    localityId?: string;
    street?: string;
    house?: string;
  }>()
);
export const updateDivisionSuccess = createAction(
  UPDATE_DIVISION_SUCCESS,
  props<{
    division: IDivision;
  }>()
);
export const updateDivisionFailure = createAction(
  UPDATE_DIVISION_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshUpdateDivisionSucceed = createAction(
  REFRESH_UPDATE_DIVISION_SUCCESS
);

/* -------------------- */
/* --- Add Division --- */
/* -------------------- */

export const addDivisionRequest = createAction(
  ADD_DIVISION_REQUEST,
  props<{ name: string; localityId: string; street: string; house: string }>()
);
export const addDivisionSuccess = createAction(
  ADD_DIVISION_SUCCESS,
  props<{
    division: IDivision;
  }>()
);
export const addDivisionFailure = createAction(
  ADD_DIVISION_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshAddDivisionSucceed = createAction(
  REFRESH_ADD_DIVISION_SUCCESS
);

/* ----------------------- */
/* --- Remove Division --- */
/* ----------------------- */

export const removeDivisionRequest = createAction(
  REMOVE_DIVISION_REQUEST,
  props<{ id: string }>()
);
export const removeDivisionSuccess = createAction(
  REMOVE_DIVISION_SUCCESS,
  props<{
    division: IDivision;
  }>()
);
export const removeDivisionFailure = createAction(
  REMOVE_DIVISION_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshRemoveDivisionSucceed = createAction(
  REFRESH_REMOVE_DIVISION_SUCCESS
);
