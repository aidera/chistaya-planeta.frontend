import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ICar } from '../../models/Car';
import CarStatus from '../../models/enums/CarStatus';
import CarType from '../../models/enums/CarType';
import { IEmployee } from '../../models/Employee';

/* ---------------------- */
/* --- Get Cars --- */
/* ---------------------- */

export const GET_CARS_REQUEST = '[car] get - cars - request';
export const GET_CARS_SUCCESS = '[car] get - cars - success';
export const GET_CARS_FAILURE = '[car] get - cars - failure';

/* --------------- */
/* --- Get Car --- */
/* --------------- */

export const GET_CAR_REQUEST = '[car] get - car - request';
export const GET_CAR_SUCCESS = '[car] get - car - success';
export const GET_CAR_FAILURE = '[car] get - car - failure';

/* ------------------ */
/* --- Update Car --- */
/* ------------------ */

export const UPDATE_CAR_REQUEST = '[car] update - car - request';
export const UPDATE_CAR_SUCCESS = '[car] update - car - success';
export const UPDATE_CAR_FAILURE = '[car] update - car - failure';
export const REFRESH_UPDATE_CAR_SUCCESS = '[car] refresh - update car success';

/* --------------- */
/* --- Add Car --- */
/* --------------- */

export const ADD_CAR_REQUEST = '[car] add - car - request';
export const ADD_CAR_SUCCESS = '[car] add - car - success';
export const ADD_CAR_FAILURE = '[car] add - car - failure';
export const REFRESH_ADD_CAR_SUCCESS = '[car] refresh - add car success';

/* ------------------ */
/* --- Remove Car --- */
/* ------------------ */

export const REMOVE_CAR_REQUEST = '[car] remove - car - request';
export const REMOVE_CAR_SUCCESS = '[car] remove - car - success';
export const REMOVE_CAR_FAILURE = '[car] remove - car - failure';
export const REFRESH_REMOVE_CAR_SUCCESS = '[car] refresh - remove car success';

/* ---------------- */
/* --- Get Cars --- */
/* ---------------- */

export const getCarsRequest = createAction(
  GET_CARS_REQUEST,
  props<{ params: GetRouteParamsType; withLoading: boolean }>()
);
export const getCarsSuccess = createAction(
  GET_CARS_SUCCESS,
  props<{
    cars: ICar[];
    pagination: PaginationType;
  }>()
);
export const getCarsFailure = createAction(
  GET_CARS_FAILURE,
  props<{ error: ServerError }>()
);

/* --------------- */
/* --- Get Car --- */
/* --------------- */

export const getCarRequest = createAction(
  GET_CAR_REQUEST,
  props<{ id: string }>()
);
export const getCarSuccess = createAction(
  GET_CAR_SUCCESS,
  props<{
    car: ICar;
  }>()
);
export const getCarFailure = createAction(
  GET_CAR_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------ */
/* --- Update Car --- */
/* ------------------ */

export const updateCarRequest = createAction(
  UPDATE_CAR_REQUEST,
  props<{
    id: string;
    status?: CarStatus;
    carType?: CarType;
    licensePlate?: string;
    weight?: number;
    isCorporate?: boolean;
    drivers?: IEmployee[];
    localityId?: string;
    divisionIds?: string[];
  }>()
);
export const updateCarSuccess = createAction(
  UPDATE_CAR_SUCCESS,
  props<{
    car: ICar;
  }>()
);
export const updateCarFailure = createAction(
  UPDATE_CAR_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshUpdateCarSucceed = createAction(REFRESH_UPDATE_CAR_SUCCESS);

/* --------------- */
/* --- Add Car --- */
/* --------------- */

export const addCarRequest = createAction(
  ADD_CAR_REQUEST,
  props<{
    carType: CarType;
    licensePlate: string;
    weight: number;
    isCorporate?: boolean;
    drivers?: IEmployee[];
    localityId: string;
    divisionIds: string[];
  }>()
);
export const addCarSuccess = createAction(
  ADD_CAR_SUCCESS,
  props<{ car: ICar }>()
);
export const addCarFailure = createAction(
  ADD_CAR_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshAddCarSucceed = createAction(REFRESH_ADD_CAR_SUCCESS);

/* ------------------ */
/* --- Remove Car --- */
/* ------------------ */

export const removeCarRequest = createAction(
  REMOVE_CAR_REQUEST,
  props<{ id: string }>()
);
export const removeCarSuccess = createAction(
  REMOVE_CAR_SUCCESS,
  props<{
    car: ICar;
  }>()
);
export const removeCarFailure = createAction(
  REMOVE_CAR_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshRemoveCarSucceed = createAction(REFRESH_REMOVE_CAR_SUCCESS);
