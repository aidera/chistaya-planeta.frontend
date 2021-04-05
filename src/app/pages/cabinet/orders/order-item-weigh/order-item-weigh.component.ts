import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as UsersSelectors from '../../../../store/users/users.selectors';
import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import * as OrdersActions from '../../../../store/orders/orders.actions';
import * as OffersSelectors from '../../../../store/offers/offers.selectors';
import * as OffersActions from '../../../../store/offers/offers.actions';
import * as ServicesSelectors from '../../../../store/services/services.selectors';
import * as ServicesActions from '../../../../store/services/services.actions';
import { IOrder } from '../../../../models/Order';
import { IEmployee } from '../../../../models/Employee';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { OptionsService } from '../../../../services/options/options.service';
import { OptionType } from '../../../../models/types/OptionType';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import {
  unitOffersOptions,
  unitServicesOptions,
  unitStrings,
} from '../../../../data/unitOptions';
import { responseCodes } from '../../../../data/responseCodes';
import { OrderType } from '../../../../models/enums/OrderType';
import { orderTypeStrings } from '../../../../data/orderTypeData';
import { IOffer, IOfferToWeigh } from '../../../../models/Offer';
import { IService, IServiceToWeigh } from '../../../../models/Service';
import { DeliveryType } from 'src/app/models/enums/DeliveryType';
import { deliveryTypeStrings } from '../../../../data/deliveryTypeData';
import { GettersService } from '../../../../services/getters/getters.service';

@Component({
  selector: 'app-order-item-weigh',
  templateUrl: './order-item-weigh.component.html',
  styleUrls: ['./order-item-weigh.component.scss'],
})
export class OrderItemWeighComponent implements OnInit, OnDestroy {
  /* ------------- */
  /* User settings */
  /* --------------*/
  protected user$: Subscription;
  public user: IEmployee;

  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public orderId: string;
  private order$: Subscription;
  public order: IOrder;
  private orderIsFetching$: Subscription;
  public orderIsFetching: boolean;
  private getOrderError$: Subscription;
  public getOrderError: string | null;
  private orderIsUpdating$: Subscription;
  public orderIsUpdating: boolean;
  private updateOrderError$: Subscription;
  public updateOrderError: string | null;
  private orderIsUpdatedSucceed$: Subscription;

