import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import * as OrdersActions from '../../../../store/orders/orders.actions';
import * as OffersSelectors from '../../../../store/offers/offers.selectors';
import * as OffersActions from '../../../../store/offers/offers.actions';
import * as ServicesSelectors from '../../../../store/services/services.selectors';
import * as ServicesActions from '../../../../store/services/services.actions';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { OrderType } from '../../../../models/enums/OrderType';
import { DeliveryType } from '../../../../models/enums/DeliveryType';
import { PaymentMethod } from '../../../../models/enums/PaymentMethod';
import { deliveryTypeOptions } from '../../../../data/deliveryTypeData';
import { orderTypeOptions } from 'src/app/data/orderTypeData';
import { tomorrow } from '../../../../utils/date.functions';
import { timeOptions } from '../../../../data/timeOptions';
import { OptionType } from '../../../../models/types/OptionType';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import {
  paymentMethodOffersOptions,
  paymentMethodServicesOptions,
} from '../../../../data/paymentMethodData';
import {
  unitOffersOptions,
  unitServicesOptions,
} from '../../../../data/unitOptions';
import { IOffer } from '../../../../models/Offer';
import { IService } from '../../../../models/Service';
import { responseCodes } from '../../../../data/responseCodes';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { ILocality } from '../../../../models/Locality';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { OrdersApiService } from '../../../../services/api/orders-api.service';
import { ClientsApiService } from '../../../../services/api/clients-api.service';

