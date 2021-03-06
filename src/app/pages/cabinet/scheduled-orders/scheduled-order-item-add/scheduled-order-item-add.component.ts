import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as ScheduledOrdersSelectors from '../../../../store/scheduled-orders/scheduled-orders.selectors';
import * as ScheduledOrdersActions from '../../../../store/scheduled-orders/scheduled-orders.actions';
import * as OffersActions from '../../../../store/offers/offers.actions';
import * as OffersSelectors from '../../../../store/offers/offers.selectors';
import * as ServicesActions from '../../../../store/services/services.actions';
import * as ServicesSelectors from '../../../../store/services/services.selectors';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { OptionType } from '../../../../models/types/OptionType';
import { IOffer } from '../../../../models/Offer';
import { IService } from '../../../../models/Service';
import { timeOptions } from '../../../../data/timeOptions';
import {
  unitOffersOptions,
  unitServicesOptions,
} from '../../../../data/unitOptions';
import { OrderType } from '../../../../models/enums/OrderType';
import { DeliveryType } from '../../../../models/enums/DeliveryType';
import { PaymentMethod } from '../../../../models/enums/PaymentMethod';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { tomorrow } from '../../../../utils/date.functions';
import { orderTypeOptions } from '../../../../data/orderTypeData';
import { deliveryTypeOptions } from '../../../../data/deliveryTypeData';
import {
  paymentMethodOffersOptions,
  paymentMethodServicesOptions,
} from '../../../../data/paymentMethodData';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { ILocality } from '../../../../models/Locality';
import { responseCodes } from '../../../../data/responseCodes';
import { IAddScheduledOrderRequest } from '../../../../services/api/scheduled-orders-api.service';
import { periodTypeOptions } from '../../../../data/periodTypeData';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { ClientsApiService } from '../../../../services/api/clients-api.service';
import { HelpersService } from '../../../../services/helpers/helpers.service';

