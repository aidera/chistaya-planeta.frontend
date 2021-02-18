import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import Price from '../../models/types/Price';
import { IOffer } from '../../models/Offer';

/* ------------------ */
/* --- Get Offers --- */
/* ------------------ */

export const GET_OFFERS_REQUEST = '[offers] get - offers - request';
export const GET_OFFERS_SUCCESS = '[offers] get - offers - success';
export const GET_OFFERS_FAILURE = '[offers] get - offers - failure';

/* -------------------- */
/* --- Update Offer --- */
/* -------------------- */

export const UPDATE_OFFER_REQUEST = '[offers] update - offer - request';
export const UPDATE_OFFER_SUCCESS = '[offers] update - offer - success';
export const UPDATE_OFFER_FAILURE = '[offers] update - offer - failure';
export const REFRESH_UPDATE_OFFER_SUCCESS =
  '[offers] refresh - update offer success';
export const REFRESH_UPDATE_OFFER_FAILURE =
  '[offers] refresh - update offer failure';

/* ----------------- */
/* --- Add Offer --- */
/* ----------------- */

export const ADD_OFFER_REQUEST = '[offers] add - offer - request';
export const ADD_OFFER_SUCCESS = '[offers] add - offer - success';
export const ADD_OFFER_FAILURE = '[offers] add - offer - failure';
export const REFRESH_ADD_OFFER_SUCCESS = '[offers] refresh - add offer success';
export const REFRESH_ADD_OFFER_FAILURE = '[offers] refresh - add offer failure';

/* -------------------- */
/* --- Remove Offer --- */
/* -------------------- */

export const REMOVE_OFFER_REQUEST = '[offers] remove - offer - request';
export const REMOVE_OFFER_SUCCESS = '[offers] remove - offer - success';
export const REMOVE_OFFER_FAILURE = '[offers] remove - offer - failure';
export const REFRESH_REMOVE_OFFER_SUCCESS =
  '[offers] refresh - remove offer success';
export const REFRESH_REMOVE_OFFER_FAILURE =
  '[offers] refresh - remove offer failure';

/* ------------------ */
/* --- Get Offers --- */
/* ------------------ */

export const getOffersRequest = createAction(GET_OFFERS_REQUEST);
export const getOffersSuccess = createAction(
  GET_OFFERS_SUCCESS,
  props<{
    offers: IOffer[];
  }>()
);
export const getOffersFailure = createAction(
  GET_OFFERS_FAILURE,
  props<{ error: ServerError }>()
);

/* -------------------- */
/* --- Update Offer --- */
/* -------------------- */

export const updateOfferRequest = createAction(
  UPDATE_OFFER_REQUEST,
  props<{
    id: string;
    name?: string;
    status?: SimpleStatus;
    description?: string;
    prices?: Price[];
  }>()
);
export const updateOfferSuccess = createAction(
  UPDATE_OFFER_SUCCESS,
  props<{
    offer: IOffer;
  }>()
);
export const updateOfferFailure = createAction(
  UPDATE_OFFER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateOfferSucceed = createAction(
  REFRESH_UPDATE_OFFER_SUCCESS
);
export const refreshUpdateOfferFailure = createAction(
  REFRESH_UPDATE_OFFER_FAILURE
);

/* ----------------- */
/* --- Add Offer --- */
/* ----------------- */

export const addOfferRequest = createAction(
  ADD_OFFER_REQUEST,
  props<{ name: string; description?: string; prices: Price[] }>()
);
export const addOfferSuccess = createAction(
  ADD_OFFER_SUCCESS,
  props<{
    offer: IOffer;
  }>()
);
export const addOfferFailure = createAction(
  ADD_OFFER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshAddOfferSucceed = createAction(REFRESH_ADD_OFFER_SUCCESS);
export const refreshAddOfferFailure = createAction(REFRESH_ADD_OFFER_FAILURE);

/* -------------------- */
/* --- Remove Offer --- */
/* -------------------- */

export const removeOfferRequest = createAction(
  REMOVE_OFFER_REQUEST,
  props<{ id: string }>()
);
export const removeOfferSuccess = createAction(
  REMOVE_OFFER_SUCCESS,
  props<{
    offer: IOffer;
  }>()
);
export const removeOfferFailure = createAction(
  REMOVE_OFFER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshRemoveOfferSucceed = createAction(
  REFRESH_REMOVE_OFFER_SUCCESS
);
export const refreshRemoveOfferFailure = createAction(
  REFRESH_REMOVE_OFFER_FAILURE
);
