import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

import * as OrdersActions from '../../../../store/orders/orders.actions';
import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import SimpleStatus from '../../../../models/enums/SimpleStatus';
import CarStatus from '../../../../models/enums/CarStatus';
import { responseCodes } from '../../../../data/responseCodes';
import { ILocality } from '../../../../models/Locality';
import { IDivision } from '../../../../models/Division';
import { ICar } from '../../../../models/Car';
import { IOrder } from '../../../../models/Order';
import {
  orderStatusOptions,
  orderStatusColors,
  orderStatusStrings,
} from '../../../../data/orderStatusData';
import { orderTypeStrings } from '../../../../data/orderTypeData';
import OrderType from '../../../../models/enums/OrderType';
import { ItemFieldListElement } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { IOffer } from '../../../../models/Offer';
import DeliveryType from '../../../../models/enums/DeliveryType';
import { deliveryTypeStrings } from '../../../../data/deliveryTypeData';
import { paymentMethodStrings } from '../../../../data/paymentMethodData';
import { unitStrings } from '../../../../data/unitOptions';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  public item: IOrder;

  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public driversOptions$: Subscription;
  public driversOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];

  public orderStatusOptions = orderStatusOptions;
  public orderStatusColors = orderStatusColors;
  public orderStatusStrings = orderStatusStrings;
  public orderTypeStrings = orderTypeStrings;
  public deliveryTypeStrings = deliveryTypeStrings;
  public paymentMethodStrings = paymentMethodStrings;
  public orderType = OrderType;
  public deliveryType = DeliveryType;

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initDivisionsOptions();
    this.options.initEmployeesOptions();
    this.options.initCarsOptions();

    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl(''),
        companyComment: new FormControl(''),
        division: new FormControl(''),
        driver: new FormControl(''),
        car: new FormControl(''),
      });
    };

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        OrdersActions.getOrderRequest({ id: this.itemId, withLoading })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */

    this.item$ = this.store
      .select(OrdersSelectors.selectOrder)
      .subscribe((order) => {
        this.item = order;

        this.initForm();

        if (this.form && order) {
          this.form.setValue({
            status: String(order.status) || '',
            companyComment: String(order.companyComment) || '',
            division: (order.division as IDivision)?._id || '',
            driver: (order.performers.driver as IEmployee)?._id || '',
            car: (order.performers.car as ICar)?._id || '',
          });
        }

        /* ----------------------------------- */
        /* Options requests in item connection */
        /* ----------------------------------- */

        /* Divisions */
        this.divisionsOptions$?.unsubscribe();
        this.divisionsOptions$ = this.options
          .getDivisionsOptions({
            statuses: [SimpleStatus.active],
            localitiesIds: (order?.locality as ILocality)?._id
              ? [(order?.locality as ILocality)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.divisionsOptions = value;
          });

        /* Cars */
        this.carsOptions$?.unsubscribe();
        this.carsOptions$ = this.options
          .getCarsOptions({
            statuses: [CarStatus.active, CarStatus.temporaryUnavailable],
            divisionsIds: (order?.division as IDivision)?._id
              ? [(order?.division as IDivision)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.carsOptions = value;
          });
      });

    this.getItemError$ = this.store
      .select(OrdersSelectors.selectGetOrderError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(OrdersSelectors.selectGetOrderIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(OrdersSelectors.selectUpdateOrderIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(OrdersSelectors.selectUpdateOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(OrdersActions.refreshUpdateOrderSucceed());
        }
      });

    this.updateItemError$ = this.store
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
        if (this.item?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('orders');

    this.divisionsOptions$?.unsubscribe?.();
    this.driversOptions$?.unsubscribe?.();
    this.carsOptions$?.unsubscribe?.();

    this.options.destroyDivisionsOptions();
    this.options.destroyEmployeesOptions();
    this.options.destroyCarsOptions();
  }

  public getOffersAmount(): string | undefined {
    if (this.item?.offers) {
      const unit = unitStrings[this.item?.offers?.amountUnit];
      return this.item.offers.amount + ' ' + unit;
    }
    return undefined;
  }

  public getServicesAmount(): string | undefined {
    if (this.item?.services) {
      const unit = unitStrings[this.item?.services?.amountUnit];
      return this.item.services.amount + ' ' + unit;
    }
    return undefined;
  }

  public getOffersList(): ItemFieldListElement[] {
    if (this.item?.offers?.items) {
      return (this.item.offers.items as IOffer[]).map((offer) => {
        return {
          text: offer.name,
          color: offer.status === SimpleStatus.inactive ? 'red' : undefined,
        };
      });
    }
    return [];
  }

  public getWeighedOffersList(): ItemFieldListElement[] {
    if (this.item?.weighed?.offers) {
      return (this.item?.weighed?.offers).map((offer) => {
        return {
          text:
            (offer.item as IOffer)?.name +
            ' - ' +
            offer.amount +
            ' ' +
            unitStrings[offer.amountUnit] +
            ' (' +
            offer.paymentAmount +
            ' руб.)',
        };
      });
    }
    return [];
  }

  public getWeighedServicesList(): ItemFieldListElement[] {
    if (this.item?.weighed?.services) {
      return (this.item?.weighed?.services).map((service) => {
        return {
          text:
            service.amount +
            ' ' +
            unitStrings[service.amountUnit] +
            ' (' +
            service.paymentAmount +
            ' руб.)',
        };
      });
    }
    return [];
  }
}
