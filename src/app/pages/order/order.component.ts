import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import rawTypeOptions from '../../data/rawTypeOptions';
import rawUnitOptions from '../../data/rawUnitOptions';
import deliveryTypeOptions from '../../data/deliveryTypeOptions';
import paymentMethodOptions from '../../data/paymentMethodOptions';
import citiesOptions from '../../data/citiesOptions';
import timeOptions from '../../data/timeOptions';
import { tomorrow } from '../../utils/date.functions';
import DeliveryType from '../../models/enums/DeliveryType';
import PaymentMethod from '../../models/enums/PaymentMethod';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  public deliveryTypeEnum = DeliveryType;
  public paymentMethodEnum = PaymentMethod;

  public selectRawTypeOptions = rawTypeOptions;
  public selectRawUnitOptions = rawUnitOptions;
  public selectDeliveryTypeOptions = deliveryTypeOptions;
  public selectPaymentMethodOptions = paymentMethodOptions;
  public selectCitiesOptions = citiesOptions;
  public selectTimeOptions = timeOptions;

  public form: FormGroup;

  public desiredPickupDateMinDate = tomorrow;

  constructor() {}

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = new FormGroup({
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
      customerContactPhone: new FormControl('', Validators.required),
      remunerationPaymentMethod: new FormControl('', Validators.required),
      remunerationPaymentMethodData: new FormControl(),
      comment: new FormControl(),
    });

    this.form.get('deliveryType').valueChanges.subscribe((value) => {
      if (value === DeliveryType.company + '') {
        this.form.get('deliveryAddressCity').setValidators(Validators.required);
        this.form
          .get('deliveryAddressStreet')
          .setValidators(Validators.required);
        this.form
          .get('deliveryAddressHouse')
          .setValidators(Validators.required);
        this.form.get('deliveryCustomerCarNumber').clearValidators();
      } else {
        this.form.get('deliveryAddressCity').clearValidators();
        this.form.get('deliveryAddressStreet').clearValidators();
        this.form.get('deliveryAddressHouse').clearValidators();
        this.form
          .get('deliveryCustomerCarNumber')
          .setValidators([Validators.required, Validators.minLength(5)]);
      }
    });

    this.form
      .get('remunerationPaymentMethod')
      .valueChanges.subscribe((value) => {
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
      });
  }

  public submit(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form.valid) {
      console.log('form is valid');
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