  /* -------------------- */
  /* Other items settings */
  /* -------------------- */
  public offers$: Subscription;
  public offers: IOffer[];
  public services$: Subscription;
  public services: IService[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public offersOptions$: Subscription;
  public offersOptions: OptionType[] = [];
  public servicesOptions$: Subscription;
  public servicesOptions: OptionType[] = [];

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public form: FormGroup;
  public paymentSum = 0;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderType = OrderType;
  public orderTypeStrings = orderTypeStrings;
  public unitStrings = unitStrings;
  public unitOffersOptions = unitOffersOptions;
  public unitServicesOptions = unitServicesOptions;
  public deliveryTypeStrings = deliveryTypeStrings;

  constructor(
    private title: Title,
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private options: OptionsService,
    public getters: GettersService
  ) {
    title.setTitle('Взвесить заявку - Чистая планета');
  }

  ngOnInit(): void {
    /* --------------------------------- */
    /* --- Getting order ID from URL --- */
    /* --------------------------------- */

    this.route.paramMap.subscribe((paramMap) => {
      this.orderId = paramMap.get('id');
      this.getItemRequest(true);
    });

    /* ------------------ */
    /* --- Forms init --- */
    /* ------------------ */

    this.initForm();

    /* ------------------------------ */
    /* --- Main store connections --- */
    /* ------------------------------ */

    this.user$ = this.store
      .select(UsersSelectors.selectUser)
      .subscribe((user) => {
        this.user = user as IEmployee;
      });

    this.order$ = this.store
      .select(OrdersSelectors.selectOrder)
      .subscribe((order) => {
        this.order = order;

        if (this.order) {
          if (this.order.type === OrderType.offer) {
            if (this.order.weighed.offers.length > 0) {
              (this.form.get('offers') as FormArray).clear();

              this.order.weighed.offers.forEach((offer) => {
                (this.form.get('offers') as FormArray).push(
                  new FormGroup({
                    id: new FormControl(
                      (offer.item as IOffer)._id,
                      Validators.required
                    ),
                    amount: new FormControl(offer.amount, Validators.required),
                    unit: new FormControl(
                      offer.amountUnit + '',
                      Validators.required
                    ),
                  })
                );
              });
            }
          }
          if (this.order.type === OrderType.service) {
            if (this.order.weighed.services.length > 0) {
              this.form.get('services').setValue({
                amount: this.order.weighed.services[0].amount,
                unit: this.order.weighed.services[0].amountUnit + '',
              });
            }
          }
        }

        this.onDependenciesLoad();
      });

    this.getOrderError$ = this.store
      .select(OrdersSelectors.selectGetOrderError)
      .subscribe((error) => {
        if (error?.code) {
          this.getOrderError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getOrderError = null;
        }
      });

    this.orderIsFetching$ = this.store
      .select(OrdersSelectors.selectGetOrderIsFetching)
      .subscribe((status) => {
        this.orderIsFetching = status;
      });

    this.orderIsUpdating$ = this.store
      .select(OrdersSelectors.selectUpdateOrderIsFetching)
      .subscribe((status) => {
        this.orderIsUpdating = status;
      });

    this.orderIsUpdatedSucceed$ = this.store
      .select(OrdersSelectors.selectUpdateOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(OrdersActions.refreshUpdateOrderSucceed());
          this.router.navigate(['../../', this.orderId], {
            relativeTo: this.route,
          });
        }
      });

