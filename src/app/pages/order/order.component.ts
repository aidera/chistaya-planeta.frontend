import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import orderTypeOptions from '../../data/orderTypeOptions';
import rawRecyclableTypeOptions from '../../data/rawRecyclableTypeOptions';
import rawUnitOptions from '../../data/rawUnitOptions';
import deliveryTypeOptions from '../../data/deliveryTypeOptions';
import paymentMethodOptions from '../../data/paymentMethodOptions';
import citiesOptions from '../../data/citiesOptions';
import timeOptions from '../../data/timeOptions';
import { tomorrow } from '../../utils/date.functions';
import DeliveryType from '../../models/enums/DeliveryType';
import PaymentMethod from '../../models/enums/PaymentMethod';
import OrderType from '../../models/enums/OrderType';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  public orderTypeEnum = OrderType;
  public deliveryTypeEnum = DeliveryType;
  public paymentMethodEnum = PaymentMethod;

  public selectOrderTypeOptions = orderTypeOptions;
  public selectRawTypeOptions = rawRecyclableTypeOptions;
  public selectRawUnitOptions = rawUnitOptions;
  public selectDeliveryTypeOptions = deliveryTypeOptions;
  public selectPaymentMethodOptions = paymentMethodOptions;
  public selectCitiesOptions = citiesOptions;
  public selectTimeOptions = timeOptions;

  public form: FormGroup;

  public desiredPickupDateMinDate = tomorrow;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      rawType: new FormControl('', Validators.required),
      rawAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      rawAmountUnit: new FormControl('0', Validators.required),
      deliveryType: new FormControl('0', Validators.required),
      deliveryAddressCity: new FormControl('', Validators.required),
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
      remunerationPaymentMethod: new FormControl('', Validators.required),
      remunerationPaymentMethodData: new FormControl(),
      comment: new FormControl(),
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
        this.form
          .get('remunerationPaymentMethod')
          .setValidators(Validators.required);
        this.deliveryTypeValidatorsChange(this.form.get('deliveryType').value);
        this.remunerationPaymentMethodValidatorsChange(
          this.form.get('remunerationPaymentMethod').value
        );
      } else {
        this.form.get('rawType').clearValidators();
        this.form.get('rawAmountUnit').clearValidators();
        this.form.get('deliveryType').clearValidators();
        this.form.get('deliveryCustomerCarNumber').clearValidators();
        this.form.get('remunerationPaymentMethod').clearValidators();
        this.form.get('remunerationPaymentMethodData').clearValidators();
      }
    });

    /* --- Смена валидаторов на "Тип доставки" --- */
    /* Если тип доставки выбран "Компанией", то должны показатся поля с городом,
    адресом, улицей и домом, а также помошником */
    /* Если тип доставки выбран "Самовывоз", то поля с городом, адремос, улицей,
    домом и помошником убираются, но появляется номер автомобиля заказчика */
    this.form.get('deliveryType').valueChanges.subscribe((value) => {
      this.deliveryTypeValidatorsChange(value);
    });

    /* --- Смена валидаторов на "Тип оплаты" --- */
    /* Если тип оплыта картой или безналом, то появляется поле с информацие
    о счёте/карте заказчика */
    this.form
      .get('remunerationPaymentMethod')
      .valueChanges.subscribe((value) => {
        this.remunerationPaymentMethodValidatorsChange(value);
      });
  }

  private deliveryTypeValidatorsChange(value): void {
    if (value === DeliveryType.company + '') {
      this.form.get('deliveryAddressCity').setValidators(Validators.required);
      this.form.get('deliveryAddressStreet').setValidators(Validators.required);
      this.form.get('deliveryAddressHouse').setValidators(Validators.required);
      this.form.get('deliveryCustomerCarNumber').clearValidators();
    } else {
      this.form.get('deliveryAddressCity').clearValidators();
      this.form.get('deliveryAddressStreet').clearValidators();
      this.form.get('deliveryAddressHouse').clearValidators();
      this.form
        .get('deliveryCustomerCarNumber')
        .setValidators([Validators.required, Validators.minLength(5)]);
    }
  }

  public remunerationPaymentMethodValidatorsChange(value): void {
    if (
      value === PaymentMethod.card + '' ||
      value === PaymentMethod.nonCash + ''
    ) {
      this.form
        .get('remunerationPaymentMethodData')
        .setValidators(Validators.required);
    } else {
      this.form.get('remunerationPaymentMethodData').clearValidators();
    }
  }

  public submit(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form.valid) {
      console.log('form is valid');
      this.router.navigate(['/order-completed']);
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

    console.log('Form submitted: ', this.form);
    const formData = { ...this.form.value };
    console.log('Form Data:', formData);
  }
}
