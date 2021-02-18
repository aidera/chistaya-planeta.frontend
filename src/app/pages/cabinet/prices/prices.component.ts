import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import * as fromRoot from '../../../store/root.reducer';
import * as OffersSelectors from '../../../store/offers/offers.selectors';
import * as OffersActions from '../../../store/offers/offers.actions';
import * as ServicesSelectors from '../../../store/services/services.selectors';
import * as ServicesActions from '../../../store/services/services.actions';
import { IService } from '../../../models/Service';
import { IOffer } from '../../../models/Offer';
import RawUnit from '../../../models/enums/RawUnit';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import PriceType from '../../../models/enums/PriceType';
import SimpleStatus from '../../../models/enums/SimpleStatus';
import Price from '../../../models/types/Price';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit, OnDestroy {
  private offers$: Subscription;
  public offers: IOffer[];
  private offersAreFetching$: Subscription;
  public offersAreFetching: boolean;
  private offersAreUpdating$: Subscription;
  public offersAreUpdating: boolean;
  private offersSucceed$: Subscription;
  private offersError$: Subscription;
  public offersError: string | null;

  private services$: Subscription;
  public services: IService[];
  private servicesAreFetching$: Subscription;
  public servicesAreFetching: boolean;
  private servicesAreUpdating$: Subscription;
  public servicesAreUpdating: boolean;
  private servicesSucceed$: Subscription;
  private servicesError$: Subscription;
  public servicesError: string | null;

  private updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  public offerForm: FormGroup;
  public offerFormActiveField: string | null = null;
  public serviceForm: FormGroup;
  public serviceFormActiveField: string | null = null;

  public simpleStatus = SimpleStatus;
  public rawUnit = RawUnit;

  constructor(
    protected store: Store<fromRoot.State>,
    protected snackBar: MatSnackBar,
    protected socket: SocketIoService
  ) {}

  ngOnInit(): void {
    this.offers$ = this.store
      .select(OffersSelectors.selectOffers)
      .subscribe((offers) => {
        this.offers = offers;
        if (offers === null) {
          this.store.dispatch(OffersActions.getOffersRequest());
        }
      });

    this.offersAreFetching$ = this.store
      .select(OffersSelectors.selectGetOffersIsFetching)
      .subscribe((status) => {
        this.offersAreFetching = status;
      });

    this.offersAreUpdating$ = this.store
      .select(OffersSelectors.selectUpdateOfferIsFetching)
      .subscribe((status) => {
        this.offersAreUpdating = status;
      });

    this.offersSucceed$ = this.store
      .select(OffersSelectors.selectUpdateOfferSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.offerFormActiveField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(OffersActions.refreshUpdateOfferSucceed());
        }
      });

    this.offersError$ = this.store
      .select(OffersSelectors.selectUpdateOfferError)
      .subscribe((error) => {
        this.offersError = error?.code || null;

        if (error) {
          this.updateSnackbar = this.snackBar.open(
            'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(OffersActions.refreshUpdateOfferFailure());
      });

    this.socket.get()?.on('offers', () => {
      this.store.dispatch(OffersActions.getOffersRequest());
    });

    this.services$ = this.store
      .select(ServicesSelectors.selectServices)
      .subscribe((services) => {
        this.services = services;
        if (services === null) {
          this.store.dispatch(ServicesActions.getServicesRequest());
        }
      });

    this.servicesAreFetching$ = this.store
      .select(ServicesSelectors.selectGetServicesIsFetching)
      .subscribe((status) => {
        this.servicesAreFetching = status;
      });

    this.servicesAreUpdating$ = this.store
      .select(ServicesSelectors.selectUpdateServiceIsFetching)
      .subscribe((status) => {
        this.servicesAreUpdating = status;
      });

    this.servicesSucceed$ = this.store
      .select(ServicesSelectors.selectUpdateServiceSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.serviceFormActiveField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(ServicesActions.refreshUpdateServiceSucceed());
        }
      });

    this.servicesError$ = this.store
      .select(ServicesSelectors.selectUpdateServiceError)
      .subscribe((error) => {
        this.servicesError = error?.code || null;

        if (error) {
          this.updateSnackbar = this.snackBar.open(
            'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(ServicesActions.refreshUpdateServiceFailure());
      });

    this.socket.get()?.on('services', () => {
      this.store.dispatch(ServicesActions.getServicesRequest());
    });
  }

  ngOnDestroy(): void {
    this.offers$?.unsubscribe();
    this.offersAreFetching$?.unsubscribe();
    this.offersAreUpdating$?.unsubscribe();
    this.offersSucceed$?.unsubscribe();
    this.offersError$?.unsubscribe();
    this.socket?.get()?.off('offers');

    this.services$?.unsubscribe();
    this.servicesAreFetching$?.unsubscribe();
    this.servicesAreUpdating$?.unsubscribe();
    this.servicesSucceed$?.unsubscribe();
    this.servicesError$?.unsubscribe();
    this.socket?.get()?.off('services');
  }

  private initOfferForm(offer: IOffer): void {
    this.offerForm = new FormGroup({
      kg: new FormGroup({
        amountWithDelivery: new FormControl(
          offer.prices.find((el) => el.unit === RawUnit.kg).amountWithDelivery,
          [Validators.required, Validators.min(0)]
        ),
        amountWithoutDelivery: new FormControl(
          offer.prices.find(
            (el) => el.unit === RawUnit.kg
          ).amountWithoutDelivery,
          [Validators.required, Validators.min(0)]
        ),
      }),
      cube: new FormGroup({
        amountWithDelivery: new FormControl(
          offer.prices.find(
            (el) => el.unit === RawUnit.cube
          ).amountWithDelivery,
          [Validators.required, Validators.min(0)]
        ),
        amountWithoutDelivery: new FormControl(
          offer.prices.find(
            (el) => el.unit === RawUnit.cube
          ).amountWithoutDelivery,
          [Validators.required, Validators.min(0)]
        ),
      }),
    });
  }

  private initServiceForm(offer: IOffer): void {
    this.serviceForm = new FormGroup({
      kg: new FormControl(
        offer.prices.find((el) => el.unit === RawUnit.kg).amount,
        [Validators.required, Validators.min(0)]
      ),
      cube: new FormControl(
        offer.prices.find((el) => el.unit === RawUnit.cube).amount,
        [Validators.required, Validators.min(0)]
      ),
      bag120: new FormControl(
        offer.prices.find((el) => el.unit === RawUnit.bag120).amount,
        [Validators.required, Validators.min(0)]
      ),
      bag160: new FormControl(
        offer.prices.find((el) => el.unit === RawUnit.bag160).amount,
        [Validators.required, Validators.min(0)]
      ),
    });
  }

  public findOfferPriceByUnit(offerId: string, unit: RawUnit): Price {
    return this.offers
      .find((offer) => offer._id === offerId)
      .prices.find((price) => price.unit === unit);
  }

  public findServicePriceByUnit(serviceId: string, unit: RawUnit): Price {
    return this.services
      .find((service) => service._id === serviceId)
      .prices.find((price) => price.unit === unit);
  }

  public setOffersFormActiveField(field: string): void {
    this.offerFormActiveField = field;
    this.initOfferForm(this.offers.find((el) => el._id === field));
  }

  public setServicesFormActiveField(field: string): void {
    this.serviceFormActiveField = field;
    this.initServiceForm(this.services.find((el) => el._id === field));
  }

  public removeOffersFormActiveField(_: string): void {
    this.offerFormActiveField = null;
  }

  public removeServicesFormActiveField(_: string): void {
    this.serviceFormActiveField = null;
  }

  public updateOfferPrices(offerId: string): void {
    if (this.offerForm.valid) {
      this.store.dispatch(
        OffersActions.updateOfferRequest({
          id: offerId,
          prices: [
            {
              type: PriceType.unit,
              unit: RawUnit.kg,
              amountWithDelivery: +this.offerForm
                .get('kg')
                .get('amountWithDelivery').value,
              amountWithoutDelivery: +this.offerForm
                .get('kg')
                .get('amountWithoutDelivery').value,
            },
            {
              type: PriceType.unit,
              unit: RawUnit.cube,
              amountWithDelivery: +this.offerForm
                .get('cube')
                .get('amountWithDelivery').value,
              amountWithoutDelivery: +this.offerForm
                .get('cube')
                .get('amountWithoutDelivery').value,
            },
          ],
        })
      );
    }
  }

  public updateServicePrices(serviceId: string): void {
    if (this.serviceForm.valid) {
      this.store.dispatch(
        ServicesActions.updateServiceRequest({
          id: serviceId,
          prices: [
            {
              type: PriceType.unit,
              unit: RawUnit.kg,
              amount: +this.serviceForm.get('kg').value,
            },
            {
              type: PriceType.unit,
              unit: RawUnit.cube,
              amount: +this.serviceForm.get('cube').value,
            },
            {
              type: PriceType.unit,
              unit: RawUnit.bag120,
              amount: +this.serviceForm.get('bag120').value,
            },
            {
              type: PriceType.unit,
              unit: RawUnit.bag160,
              amount: +this.serviceForm.get('bag160').value,
            },
          ],
        })
      );
    }
  }

  public updateOfferStatus(offerId: string, status: SimpleStatus): void {
    this.store.dispatch(
      OffersActions.updateOfferRequest({
        id: offerId,
        status,
      })
    );
  }

  public updateServiceStatus(serviceId: string, status: SimpleStatus): void {
    this.store.dispatch(
      ServicesActions.updateServiceRequest({
        id: serviceId,
        status,
      })
    );
  }
}