    this.updateOrderError$ = this.store
      .select(OrdersSelectors.selectUpdateOrderError)
      .subscribe((error) => {
        if (error) {
          if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.updateSnackbar = this.snackBar.open(
                'Некорректный email',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.updateSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
            if (error.description.includes('division')) {
              this.updateSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно былы удалёно',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else {
            this.updateSnackbar = this.snackBar.open(
              'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(OrdersActions.refreshUpdateOrderFailure());
      });

    this.socket.get()?.on('orders', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.order?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    this.store.dispatch(OffersActions.getOffersRequest());
    this.offers$ = this.store
      .select(OffersSelectors.selectOffers)
      .subscribe((offers) => {
        this.offers = offers;
        this.onDependenciesLoad();
      });
    this.socket.get()?.on('offers', () => {
      this.store.dispatch(OffersActions.getOffersRequest());
    });

    this.store.dispatch(ServicesActions.getServicesRequest());
    this.services$ = this.store
      .select(ServicesSelectors.selectServices)
      .subscribe((services) => {
        this.services = services;
        this.onDependenciesLoad();
      });
    this.socket.get()?.on('services', () => {
      this.store.dispatch(ServicesActions.getServicesRequest());
    });

    /* --------------------------- */
    /* --- Options connections --- */
    /* --------------------------- */

    this.offersOptions$ = this.options
      .getOffersOptions({
        statuses: [SimpleStatus.active],
      })
      .subscribe((value) => {
        this.offersOptions = value;
      });

    this.servicesOptions$ = this.options
      .getServicesOptions({
        statuses: [SimpleStatus.active],
      })
      .subscribe((value) => {
        this.servicesOptions = value;
      });
  }

  ngOnDestroy(): void {
    this.order$?.unsubscribe?.();
    this.orderIsFetching$?.unsubscribe?.();
    this.getOrderError$?.unsubscribe?.();
    this.orderIsUpdating$?.unsubscribe?.();
    this.updateOrderError$?.unsubscribe?.();
    this.orderIsUpdatedSucceed$?.unsubscribe?.();

    this.socket.get()?.off('orders');

    this.offers$?.unsubscribe?.();
    this.socket.get()?.off('offers');
    this.services$?.unsubscribe?.();
    this.socket.get()?.off('services');

    this.user$?.unsubscribe?.();

    this.servicesOptions$?.unsubscribe?.();
    this.offersOptions$?.unsubscribe?.();

    this.options.destroyOffersOptions();
    this.options.destroyServicesOptions();
  }

  private getItemRequest(withLoading: boolean): void {
    this.store.dispatch(
      OrdersActions.getOrderRequest({ id: this.orderId, withLoading })
    );
  }

  private initForm(): void {
    this.form = new FormGroup({
      offers: new FormArray([
        new FormGroup({
          id: new FormControl('', Validators.required),
          amount: new FormControl('', Validators.required),
          unit: new FormControl('', Validators.required),
        }),
      ]),
      services: new FormGroup({
        amount: new FormControl('', Validators.required),
        unit: new FormControl('', Validators.required),
      }),
    });

    this.form.get('offers').valueChanges.subscribe((offersToWeight) => {
      this.calculatePaymentSum(
        offersToWeight.map((offer) => {
          return {
            id: offer.id,
            amount: +offer.amount,
            unit: +offer.unit,
          } as IOfferToWeigh;
        })
      );
    });

    this.form.get('services').valueChanges.subscribe((service) => {
      if (this.services) {
        this.calculatePaymentSum([
          {
            id: this.services[0]._id,
            amount: +service.amount,
            unit: +service.unit,
          } as IServiceToWeigh,
        ]);
      }
    });
  }

  public addWeighOffersFormPosition(): void {
    (this.form.get('offers') as FormArray).push(
      new FormGroup({
        id: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
        unit: new FormControl('', Validators.required),
      })
    );
  }

  public removeWeighOffersFormPosition(index: number): void {
    (this.form.get('offers') as FormArray).controls.splice(index, 1);
  }

  public getOfferNameFromId(id: string): string {
    return this.offersOptions?.find((offer) => offer.value === id)?.text || '';
  }

  public getServiceNameFromId(id: string): string {
    return (
      this.servicesOptions?.find((service) => service.value === id)?.text || ''
    );
  }

  public getOfferCost(id: string, unit: string, amount: string): string {
    if (this.order && this.offers) {
      const targetOffer = this.offers.find((offer) => offer._id === id)?.prices;
      const targetOfferPrice = targetOffer?.find(
        (price) => price.unit === +unit
      );
      if (this.order.delivery._type === DeliveryType.company) {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithDelivery * +amount + ''
          : '0';
      } else {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithoutDelivery * +amount + ''
          : '0';
      }
    } else {
      return '0';
    }
  }

  public getServiceCost(unit: string, amount: string): string {
    if (this.order && this.services) {
      const targetService = this.services[0].prices;
      const targetServicePrice = targetService?.find(
        (price) => price.unit === +unit
      );
      return targetServicePrice
        ? targetServicePrice?.amount * +amount + ''
        : '0';
    } else {
      return '0';
    }
  }

  private calculatePaymentSum(
    itemsToWeight: IOfferToWeigh[] | IServiceToWeigh[]
  ): void {
    let sum = 0;

    if (this.offers && this.order && this.services && itemsToWeight) {
      if (this.order.type === OrderType.offer) {
        // 1. Going for each requested offers
        (itemsToWeight as IOfferToWeigh[]).forEach((offerToWeight) => {
          // 3. Compare them with real offers (find by real offer id)
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.offers.length; i++) {
            if (offerToWeight.id === this.offers[i]._id) {
              // 4. Checking requested unit in this offer
              // tslint:disable-next-line:prefer-for-of
              for (let i2 = 0; i2 < this.offers[i].prices.length; i2++) {
                if (+offerToWeight.unit === this.offers[i].prices[i2].unit) {
                  // 5. Delivery type makes different amount, so we need to check
                  if (
                    this.order.delivery._type === DeliveryType.company ||
                    this.order.type
                  ) {
                    sum =
                      sum +
                      this.offers[i].prices[i2].amountWithDelivery *
                        +offerToWeight.amount;
                  } else {
                    sum =
                      sum +
                      this.offers[i].prices[i2].amountWithoutDelivery *
                        +offerToWeight.amount;
                  }

                  break;
                }
              }

              break;
            }
          }
        });
      }

      if (this.order.type === OrderType.service) {
        // 1. Going for each requested services
        (itemsToWeight as IServiceToWeigh[]).forEach((serviceToWeight) => {
          // 3. Compare them with real services (find by real service id)
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.services.length; i++) {
            if (serviceToWeight.id === this.services[i]._id) {
              // 4. Checking requested unit in this service
              // tslint:disable-next-line:prefer-for-of
              for (let i2 = 0; i2 < this.services[i].prices.length; i2++) {
                if (
                  +serviceToWeight.unit === this.services[i].prices[i2].unit
                ) {
                  sum =
                    sum +
                    this.services[i].prices[i2].amount *
                      +serviceToWeight.amount;
                  break;
                }
              }
              break;
            }
          }
        });
      }
    }

    this.paymentSum = sum;
  }

  public onDependenciesLoad(): void {
    if (this.order && this.paymentSum === 0) {
      if (
        this.order.type === OrderType.offer &&
        this.order.weighed.offers.length > 0
      ) {
        this.calculatePaymentSum(
          this.order.weighed.offers.map((offer) => {
            return {
              id: (offer.item as IOffer)._id,
              amount: offer.amount,
              unit: offer.amountUnit,
            } as IOfferToWeigh;
          })
        );
      }
      if (
        this.order.type === OrderType.service &&
        this.order.weighed.services.length > 0 &&
        this.services
      ) {
        this.calculatePaymentSum(
          this.order.weighed.services.map((offer) => {
            return {
              id: this.services[0]._id,
              amount: offer.amount,
              unit: offer.amountUnit,
            } as IServiceToWeigh;
          })
        );
      }
    }
  }

  public weighOrder(): void {
    if (this.user && this.order) {
      if (this.order?.type === OrderType.offer) {
        Object.keys((this.form.get('offers') as FormArray).controls).forEach(
          (field, i) => {
            const control1 = (this.form.get('offers') as FormArray).controls[
              i
            ].get('id');
            const control2 = (this.form.get('offers') as FormArray).controls[
              i
            ].get('amount');
            const control3 = (this.form.get('offers') as FormArray).controls[
              i
            ].get('unit');
            control1.markAsTouched({ onlySelf: true });
            control2.markAsTouched({ onlySelf: true });
            control3.markAsTouched({ onlySelf: true });
          }
        );

        if (this.form.get('offers').valid) {
          this.store.dispatch(
            OrdersActions.weighOrderRequest({
              id: this.order._id,
              offers: (this.form.get('offers') as FormArray).controls.map(
                (offer) => {
                  return {
                    id: offer.get('id').value,
                    amount: +offer.get('amount').value,
                    unit: +offer.get('unit').value,
                  };
                }
              ),
            })
          );
        }
      }

      if (this.order?.type === OrderType.service) {
        this.form
          .get('services')
          .get('amount')
          .markAsTouched({ onlySelf: true });
        this.form.get('services').get('unit').markAsTouched({ onlySelf: true });

        if (this.form.get('services').valid) {
          this.store.dispatch(
            OrdersActions.weighOrderRequest({
              id: this.order._id,
              services: [
                {
                  id: this.services[0]._id,
                  amount: +this.form.get('services').get('amount').value,
                  unit: +this.form.get('services').get('unit').value,
                },
              ],
            })
          );
        }
      }
    }
  }
}