@Component({
  selector: 'app-order-item-add',
  templateUrl: './order-item-add.component.html',
  styleUrls: ['./order-item-add.component.scss'],
})
export class OrderItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
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

  /* -------------------- */
  /* Other items settings */
  /* -------------------- */
  public offers$: Subscription;
  public offers: IOffer[];
  public services$: Subscription;
  public services: IService[];

  /* ------------------ */
  /* Interface settings */
  /* ------------------ */
  public approximatePaymentCost: string;
  public approximateRemunerationCost: string;

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public deadlineMinDate = tomorrow;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderType = OrderType;
  public deliveryType = DeliveryType;
  public paymentMethod = PaymentMethod;
  public employeeRole = EmployeeRole;
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
    private ordersApi: OrdersApiService,
    private clientsApi: ClientsApiService
  ) {
    super(store, router, route);

    title.setTitle('Добавить заявку - Чистая планета');
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
        type: new FormControl('', Validators.required),
        deadlineDate: new FormControl('', Validators.required),
        deadlineTime: new FormControl('', Validators.required),

        locality: new FormControl('', Validators.required),
        division: new FormControl(''),

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

      if (
        this.userEmployee &&
        (this.userEmployee.role === EmployeeRole.receivingManager ||
          this.userEmployee.role === EmployeeRole.clientManager)
      ) {
        this.form
          ?.get('locality')
          .setValue((this.userEmployee.locality as ILocality)?._id);
      }

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
        this.form.get('division').setValue('');

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
      .select(OrdersSelectors.selectAddOrderIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(OrdersSelectors.selectAddOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addResultSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(OrdersActions.refreshAddOrderSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(OrdersSelectors.selectAddOrderError)
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

        this.store.dispatch(OrdersActions.refreshAddOrderFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      const deadlineDate = new Date(this.form.get('deadlineDate').value);
      const deadlineTime = this.form.get('deadlineTime').value;
      const deadlineHours = deadlineTime.split(':')[0];
      const deadlineMinutes = deadlineTime.split(':')[1];

      const deadline = deadlineDate;
      deadline.setHours(deadlineHours, deadlineMinutes);

      const order = {
        type: +this.form.get('type').value,
        deadline,

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
      };

      this.store.dispatch(OrdersActions.addOrderRequest({ order }));
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
        (this.userEmployee.role === EmployeeRole.receivingManager ||
          this.userEmployee.role === EmployeeRole.clientManager)
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

    /* ------------------------------------- */
    /* --- Getting query params for form --- */
    /* ------------------------------------- */
    this.route.queryParams.subscribe((params) => {
      const type = params.type;
      const locality = params.locality;
      const client = params.client;
      const offersItems = params.offersItems
        ? JSON.parse(params.offersItems)
        : undefined;
      const offersAmountUnit = params.offersAmountUnit;
      const offersAmount = params.offersAmount;
      const servicesAmountUnit = params.servicesAmountUnit;
      const servicesAmount = params.servicesAmount;
      const customerContactName = params.customerContactName;
      const customerContactPhone = params.customerContactPhone;
      const customerOrganizationLegalName =
        params.customerOrganizationLegalName;
      const customerOrganizationActualName =
        params.customerOrganizationActualName;
      const deliveryType = params.deliveryType;
      const deliveryCustomerCarNumber = params.deliveryCustomerCarNumber;
      const deliveryHasAssistant = params.deliveryHasAssistant;
      const deliveryAddressFromStreet = params.deliveryAddressFromStreet;
      const deliveryAddressFromHouse = params.deliveryAddressFromHouse;
      const paymentMethod = params.paymentMethod;
      const paymentMethodData = params.paymentMethodData;

      if (this.form) {
        if (type !== undefined) {
          this.form.get('type').setValue(type);
        }
        if (locality !== undefined) {
          this.form.get('locality').setValue(locality);
        }

        if (+type === OrderType.offer) {
          if (offersItems !== undefined) {
            this.form.get('offersItems').setValue(offersItems);
          }
          if (offersAmountUnit !== undefined) {
            this.form.get('offersAmountUnit').setValue(offersAmountUnit);
          }
          if (offersAmount !== undefined) {
            this.form.get('offersAmount').setValue(offersAmount);
          }
        }

        if (+type === OrderType.service) {
          if (servicesAmountUnit !== undefined) {
            this.form.get('servicesAmountUnit').setValue(servicesAmountUnit);
          }
          if (servicesAmount !== undefined) {
            this.form.get('servicesAmount').setValue(servicesAmount);
          }
        }

        if (deliveryType !== undefined) {
          this.form.get('deliveryType').setValue(deliveryType);
        }

        if (
          +type === OrderType.service ||
          (+type === OrderType.offer && +deliveryType === DeliveryType.company)
        ) {
          if (deliveryAddressFromStreet !== undefined) {
            this.form
              .get('deliveryAddressFromStreet')
              .setValue(deliveryAddressFromStreet);
          }
          if (deliveryAddressFromHouse !== undefined) {
            this.form
              .get('deliveryAddressFromHouse')
              .setValue(deliveryAddressFromHouse);
          }
          if (deliveryHasAssistant !== undefined) {
            this.form
              .get('deliveryHasAssistant')
              .setValue(deliveryHasAssistant === 'true');
          }
        }

        if (
          +type === OrderType.offer &&
          +deliveryType === DeliveryType.pickup
        ) {
          if (deliveryCustomerCarNumber !== undefined) {
            this.form
              .get('deliveryCustomerCarNumber')
              .setValue(deliveryCustomerCarNumber);
          }
        }
        if (client !== undefined) {
          this.form.get('client').setValue(client);
        }

        if (customerContactName !== undefined) {
          this.form.get('customerContactName').setValue(customerContactName);
        }
        if (customerContactPhone !== undefined) {
          this.form
            .get('customerContactPhone')
            .setValue(customerContactPhone?.substr(2) || '');
        }
        if (customerOrganizationLegalName !== undefined) {
          this.form
            .get('customerOrganizationLegalName')
            .setValue(customerOrganizationLegalName);
        }
        if (customerOrganizationActualName !== undefined) {
          this.form
            .get('customerOrganizationActualName')
            .setValue(customerOrganizationActualName);
        }

        if (paymentMethod !== undefined) {
          this.form.get('paymentMethod').setValue(paymentMethod);
        }
        if (paymentMethodData !== undefined) {
          this.form.get('paymentMethodData').setValue(paymentMethodData);
        }
      }
    });
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
    const orderType = this.form.get('type').value;
    const offersItems = this.form.get('offersItems').value;
    const offersUnit = +this.form.get('offersAmountUnit').value;
    const offersAmount = +this.form.get('offersAmount').value;
    const hasDelivery =
      this.form.get('deliveryType').value === DeliveryType.company + ''
        ? true
        : this.form.get('deliveryType').value === DeliveryType.pickup + ''
        ? false
        : undefined;

    let priceFrom = 0;
    let priceTo = 0;

    if (orderType === OrderType.offer + '') {
      this.approximatePaymentCost = undefined;
      offersItems.forEach((offer, i) => {
        const offerPrices = this.offers?.find((el) => el._id === offer).prices;

        offerPrices?.forEach((price) => {
          if (price.unit === offersUnit) {
            if (hasDelivery === true) {
              if (price.amountWithDelivery > priceTo) {
                priceTo = price.amountWithDelivery;
              }
              if (
                price.amountWithDelivery <= priceFrom ||
                offersItems.length === 1
              ) {
                priceFrom = price.amountWithDelivery;
              }
              if (i === 0) {
                priceTo = price.amountWithDelivery;
                priceFrom = price.amountWithDelivery;
              }
            } else if (hasDelivery === false) {
              if (price.amountWithoutDelivery > priceTo) {
                priceTo = price.amountWithoutDelivery;
              }
              if (
                price.amountWithoutDelivery <= priceFrom ||
                offersItems.length === 1
              ) {
                priceFrom = price.amountWithoutDelivery;
              }
              if (i === 0) {
                priceTo = price.amountWithoutDelivery;
                priceFrom = price.amountWithoutDelivery;
              }
            }
          }
        });
      });

      if (priceFrom === 0 && priceTo === 0) {
        this.approximateRemunerationCost = undefined;
        this.form.get('paymentMethod').clearValidators();
        this.form.get('paymentMethod').setErrors(null);
      } else if (priceFrom === priceTo) {
        this.approximateRemunerationCost = `${priceFrom * offersAmount} руб.`;
        this.form.get('paymentMethod').setValidators(Validators.required);
        this.form.get('paymentMethod').updateValueAndValidity();
      } else if (priceFrom === 0) {
        this.approximateRemunerationCost = `до ${priceTo * offersAmount} руб.`;
        this.form.get('paymentMethod').setValidators(Validators.required);
        this.form.get('paymentMethod').updateValueAndValidity();
      } else {
        this.form.get('paymentMethod').setValidators(Validators.required);
        this.form.get('paymentMethod').updateValueAndValidity();
        this.approximateRemunerationCost = `от ${
          priceFrom * offersAmount
        } руб. до ${priceTo * offersAmount} руб.`;
      }
    } else if (orderType === OrderType.service + '') {
      this.approximateRemunerationCost = undefined;
      this.form.get('paymentMethod').setValidators(Validators.required);
      this.form.get('paymentMethod').updateValueAndValidity();

      const service = this.services?.[0];
      const serviceUnit = +this.form.get('servicesAmountUnit').value;
      const serviceAmount = +this.form.get('servicesAmount').value;
      const servicePrices = service?.prices;

      let finalPrice = 0;

      servicePrices?.forEach((price) => {
        if (price.unit === serviceUnit) {
          finalPrice = price.amount;
        }
      });

      if (finalPrice === 0) {
        this.approximatePaymentCost = undefined;
      } else {
        this.approximatePaymentCost = `${finalPrice * serviceAmount} руб.`;
      }
    } else {
      this.form.get('paymentMethod').clearValidators();
      this.form.get('paymentMethod').setErrors(null);
      this.approximatePaymentCost = undefined;
      this.approximateRemunerationCost = undefined;
    }
  }
}
