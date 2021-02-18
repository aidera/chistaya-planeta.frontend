import { Action, createReducer, on } from '@ngrx/store';

import * as OffersActions from './offers.actions';
import { ServerError } from '../../models/ServerResponse';
import { IOffer } from '../../models/Offer';

export const offersInitialState = {
  offers: null as IOffer[] | null,

  getOffersIsFetching: false,
  getOffersError: null as ServerError | null,

  updateOfferIsFetching: false,
  updateOfferError: null as ServerError | null,
  updateOfferSucceed: false as boolean,

  addOfferIsFetching: false,
  addOfferError: null as ServerError | null,
  addOfferSucceed: false as boolean,

  removeOfferIsFetching: false,
  removeOfferError: null as ServerError | null,
  removeOfferSucceed: false as boolean,
};
export type OffersState = typeof offersInitialState;

const _offersReducer = createReducer(
  offersInitialState,

  /* ------------------ */
  /* --- Get Offers --- */
  /* ------------------ */

  on(OffersActions.getOffersRequest, (state) => ({
    ...state,
    getOffersIsFetching: true,
    getOffersError: null,
  })),
  on(OffersActions.getOffersSuccess, (state, payload) => ({
    ...state,
    offers: payload.offers,
    getOffersIsFetching: false,
    getOffersError: null,
  })),
  on(OffersActions.getOffersFailure, (state, payload) => ({
    ...state,
    getOffersIsFetching: false,
    getOffersError: payload.error,
  })),

  /* -------------------- */
  /* --- Update Offer --- */
  /* -------------------- */

  on(OffersActions.updateOfferRequest, (state) => ({
    ...state,
    updateOfferIsFetching: true,
    updateOfferError: null,
  })),
  on(OffersActions.updateOfferSuccess, (state, payload) => ({
    ...state,
    offers: state.offers.map((el) => {
      if (el._id === payload.offer._id) {
        return payload.offer;
      }
      return el;
    }),
    updateOfferIsFetching: false,
    updateOfferError: null,
    updateOfferSucceed: true,
  })),
  on(OffersActions.updateOfferFailure, (state, payload) => ({
    ...state,
    updateOfferIsFetching: false,
    updateOfferError: payload.error,
  })),
  on(OffersActions.refreshUpdateOfferSucceed, (state) => ({
    ...state,
    updateOfferSucceed: false,
  })),
  on(OffersActions.refreshUpdateOfferFailure, (state) => ({
    ...state,
    updateOfferError: null,
  })),

  /* ----------------- */
  /* --- Add Offer --- */
  /* ----------------- */

  on(OffersActions.addOfferRequest, (state) => ({
    ...state,
    addOfferIsFetching: true,
    addOfferError: null,
  })),
  on(OffersActions.addOfferSuccess, (state, payload) => ({
    ...state,
    offers: [payload.offer, ...state.offers],
    addOfferIsFetching: false,
    addOfferError: null,
    addOfferSucceed: true,
  })),
  on(OffersActions.addOfferFailure, (state, payload) => ({
    ...state,
    addOfferIsFetching: false,
    addOfferError: payload.error,
  })),
  on(OffersActions.refreshAddOfferSucceed, (state) => ({
    ...state,
    addOfferSucceed: false,
  })),
  on(OffersActions.refreshAddOfferFailure, (state) => ({
    ...state,
    addOfferError: null,
  })),

  /* -------------------- */
  /* --- Remove Offer --- */
  /* -------------------- */

  on(OffersActions.removeOfferRequest, (state) => ({
    ...state,
    removeOfferIsFetching: true,
    removeOfferError: null,
  })),
  on(OffersActions.removeOfferSuccess, (state, payload) => ({
    ...state,
    offers: state.offers.filter((el) => el._id !== payload.offer._id),
    removeOfferIsFetching: false,
    removeOfferError: null,
    removeOfferSucceed: true,
  })),
  on(OffersActions.removeOfferFailure, (state, payload) => ({
    ...state,
    removeOfferIsFetching: false,
    removeOfferError: payload.error,
  })),
  on(OffersActions.refreshRemoveOfferSucceed, (state) => ({
    ...state,
    removeOfferSucceed: false,
  })),
  on(OffersActions.refreshRemoveOfferFailure, (state) => ({
    ...state,
    removeOfferError: null,
  }))
);

export function offersReducer(
  state: OffersState | undefined,
  action: Action
): OffersState {
  return _offersReducer(state, action);
}
