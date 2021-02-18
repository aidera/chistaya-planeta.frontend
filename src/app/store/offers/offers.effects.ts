import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as OffersActions from './offers.actions';
import { OffersApiService } from '../../services/api/offers-api.service';

@Injectable()
export class OffersEffects {
  constructor(private actions$: Actions, private offersApi: OffersApiService) {}

  getOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.getOffersRequest),
      switchMap((_) => {
        return this.offersApi.get().pipe(
          map((resData) => {
            if (resData && resData.offers) {
              return OffersActions.getOffersSuccess({
                offers: resData.offers,
              });
            }
            return OffersActions.getOffersFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OffersActions.getOffersFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.updateOfferRequest),
      switchMap((action) => {
        return this.offersApi
          .update(action.id, {
            name: action.name,
            description: action.description,
            status: action.status,
            prices: action.prices,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOffer) {
                return OffersActions.updateOfferSuccess({
                  offer: resData.updatedOffer,
                });
              }
              return OffersActions.updateOfferFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OffersActions.updateOfferFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.addOfferRequest),
      switchMap((action) => {
        return this.offersApi
          .add({
            name: action.name,
            description: action.description,
            prices: action.prices,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedOffer) {
                return OffersActions.addOfferSuccess({
                  offer: resData.addedOffer,
                });
              }
              return OffersActions.addOfferFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OffersActions.addOfferFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  removeOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.removeOfferRequest),
      switchMap((action) => {
        return this.offersApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedOffer) {
              return OffersActions.removeOfferSuccess({
                offer: resData.removedOffer,
              });
            }
            return OffersActions.removeOfferFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OffersActions.removeOfferFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
