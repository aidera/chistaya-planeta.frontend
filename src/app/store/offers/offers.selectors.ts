import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { OffersState } from './offers.reducer';

export const selectAll = (state: State) => state.offers;

export const selectOffers = createSelector(
  selectAll,
  (state: OffersState) => state.offers
);

export const selectGetOffersIsFetching = createSelector(
  selectAll,
  (state: OffersState) => state.getOffersIsFetching
);

export const selectGetOffersError = createSelector(
  selectAll,
  (state: OffersState) => state.getOffersError
);

export const selectUpdateOfferIsFetching = createSelector(
  selectAll,
  (state: OffersState) => state.updateOfferIsFetching
);

export const selectUpdateOfferError = createSelector(
  selectAll,
  (state: OffersState) => state.updateOfferError
);

export const selectUpdateOfferSucceed = createSelector(
  selectAll,
  (state: OffersState) => state.updateOfferSucceed
);

export const selectAddOfferIsFetching = createSelector(
  selectAll,
  (state: OffersState) => state.addOfferIsFetching
);

export const selectAddOfferSucceed = createSelector(
  selectAll,
  (state: OffersState) => state.addOfferSucceed
);

export const selectAddOfferError = createSelector(
  selectAll,
  (state: OffersState) => state.addOfferError
);

export const selectRemoveOfferIsFetching = createSelector(
  selectAll,
  (state: OffersState) => state.removeOfferIsFetching
);

export const selectRemoveOfferSucceed = createSelector(
  selectAll,
  (state: OffersState) => state.removeOfferSucceed
);

export const selectRemoveOfferError = createSelector(
  selectAll,
  (state: OffersState) => state.removeOfferError
);
