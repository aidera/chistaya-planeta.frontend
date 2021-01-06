import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../../store/root.reducer';
import * as OrderActions from '../../store/order/order.actions';
import * as OrderSelectors from '../../store/order/order.selectors';
import orderTypeOptions from '../../data/orderTypeOptions';
import rawRecyclableTypeOptions from '../../data/rawRecyclableTypeOptions';
import rawUnitOptions from '../../data/rawUnitOptions';
import deliveryTypeOptions from '../../data/deliveryTypeOptions';
import paymentMethodRecyclableOptions from '../../data/paymentMethodRecyclableOptions';
import paymentMethodGarbageOptions from '../../data/paymentMethodGarbageOptions';
import timeOptions from '../../data/timeOptions';
import { tomorrow } from '../../utils/date.functions';
import DeliveryType from '../../models/enums/DeliveryType';
import PaymentMethod from '../../models/enums/PaymentMethod';
import OrderType from '../../models/enums/OrderType';
import { ILocality } from '../../models/Locality';
import { OptionType } from '../../models/types/OptionType';
import { IDivision } from 'src/app/models/Division';
import { ServerError } from '../../models/ServerResponse';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  private localities$: Subscription;
  private localities: ILocality[];

  public isAddOrderSucceed$: Subscription;
  public isFetching$: Observable<boolean>;
  public serverError$: Subscription;
  public serverError: ServerError;

  public orderTypeEnum = OrderType;
  public deliveryTypeEnum = DeliveryType;
  public paymentMethodEnum = PaymentMethod;

  public selectOrderTypeOptions = orderTypeOptions;
  public selectRawTypeOptions = rawRecyclableTypeOptions;
  public selectRawUnitOptions = rawUnitOptions;
  public selectDeliveryTypeOptions = deliveryTypeOptions;
  public selectPaymentMethodRecyclableOptions = paymentMethodRecyclableOptions;
  public selectPaymentMethodGarbageOptions = paymentMethodGarbageOptions;
  public selectLocalitiesOptions: OptionType[] = [];
  public selectDivisionsOptions: OptionType[] = [];
  public selectTimeOptions = timeOptions;

  public form: FormGroup;

  public desiredPickupDateMinDate = tomorrow;

  constructor(private router: Router, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.formInit();
    this.store.dispatch(OrderActions.getLocalitiesRequest({}));

    this.localities$ = this.store
      .select(OrderSelectors.selectAddOrderLocalities)
      .subscribe((localities) => {
        this.localities = localities;
        localities.forEach((locality) => {
          if (locality.isActive) {
            this.selectLocalitiesOptions.push({
              value: locality._id,
              text: locality.name,
            });
          }
        });
      });

    this.isAddOrderSucceed$ = this.store
      .select(OrderSelectors.selectAddOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.router.navigate(['/order-succeed']);
        }
      });

    this.isFetching$ = this.store.select(
      OrderSelectors.selectAddOrderIsFetching
    );

    this.serverError$ = this.store
      .select(OrderSelectors.selectAddOrderError)
      .subscribe((error) => {
        this.serverError = error;
      });
  }

  private formInit(): void {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      rawType: new FormControl('', Validators.required),
      rawAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      rawAmountUnit: new FormControl('0', Validators.required),
      deliveryType: new FormControl('0', Validators.required),
      deliveryAddressLocality: new FormControl('', Validators.required),
      deliveryAddressStreet: new FormControl('', Validators.required),
      deliveryAddressHouse: new FormControl('', Validators.required),
      deliveryCustomerCarNumber: new FormControl(''),
      desiredPickupDate: new FormControl(tomorrow),
      desiredPickupTime: new FormControl(timeOptions[0].value),
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
      if (value === OrderType.recyclable + '') {
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
    if (value === DeliveryType.company + '') {
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
  }

  public divisionsChange(value): void {
    this.selectDivisionsOptions = [];
    if (
      this.form.get('type').value === OrderType.recyclable + '' &&
      this.form.get('deliveryType').value === DeliveryType.pickup + ''
    ) {
      if (value) {
        const currentLocality = this.localities.find((locality) => {
          return locality._id === value;
        });
        currentLocality.divisions.forEach((division: IDivision) => {
          this.selectDivisionsOptions.push({
            value: division._id,
            text: `${division.name} (${division.address.street}, ${division.address.house})`,
          });
        });
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
        this.form.get('type').value === OrderType.recyclable + '')
    ) {
      this.form.get('paymentMethodData').setValidators(Validators.required);
    } else {
      this.form.get('paymentMethodData').clearValidators();
    }
  }

  public submit(): void {
    Object.keys(this.form.controls).forEach((field) => {
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

      this.store.dispatch(OrderActions.addOrderRequest({ order }));
    } else {
      let hasOneElementToScroll = false;

      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control.errors && !hasOneElementToScroll) {
          hasOneElementToScroll = true;

          const fieldId = document.getElementById(field);
          const fieldOffset = fieldId.getBoundingClientRect().top;

          window.scrollTo({
            top: fieldOffset + window.pageYOffset - window.innerHeight / 2,
            behavior: 'smooth',
          });
        }
      });
    }
  }
}