@Component({
  selector: 'app-scheduled-order-item-add',
  templateUrl: './scheduled-order-item-add.component.html',
  styleUrls: ['./scheduled-order-item-add.component.scss'],
})
export class ScheduledOrderItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  /* -------------------- */
  /* Other Items Settings */
  /* -------------------- */
  public offers$: Subscription;
  public offers: IOffer[];
  public services$: Subscription;
  public services: IService[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public offersOptions$: Subscription;
  public offersOptions: OptionType[] = [];
  public servicesOptions$: Subscription;
  public servicesOptions: OptionType[] = [];

  /* ------------------ */
  /* Interface settings */
  /* ------------------ */
  public startMinDate = tomorrow;
  public approximatePaymentCost: string;
  public approximateRemunerationCost: string;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderType = OrderType;
  public deliveryType = DeliveryType;
  public paymentMethod = PaymentMethod;
  public employeeRole = EmployeeRole;
  public periodTypeOptions = periodTypeOptions;
  public orderTypeOptions = orderTypeOptions;
  public deliveryTypeOptions = deliveryTypeOptions;
  public paymentMethodOffersOptions = paymentMethodOffersOptions;
  public paymentMethodServicesOptions = paymentMethodServicesOptions;
  public selectTimeOptions = timeOptions;
  public offersUnitOptions = unitOffersOptions;
  public servicesUnitOptions = unitServicesOptions;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    /* this */
    private title: Title,
    private options: OptionsService,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private clientsApi: ClientsApiService,
    private helpers: HelpersService
  ) {
    super(store, router, route);

    title.setTitle('Добавить периодическую заявку - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initOffersOptions();
    this.options.initServicesOptions();

    /* -------------------------- */
    /* Localities options request */
    /* -------------------------- */

    this.localitiesOptions$ = this.options
      .getLocalitiesOptions({ statuses: [SimpleStatus.active] })
      .subscribe((value) => {
        this.localitiesOptions = value;
      });

    /* ---------------------- */
    /* Offers options request */
    /* ---------------------- */

    this.offersOptions$ = this.options
      .getOffersOptions({ statuses: [SimpleStatus.active] })
      .subscribe((value) => {
        this.offersOptions = value;
      });

    /* ------------------------ */
    /* Services options request */
    /* ------------------------ */

    this.servicesOptions$ = this.options
      .getServicesOptions({ statuses: [SimpleStatus.active] })
      .subscribe((value) => {
        this.servicesOptions = value;
      });

    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        periodType: new FormControl('', Validators.required),
        periodAmount: new FormControl('1', [
          Validators.required,
          Validators.min(1),
        ]),

        type: new FormControl('', Validators.required),

        startDate: new FormControl('', Validators.required),

        locality: new FormControl('', Validators.required),

        client: new FormControl(''),

        offersItems: new FormControl([]),
        offersAmountUnit: new FormControl(''),
        offersAmount: new FormControl(''),

        servicesAmountUnit: new FormControl(''),
        servicesAmount: new FormControl(''),

        customerContactName: new FormControl(
          this.userClient ? this.userClient.name : '',
          Validators.required
        ),
        customerContactPhone: new FormControl(
          this.userClient ? this.userClient.phone.substr(2) : '',
          Validators.required
        ),
        customerOrganizationLegalName: new FormControl(''),
        customerOrganizationActualName: new FormControl(''),

        deliveryType: new FormControl(''),
        deliveryCustomerCarNumber: new FormControl(''),
        deliveryHasAssistant: new FormControl(''),
        deliveryAddressFromStreet: new FormControl(''),
        deliveryAddressFromHouse: new FormControl(''),

        paymentMethod: new FormControl(''),
        paymentMethodData: new FormControl(''),

        customerComment: new FormControl(''),
        companyComment: new FormControl(''),
      });

      this.form
        .get('client')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.clientsApi
              .checkId(this.form.get('client').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode !== responseCodes.found) {
                  this.form.get('client').markAsTouched();
                  this.form.get('client').setErrors({ notExists: true });
                }
              });
          }
        });

      this.form.get('locality').valueChanges.subscribe((fieldValue) => {
        /* ------------------------- */
        /* Divisions options request */
        /* ------------------------- */

        this.divisionsOptions$?.unsubscribe();
        this.divisionsOptions$ = this.options
          .getDivisionsOptions({
            useAddress: true,
            statuses: [SimpleStatus.active],
            localitiesIds: fieldValue ? [fieldValue] : undefined,
          })
          .subscribe((value) => {
            this.divisionsOptions = value;
          });
      });

      /* --- Смена валидаторов на "Тип заказа" --- */
      this.form.get('type').valueChanges.subscribe((value) => {
        this.form.get('offersItems').clearValidators();
        this.form.get('offersItems').setErrors(null);
        this.form.get('offersItems').setValue([]);
        this.form.get('offersAmountUnit').clearValidators();
        this.form.get('offersAmountUnit').setErrors(null);
        this.form.get('offersAmountUnit').setValue('');
        this.form.get('offersAmount').clearValidators();
        this.form.get('offersAmount').setErrors(null);
        this.form.get('offersAmount').setValue('');

        this.form.get('servicesAmountUnit').clearValidators();
        this.form.get('servicesAmountUnit').setErrors(null);
        this.form.get('servicesAmountUnit').setValue('');
        this.form.get('servicesAmount').clearValidators();
        this.form.get('servicesAmount').setErrors(null);
        this.form.get('servicesAmount').setValue('');

        this.form.get('deliveryType').clearValidators();
        this.form.get('deliveryType').setErrors(null);
        this.form.get('deliveryType').setValue('');
        this.form.get('deliveryCustomerCarNumber').clearValidators();
        this.form.get('deliveryCustomerCarNumber').setErrors(null);
        this.form.get('deliveryCustomerCarNumber').setValue('');
        this.form.get('deliveryHasAssistant').clearValidators();
        this.form.get('deliveryHasAssistant').setErrors(null);
        this.form.get('deliveryAddressFromStreet').clearValidators();
        this.form.get('deliveryAddressFromStreet').setErrors(null);
        this.form.get('deliveryAddressFromStreet').setValue('');
        this.form.get('deliveryAddressFromHouse').clearValidators();
        this.form.get('deliveryAddressFromHouse').setErrors(null);
        this.form.get('deliveryAddressFromHouse').setValue('');

        this.form.get('paymentMethod').clearValidators();
        this.form.get('paymentMethod').setErrors(null);
        this.form.get('paymentMethod').setValue('');
        this.form.get('paymentMethodData').clearValidators();
        this.form.get('paymentMethodData').setErrors(null);
        this.form.get('paymentMethodData').setValue('');

        if (value === OrderType.offer + '') {
          this.form.get('offersItems').setValidators(Validators.required);
          this.form.get('offersAmountUnit').setValidators(Validators.required);
          this.form.get('offersAmount').setValidators(Validators.required);

          this.form.get('deliveryType').setValidators(Validators.required);
        }

        if (value === OrderType.service + '') {
          this.form
            .get('servicesAmountUnit')
            .setValidators(Validators.required);
          this.form.get('servicesAmount').setValidators(Validators.required);
          this.form.get('paymentMethod').setValidators(Validators.required);
        }

        this.approximateCostChange();
      });

      /* --- Смена валидаторов на "Тип доставки" --- */
      /* Если тип доставки выбран "Компанией", то должны показатся поля с городом,
      адресом, улицей и домом, а также помошником */
      /* Если тип доставки выбран "Самовывоз", то поля с городом, адресом, улицей,
      домом и помошником убираются, но появляется номер автомобиля заказчика */
      this.form.get('deliveryType').valueChanges.subscribe((value) => {
        const orderType = this.form.get('type').value;
        const deliveryType = this.form.get('deliveryType').value;

        this.form.get('deliveryCustomerCarNumber').clearValidators();
        this.form.get('deliveryCustomerCarNumber').setErrors(null);
        this.form.get('deliveryCustomerCarNumber').setValue('');
        this.form.get('deliveryHasAssistant').clearValidators();
        this.form.get('deliveryHasAssistant').setErrors(null);
        this.form.get('deliveryAddressFromStreet').clearValidators();
        this.form.get('deliveryAddressFromStreet').setErrors(null);
        this.form.get('deliveryAddressFromStreet').setValue('');
        this.form.get('deliveryAddressFromHouse').clearValidators();
        this.form.get('deliveryAddressFromHouse').setErrors(null);
        this.form.get('deliveryAddressFromHouse').setValue('');

        if (orderType === OrderType.offer + '') {
          if (deliveryType === DeliveryType.company + '') {
            this.form
              .get('deliveryAddressFromStreet')
              .setValidators(Validators.required);
            this.form
              .get('deliveryAddressFromHouse')
              .setValidators(Validators.required);
          }
          if (deliveryType === DeliveryType.pickup + '') {
            this.form
              .get('deliveryCustomerCarNumber')
              .setValidators([Validators.required, Validators.minLength(5)]);
          }
        }

        if (orderType === OrderType.service + '') {
          this.form
            .get('deliveryAddressFromStreet')
            .setValidators(Validators.required);
          this.form
            .get('deliveryAddressFromHouse')
            .setValidators(Validators.required);
        }

        this.approximateCostChange();
      });

      /* --- Смена валидаторов на "Тип оплаты" --- */
      /* Если тип оплыта картой или безналом, то появляется поле с информацие
      о счёте/карте заказчика */
      this.form.get('paymentMethod').valueChanges.subscribe((value) => {
        this.form.get('paymentMethodData').clearValidators();
        this.form.get('paymentMethodData').setErrors(null);
        if (this.form.get('type').value === OrderType.offer + '') {
          if (
            this.approximateRemunerationCost &&
            (value === PaymentMethod.nonCash + '' ||
              value === PaymentMethod.card + '')
          ) {
            this.form
              .get('paymentMethodData')
              .setValidators(Validators.required);
          }
        }
      });

      /* --- Смена валидаторов на "Способ оплаты" --- */
      /* Если стоимость вознаграждения/оплаты не равна 0,
      то неободимо сделать обязательное указание способа оплаты */
      this.form.get('offersItems').valueChanges.subscribe((_) => {
        this.approximateCostChange();
      });
      this.form.get('offersAmountUnit').valueChanges.subscribe((_) => {
        this.approximateCostChange();
      });
      this.form.get('offersAmount').valueChanges.subscribe((_) => {
        this.approximateCostChange();
      });

      this.form.get('servicesAmountUnit').valueChanges.subscribe((_) => {
        this.approximateCostChange();
      });
      this.form.get('servicesAmount').valueChanges.subscribe((_) => {
        this.approximateCostChange();
      });
    };

    /* -------------------------- */
    /* --- Main item settings --- */
    /* -------------------------- */

    this.isFetching$ = this.store
      .select(ScheduledOrdersSelectors.selectAddScheduledOrderIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(ScheduledOrdersSelectors.selectAddScheduledOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addResultSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(
            ScheduledOrdersActions.refreshAddScheduledOrderSucceed()
          );

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(ScheduledOrdersSelectors.selectAddScheduledOrderError)
      .subscribe((error) => {
        if (error) {
          if (error.description.includes('client')) {
            this.form.get('client').setErrors({ notExists: true });
          } else {
            this.addResultSnackbar = this.snackBar.open(
              'Ошибка при добавлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(
          ScheduledOrdersActions.refreshAddScheduledOrderFailure()
        );
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      const startDate = new Date(this.form.get('startDate').value);
      startDate.setHours(0, 0);

      const scheduledOrder: IAddScheduledOrderRequest = {
        periodType: +this.form.get('periodType').value,
        periodAmount: +this.form.get('periodAmount').value,

        type: +this.form.get('type').value,
        startDate,

        locality: this.form.get('locality').value,

        client: this.form.get('client').value || undefined,

        offersItems:
          this.form.get('type').value === OrderType.offer + ''
            ? this.form.get('offersItems').value
            : undefined,
        offersAmountUnit:
          this.form.get('type').value === OrderType.offer + ''
            ? +this.form.get('offersAmountUnit').value
            : undefined,
        offersAmount:
          this.form.get('type').value === OrderType.offer + ''
            ? +this.form.get('offersAmount').value
            : undefined,

        servicesItems:
          this.form.get('type').value === OrderType.service + ''
            ? [this.servicesOptions[0].value]
            : undefined,
        servicesAmountUnit:
          this.form.get('type').value === OrderType.service + ''
            ? +this.form.get('servicesAmountUnit').value
            : undefined,
        servicesAmount:
          this.form.get('type').value === OrderType.service + ''
            ? +this.form.get('servicesAmount').value
            : undefined,

        customerContactName: this.form.get('customerContactName').value,
        customerContactPhone:
          '+7' + this.form.get('customerContactPhone').value,
        customerOrganizationLegalName: this.form.get(
          'customerOrganizationLegalName'
        ).value,
        customerOrganizationActualName: this.form.get(
          'customerOrganizationActualName'
        ).value,

        deliveryType:
          this.form.get('type').value === OrderType.offer + ''
            ? +this.form.get('deliveryType').value
            : DeliveryType.without,
        deliveryCustomerCarNumber:
          this.form.get('deliveryType').value === DeliveryType.pickup + ''
            ? this.form.get('deliveryCustomerCarNumber').value
            : undefined,
        deliveryHasAssistant:
          this.form.get('deliveryType').value === DeliveryType.company + '' ||
          this.form.get('type').value === OrderType.service + ''
            ? this.form.get('deliveryHasAssistant').value === true
            : undefined,
        deliveryAddressFromStreet:
          this.form.get('deliveryType').value === DeliveryType.company + '' ||
          this.form.get('type').value === OrderType.service + ''
            ? this.form.get('deliveryAddressFromStreet').value
            : undefined,
        deliveryAddressFromHouse:
          this.form.get('deliveryType').value === DeliveryType.company + '' ||
          this.form.get('type').value === OrderType.service + ''
            ? this.form.get('deliveryAddressFromHouse').value
            : undefined,

        paymentMethod:
          (this.form.get('type').value === OrderType.offer + '' &&
            this.approximateRemunerationCost) ||
          this.form.get('type').value === OrderType.service + ''
            ? +this.form.get('paymentMethod').value
            : undefined,
        paymentMethodData:
          this.form.get('type').value === OrderType.offer + '' &&
          this.approximateRemunerationCost
            ? this.form.get('paymentMethodData').value
            : undefined,

        customerComment: this.form.get('customerComment').value,
        companyComment: this.form.get('companyComment').value,
      };

      this.store.dispatch(
        ScheduledOrdersActions.addScheduledOrderRequest({ scheduledOrder })
      );
    };

    /* ------ */
    /* Offers */
    /* ------ */
    this.store.dispatch(OffersActions.getOffersRequest());
    this.socket.get()?.on('offers', (_) => {
      this.store.dispatch(OffersActions.getOffersRequest());
    });
    this.offers$ = this.store
      .select(OffersSelectors.selectOffers)
      .subscribe((value) => {
        const filtered = value;
        filtered?.filter((el) => {
          return el.status === SimpleStatus.active;
        });
        this.offers = filtered;
      });

    /* -------- */
    /* Services */
    /* -------- */
    this.store.dispatch(ServicesActions.getServicesRequest());
    this.socket.get()?.on('services', (_) => {
      this.store.dispatch(ServicesActions.getServicesRequest());
    });
    this.services$ = this.store
      .select(ServicesSelectors.selectServices)
      .subscribe((value) => {
        const filtered = value;
        filtered?.filter((el) => {
          return el.status === SimpleStatus.active;
        });
        this.services = filtered;
      });

    this.userInitCallback = () => {
      if (
        this.userEmployee &&
        this.userEmployee.role === EmployeeRole.receivingManager
      ) {
        this.form
          ?.get('locality')
          .setValue((this.userEmployee.locality as ILocality)?._id);
      }
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initOffersOptions();
    this.options.initServicesOptions();

    this.offers$?.unsubscribe?.();
    this.services$?.unsubscribe?.();

    this.socket.get()?.off('offers');
    this.socket.get()?.off('services');
  }

  public approximateCostChange(): void {
    const orderType =
      this.form.get('type') && this.form.get('type').value !== ''
        ? +this.form.get('type').value
        : undefined;
    const offers = this.offers;
    const services = this.services;
    const offersItems =
      this.form.get('offersItems') &&
      this.form.get('offersItems').value.length > 0
        ? this.form.get('offersItems').value
        : undefined;
    const offersAmount =
      this.form.get('offersAmount') &&
      this.form.get('offersAmount').value !== ''
        ? +this.form.get('offersAmount').value
        : undefined;
    const offersUnit =
      this.form.get('offersAmountUnit') &&
      this.form.get('offersAmountUnit').value !== ''
        ? +this.form.get('offersAmountUnit').value
        : undefined;
    const servicesItems =
      this.form.get('servicesItems') &&
      this.form.get('servicesItems').value.length > 0
        ? this.form.get('servicesItems').value
        : undefined;
    const servicesAmount =
      this.form.get('servicesAmount') &&
      this.form.get('servicesAmount').value !== ''
        ? +this.form.get('servicesAmount').value
        : undefined;
    const servicesUnit =
      this.form.get('servicesAmountUnit') &&
      this.form.get('servicesAmountUnit').value !== ''
        ? +this.form.get('servicesAmountUnit').value
        : undefined;
    const hasDelivery =
      this.form.get('deliveryType') &&
      this.form.get('deliveryType').value === DeliveryType.company + ''
        ? true
        : this.form.get('deliveryType').value === DeliveryType.pickup + ''
        ? false
        : undefined;

    const cost = this.helpers.getOrderApproximateCost({
      orderType,
      offers,
      services,
      offersItems,
      offersAmount,
      offersUnit,
      servicesItems,
      servicesAmount,
      servicesUnit,
      hasDelivery,
    });

    this.approximateRemunerationCost = cost.approximateRemunerationCost.string;
    this.approximatePaymentCost = cost.approximatePaymentCost.string;

    this.helpers.updateValidatorsOnCostChange({
      orderType,
      approximateRemunerationCostTo: cost.approximateRemunerationCost.to,
      approximateRemunerationCostFrom: cost.approximateRemunerationCost.from,
      approximatePaymentCostFinal: cost.approximatePaymentCost.final,
      fields: { paymentMethod: this.form.get('paymentMethod') },
    });
  }
}
