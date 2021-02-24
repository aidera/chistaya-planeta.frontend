import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../store/root.reducer';
import * as AppActions from '../../store/app/app.actions';
import * as AppSelectors from '../../store/app/app.selectors';
import * as OrdersActions from '../../store/orders/orders.actions';
import * as OrdersSelectors from '../../store/orders/orders.selectors';
import { orderTypeOptions } from '../../data/orderTypeData';
import { deliveryTypeOptions } from '../../data/deliveryTypeData';
import timeOptions from '../../data/timeOptions';
import { tomorrow } from '../../utils/date.functions';
import DeliveryType from '../../models/enums/DeliveryType';
import PaymentMethod from '../../models/enums/PaymentMethod';
import OrderType from '../../models/enums/OrderType';
import { OptionType } from '../../models/types/OptionType';
import { ServerError } from '../../models/ServerResponse';
import { IDivisionLessInfo } from '../../models/Division';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import {
  paymentMethodOffersOptions,
  paymentMethodServicesOptions,
} from 'src/app/data/paymentMethodData';
import { unitOffersOptions } from '../../data/unitOptions';
import Unit from '../../models/enums/Unit';

@Component({
  selector: 'app-add-order-no-auth',
  templateUrl: './add-order-no-auth.component.html',
  styleUrls: ['./add-order-no-auth.component.scss'],
})
export class AddOrderNoAuthComponent implements OnInit, OnDestroy {
  private localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];

  private isAddOrderSucceed$: Subscription;
  private isFetching$: Subscription;
  public isFetching: boolean;
  private serverError$: Subscription;
  public serverError: ServerError;

  public orderTypeEnum = OrderType;
  public deliveryTypeEnum = DeliveryType;
  public paymentMethodEnum = PaymentMethod;

  public selectOrderTypeOptions = orderTypeOptions;
  public selectRawTypeOptions = [];
  public selectRawUnitOptions = unitOffersOptions;
  public selectDeliveryTypeOptions = deliveryTypeOptions;
  public selectPaymentMethodOffersOptions = paymentMethodOffersOptions;
  public selectPaymentMethodServicesOptions = paymentMethodServicesOptions;
  public selectLocalitiesOptions: OptionType[] = [];
  public selectDivisionsOptions: OptionType[] = [];
  public selectTimeOptions = timeOptions;

  public form: FormGroup;

  public desiredPickupDateMinDate = tomorrow;

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>,
    protected socket: SocketIoService
  ) {}

  ngOnInit(): void {
    this.formInit();

    this.localitiesOptions$ = this.store
      .select(AppSelectors.selectLocalitiesToSelect)
      .subscribe((localities) => {
        this.localitiesOptions =
          localities?.map((el) => {
            return {
              value: el._id,
              text: el.name,
            };
          }) || [];
        if (localities === null) {
          this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
        }
      });
    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });

    this.divisions$ = this.store
      .select(AppSelectors.selectDivisionsToSelect)
      .subscribe((divisions) => {
        this.divisions = divisions;
        if (divisions === null) {
          this.store.dispatch(AppActions.getDivisionsToSelectRequest());
        }
      });
    this.socket.get()?.on('divisions', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });

    this.isAddOrderSucceed$ = this.store
      .select(OrdersSelectors.selectAddOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.router.navigate(['/order-succeed']);
        }
      });

    this.isFetching$ = this.store
      .select(OrdersSelectors.selectAddOrderIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.serverError$ = this.store
      .select(OrdersSelectors.selectAddOrderError)
      .subscribe((error) => {
        this.serverError = error;
        this.store.dispatch(OrdersActions.refreshAddOrderFailure());
      });
  }

  ngOnDestroy(): void {
    this.localitiesOptions$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
    this.isFetching$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
    this.isAddOrderSucceed$?.unsubscribe?.();
  }

  private formInit(): void {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      rawType: new FormControl('', Validators.required),
      rawAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      rawAmountUnit: new FormControl(Unit.kg + '', Validators.required),
      deliveryType: new FormControl('', Validators.required),
      deliveryAddressLocality: new FormControl('', Validators.required),
      deliveryAddressStreet: new FormControl('', Validators.required),
      deliveryAddressHouse: new FormControl('', Validators.required),
      deliveryCustomerCarNumber: new FormControl(''),
      desiredPickupDate: new FormControl(tomorrow, Validators.required),
      desiredPickupTime: new FormControl('', Validators.required),
      hasAssistant: new FormControl(false),
      customerOrganizationLegalName: new FormControl(),
      customerOrganizationActualName: new FormControl(),
      customerContactName: new FormControl('', Validators.required),
      customerContactPhone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      paymentMethod: new FormControl('', Validators.required),
      paymentMethodData: new FormControl(),
      comment: new FormControl(),
      division: new FormControl(),
    });

    /* --- Смена валидаторов на "Тип заказа" ("Я хочу...") --- */
    /* Если тип заказа выбран "Продать вторсырье", то дополнительно активизируются поля:
    тип сырья, единица измерения сырья, тип доставки, группа полей вознаграждения */
    /* Если тип заказа выбран "Вывести мусор", то поля вторсырья убираются */
    this.form.get('type').valueChanges.subscribe((value) => {
      if (value === OrderType.offer + '') {
        this.form.get('rawType').setValidators(Validators.required);
        this.form.get('rawAmountUnit').setValidators(Validators.required);
        this.form.get('deliveryType').setValidators(Validators.required);
        this.deliveryTypeValidatorsChange(this.form.get('deliveryType').value);
        this.paymentMethodValidatorsChange(
          this.form.get('paymentMethod').value
        );
      } else {
        this.form.get('rawType').clearValidators();
        this.form.get('rawAmountUnit').clearValidators();
        this.form.get('deliveryType').clearValidators();
        this.form.get('deliveryCustomerCarNumber').clearValidators();
        this.form.get('paymentMethodData').clearValidators();
      }
      this.divisionsChange(this.form.get('deliveryAddressLocality').value);
    });

    /* --- Смена валидаторов на "Тип доставки" --- */
    /* Если тип доставки выбран "Компанией", то должны показатся поля с городом,
    адресом, улицей и домом, а также помошником */
    /* Если тип доставки выбран "Самовывоз", то поля с городом, адремос, улицей,
    домом и помошником убираются, но появляется номер автомобиля заказчика */
    this.form.get('deliveryType').valueChanges.subscribe((value) => {
      this.deliveryTypeValidatorsChange(value);
      this.divisionsChange(this.form.get('deliveryAddressLocality').value);
    });

    /* --- Смена валидаторов на "Тип оплаты" --- */
    /* Если тип оплыта картой или безналом, то появляется поле с информацие
    о счёте/карте заказчика */
    this.form.get('paymentMethod').valueChanges.subscribe((value) => {
      this.paymentMethodValidatorsChange(value);
    });

    /* --- Смена поля-селекта "Пункт приёма" или "Подразделение" --- */
    /* Если тип заказа - "Продать вторсыре", выбрал "Самовывоз", выбрал "Населенный пункт"
     * то появляется "Пункт приёма"/"Подразделение", значения которого зависят от выбранного населённого пункта */
    this.form.get('deliveryAddressLocality').valueChanges.subscribe((value) => {
      this.divisionsChange(value);
    });
  }

  private deliveryTypeValidatorsChange(value): void {
    if (
      value === DeliveryType.company + '' &&
      this.form.get('type').value === OrderType.offer + ''
    ) {
      this.form.get('deliveryAddressStreet').setValidators(Validators.required);
      this.form.get('deliveryAddressHouse').setValidators(Validators.required);
      this.form.get('deliveryCustomerCarNumber').clearValidators();
    } else {
      this.form.get('deliveryAddressStreet').clearValidators();
      this.form.get('deliveryAddressHouse').clearValidators();
      this.form
        .get('deliveryCustomerCarNumber')
        .setValidators([Validators.required, Validators.minLength(5)]);
    }
    if (this.form.get('type').value === OrderType.service + '') {
      this.form.get('deliveryCustomerCarNumber').clearValidators();
    }
  }

  public divisionsChange(value): void {
    this.selectDivisionsOptions = [];
    if (
      this.form.get('type').value === OrderType.offer + '' &&
      this.form.get('deliveryType').value === DeliveryType.pickup + ''
    ) {
      if (value) {
        const currentLocality = this.localitiesOptions.find((locality) => {
          return locality.value === value;
        });
        if (currentLocality) {
          this.divisions?.forEach((division: IDivisionLessInfo) => {
            if (division.locality === currentLocality.value) {
              this.selectDivisionsOptions.push({
                value: division._id,
                text: `${division.name} (${division.street}, ${division.house})`,
              });
            }
          });
        }
      }
      this.form.get('division').setValidators(Validators.required);
      if (this.selectDivisionsOptions.length === 1) {
        this.form
          .get('division')
          .setValue(this.selectDivisionsOptions[0].value);
      }
    } else {
      this.form.get('division').clearValidators();
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

  public submit(): void {
    Object.keys(this.form?.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form.valid) {
      const order = {
        approximateRawAmount: this.form.get('rawAmount').value,
        approximateRawAmountUnit: this.form.get('rawAmountUnit').value,
        approximateRawType: this.form.get('rawType').value,
        comment: this.form.get('comment').value,
        customerContactName: this.form.get('customerContactName').value,
        customerContactPhone:
          '+7' + this.form.get('customerContactPhone').value,
        customerOrganizationActualName: this.form.get(
          'customerOrganizationActualName'
        ).value,
        customerOrganizationLegalName: this.form.get(
          'customerOrganizationLegalName'
        ).value,
        deliveryAddressHouse: this.form.get('deliveryAddressHouse').value,
        deliveryAddressLocality: this.form.get('deliveryAddressLocality').value,
        deliveryAddressStreet: this.form.get('deliveryAddressStreet').value,
        deliveryCustomerCarNumber: this.form.get('deliveryCustomerCarNumber')
          .value,
        deliveryHasAssistant: this.form.get('hasAssistant').value,
        deliveryType: this.form.get('deliveryType').value,
        desiredPickupDate: this.form.get('desiredPickupDate').value,
        division: this.form.get('division').value,
        paymentMethod: this.form.get('paymentMethod').value,
        paymentMethodData: this.form.get('paymentMethodData').value,
        type: this.form.get('type').value,
      };

      // this.store.dispatch(OrdersActions.addOrderRequest({ order }));
    } else {
      let hasOneElementToScroll = false;

      Object.keys(this.form?.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control.errors && !hasOneElementToScroll) {
          hasOneElementToScroll = true;

          const fieldId = document.getElementById(field);
          if (fieldId) {
            const fieldOffset = fieldId.getBoundingClientRect().top;

            window.scrollTo({
              top: fieldOffset + window.pageYOffset - window.innerHeight / 2,
              behavior: 'smooth',
            });
          }
        }
      });
    }
  }
}
