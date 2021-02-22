import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocalityLessInfo } from '../../models/Locality';
import { IDivisionLessInfo } from '../../models/Division';
import { IEmployeeLessInfo } from '../../models/Employee';
import { ICarLessInfo } from '../../models/Car';
import { IOfferLessInfo } from '../../models/Offer';
import { IServiceLessInfo } from '../../models/Service';

export const SET_IS_FULLSCREEN_MENU_OPEN =
  '[app] set - is fullscreen menu open';

export const GET_LOCALITIES_TO_SELECT_REQUEST =
  '[app] get - localities to select - request';
export const GET_LOCALITIES_TO_SELECT_SUCCESS =
  '[app] get - localities to select - success';
export const GET_LOCALITIES_TO_SELECT_FAILURE =
  '[app] get - localities to select - failure';

export const GET_DIVISIONS_TO_SELECT_REQUEST =
  '[app] get - divisions to select - request';
export const GET_DIVISIONS_TO_SELECT_SUCCESS =
  '[app] get - divisions to select - success';
export const GET_DIVISIONS_TO_SELECT_FAILURE =
  '[app] get - divisions to select - failure';

export const GET_CARS_TO_SELECT_REQUEST =
  '[app] get - cars to select - request';
export const GET_CARS_TO_SELECT_SUCCESS =
  '[app] get - cars to select - success';
export const GET_CARS_TO_SELECT_FAILURE =
  '[app] get - cars to select - failure';

export const GET_EMPLOYEES_TO_SELECT_REQUEST =
  '[app] get - employees to select - request';
export const GET_EMPLOYEES_TO_SELECT_SUCCESS =
  '[app] get - employees to select - success';
export const GET_EMPLOYEES_TO_SELECT_FAILURE =
  '[app] get - employees to select - failure';

export const GET_OFFERS_TO_SELECT_REQUEST =
  '[app] get - offers to select - request';
export const GET_OFFERS_TO_SELECT_SUCCESS =
  '[app] get - offers to select - success';
export const GET_OFFERS_TO_SELECT_FAILURE =
  '[app] get - offers to select - failure';

export const GET_SERVICES_TO_SELECT_REQUEST =
  '[app] get - services to select - request';
export const GET_SERVICES_TO_SELECT_SUCCESS =
  '[app] get - services to select - success';
export const GET_SERVICES_TO_SELECT_FAILURE =
  '[app] get - services to select - failure';

/* ---------------------------- */
/* ------ Main interface ------ */
/* ---------------------------- */

export const setIsFullscreenMenuOpen = createAction(
  SET_IS_FULLSCREEN_MENU_OPEN,
  props<{ isOpen: boolean }>()
);

/* ---------------------------------- */
/* ------ Localities to select ------ */
/* ---------------------------------- */

export const getLocalitiesToSelectRequest = createAction(
  GET_LOCALITIES_TO_SELECT_REQUEST
);
export const getLocalitiesToSelectSuccess = createAction(
  GET_LOCALITIES_TO_SELECT_SUCCESS,
  props<{
    localities: ILocalityLessInfo[];
  }>()
);
export const getLocalitiesToSelectFailure = createAction(
  GET_LOCALITIES_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* --------------------------------- */
/* ------ Divisions to select ------ */
/* --------------------------------- */

export const getDivisionsToSelectRequest = createAction(
  GET_DIVISIONS_TO_SELECT_REQUEST
);
export const getDivisionsToSelectSuccess = createAction(
  GET_DIVISIONS_TO_SELECT_SUCCESS,
  props<{
    divisions: IDivisionLessInfo[];
  }>()
);
export const getDivisionsToSelectFailure = createAction(
  GET_DIVISIONS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* ---------------------------- */
/* ------ Cars to select ------ */
/* ---------------------------- */

export const getCarsToSelectRequest = createAction(GET_CARS_TO_SELECT_REQUEST);
export const getCarsToSelectSuccess = createAction(
  GET_CARS_TO_SELECT_SUCCESS,
  props<{
    cars: ICarLessInfo[];
  }>()
);
export const getCarsToSelectFailure = createAction(
  GET_CARS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* --------------------------------- */
/* ------ Employees to select ------ */
/* --------------------------------- */

export const getEmployeesToSelectRequest = createAction(
  GET_EMPLOYEES_TO_SELECT_REQUEST
);
export const getEmployeesToSelectSuccess = createAction(
  GET_EMPLOYEES_TO_SELECT_SUCCESS,
  props<{
    employees: IEmployeeLessInfo[];
  }>()
);
export const getEmployeesToSelectFailure = createAction(
  GET_EMPLOYEES_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* ------------------------------ */
/* ------ Offers to select ------ */
/* ------------------------------ */

export const getOffersToSelectRequest = createAction(
  GET_OFFERS_TO_SELECT_REQUEST
);
export const getOffersToSelectSuccess = createAction(
  GET_OFFERS_TO_SELECT_SUCCESS,
  props<{
    offers: IOfferLessInfo[];
  }>()
);
export const getOffersToSelectFailure = createAction(
  GET_OFFERS_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------------------- */
/* ------ Services to select ------ */
/* -------------------------------- */

export const getServicesToSelectRequest = createAction(
  GET_SERVICES_TO_SELECT_REQUEST
);
export const getServicesToSelectSuccess = createAction(
  GET_SERVICES_TO_SELECT_SUCCESS,
  props<{
    services: IServiceLessInfo[];
  }>()
);
export const getServicesToSelectFailure = createAction(
  GET_SERVICES_TO_SELECT_FAILURE,
  props<{ error: ServerError }>()
);
