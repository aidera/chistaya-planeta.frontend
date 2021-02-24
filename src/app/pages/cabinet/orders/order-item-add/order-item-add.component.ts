import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import * as OrdersActions from '../../../../store/orders/orders.actions';
import { ItemAddPageComponent } from '../../item-add-page.component';
import OrderType from '../../../../models/enums/OrderType';
import DeliveryType from '../../../../models/enums/DeliveryType';
import PaymentMethod from '../../../../models/enums/PaymentMethod';
import { deliveryTypeOptions } from '../../../../data/deliveryTypeData';
import { orderStatusOptions } from 'src/app/data/orderStatusData';
import { orderTypeOptions } from 'src/app/data/orderTypeData';
import { tomorrow } from '../../../../utils/date.functions';
import timeOptions from '../../../../data/timeOptions';
import { OptionType } from '../../../../models/types/OptionType';
import SimpleStatus from '../../../../models/enums/SimpleStatus';
import Unit from '../../../../models/enums/Unit';
import {
  paymentMethodOffersOptions,
  paymentMethodServicesOptions,
} from '../../../../data/paymentMethodData';

@Component({
  selector: 'app-order-item-add',
  templateUrl: './order-item-add.component.html',
  styleUrls: ['./order-item-add.component.scss'],
})
export class OrderItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public offersOptions$: Subscription;
  public offersOptions: OptionType[] = [];
  public servicesOptions$: Subscription;
  public servicesOptions: OptionType[] = [];

  public orderStatusOptions = orderStatusOptions;
  public orderTypeOptions = orderTypeOptions;
  public deliveryTypeOptions = deliveryTypeOptions;
  public paymentMethodOffersOptions = paymentMethodOffersOptions;
  public paymentMethodServicesOptions = paymentMethodServicesOptions;
  public selectTimeOptions = timeOptions;
  public offersUnitOptions: OptionType[] = [
    { value: Unit.kg + '', text: 'кг' },
    { value: Unit.cube + '', text: 'куб' },
  ];
  public servicesUnitOptions: OptionType[] = [
    { value: Unit.kg + '', text: 'кг' },
    { value: Unit.cube + '', text: 'куб' },
    { value: Unit.bag120 + '', text: 'мешок 120л' },
    { value: Unit.bag160 + '', text: 'мешок 160л' },
  ];

  public orderType = OrderType;
  public deliveryType = DeliveryType;
  public paymentMethod = PaymentMethod;

  public deadlineMinDate = tomorrow;

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

        offersItems: new FormControl([]),
        offersAmountUnit: new FormControl(''),
        offersAmount: new FormControl(''),

        servicesAmountUnit: new FormControl(''),
        servicesAmount: new FormControl(''),

        customerContactName: new FormControl('', Validators.required),
        customerContactPhone: new FormControl('', Validators.required),
        customerOrganizationLegalName: new FormControl(''),
        customerOrganizationActualName: new FormControl(''),

        deliveryType: new FormControl(''),
        deliveryCustomerCarNumber: new FormControl(''),
        deliveryHasAssistant: new FormControl(''),
        deliveryAddressFromStreet: new FormControl(''),
        deliveryAddressFromHouse: new FormControl(''),

        paymentMethod: new FormControl('', Validators.required),
        paymentMethodData: new FormControl(''),

        customerComment: new FormControl(''),
        companyComment: new FormControl(''),
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
        if (value === OrderType.offer + '') {
          this.form.get('offersItems').setValidators(Validators.required);
          this.form.get('offersAmountUnit').setValidators(Validators.required);
          this.form.get('offersAmount').setValidators(Validators.required);

          this.form.get('servicesAmountUnit').clearValidators();
          this.form.get('servicesAmount').clearValidators();

          this.form.get('deliveryType').setValidators(Validators.required);
          this.deliveryTypeValidatorsChange(
            this.form.get('deliveryType').value
          );
          this.paymentMethodValidatorsChange(
            this.form.get('paymentMethod').value
          );
        }

        if (value === OrderType.service + '') {
          this.form.get('offersItems').clearValidators();
          this.form.get('offersAmountUnit').clearValidators();
          this.form.get('offersAmount').clearValidators();

          this.form
            .get('servicesAmountUnit')
            .setValidators(Validators.required);
          this.form.get('servicesAmount').setValidators(Validators.required);

          this.form.get('deliveryType').clearValidators();
          this.form.get('deliveryCustomerCarNumber').clearValidators();
          this.form.get('paymentMethodData').clearValidators();
        }

        this.form.get('paymentMethod').setValue('');
      });

      /* --- Смена валидаторов на "Тип доставки" --- */
      /* Если тип доставки выбран "Компанией", то должны показатся поля с городом,
      адресом, улицей и домом, а также помошником */
      /* Если тип доставки выбран "Самовывоз", то поля с городом, адресом, улицей,
      домом и помошником убираются, но появляется номер автомобиля заказчика */
      this.form.get('deliveryType').valueChanges.subscribe((value) => {
        this.deliveryTypeValidatorsChange(value);
      });

      /* --- Смена валидаторов на "Тип оплаты" --- */
      /* Если тип оплыта картой или безналом, то появляется поле с информацие
      о счёте/карте заказчика */
      this.form.get('paymentMethod').valueChanges.subscribe((value) => {
        this.paymentMethodValidatorsChange(value);
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
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
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
          if (error.foundedItem) {
            this.form.get('name').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else {
            this.addSnackbar = this.snackBar.open(
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

        paymentMethod: +this.form.get('paymentMethod').value,
        paymentMethodData:
          this.form.get('type').value === OrderType.offer + ''
            ? this.form.get('paymentMethodData').value
            : undefined,

        customerComment: this.form.get('customerComment').value,
      };

      this.store.dispatch(OrdersActions.addOrderRequest({ order }));
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('localities');
  }

  private deliveryTypeValidatorsChange(value): void {
    if (
      value === DeliveryType.company + '' &&
      this.form.get('type').value === OrderType.offer + ''
    ) {
      this.form
        .get('deliveryAddressFromStreet')
        .setValidators(Validators.required);
      this.form
        .get('deliveryAddressFromHouse')
        .setValidators(Validators.required);
      this.form.get('deliveryCustomerCarNumber').clearValidators();
    } else {
      this.form.get('deliveryAddressFromStreet').clearValidators();
      this.form.get('deliveryAddressFromHouse').clearValidators();
      this.form
        .get('deliveryCustomerCarNumber')
        .setValidators([Validators.required, Validators.minLength(5)]);
    }
    if (this.form.get('type').value === OrderType.service + '') {
      this.form.get('deliveryCustomerCarNumber').clearValidators();
    }
  }

  public paymentMethodValidatorsChange(value): void {
    if (
      value === PaymentMethod.card + '' ||
      (value === PaymentMethod.nonCash + '' &&
        this.form.get('type').value === OrderType.offer + '')
    ) {
      this.form.get('paymentMethodData').setValidators(Validators.required);
    } else {
      this.form.get('paymentMethodData').clearValidators();
    }
  }
}
