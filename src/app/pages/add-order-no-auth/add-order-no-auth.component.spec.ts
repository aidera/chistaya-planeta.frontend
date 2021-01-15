import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { AddOrderNoAuthComponent } from './add-order-no-auth.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';
import { DateInputComponent } from '../../components/form-controls/date-input/date-input.component';
import { SelectComponent } from '../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../components/form-controls/checkbox/checkbox.component';
import { AuthNotifyComponent } from '../../components/auth-notify/auth-notify.component';
import * as OrderActions from '../../store/order/order.actions';
import OrderType from '../../models/enums/OrderType';
import { QuestionHintComponent } from '../../components/question-hint/question-hint.component';
import { MaterialModule } from '../../modules/material/material.module';
import { TextareaComponent } from '../../components/form-controls/textarea/textarea.component';
import DeliveryType from '../../models/enums/DeliveryType';
import { ILocality } from '../../models/Locality';
import PaymentMethod from '../../models/enums/PaymentMethod';
import { tomorrow } from '../../utils/date.functions';
import timeOptions from '../../data/timeOptions';

let store: MockStore;
let storeDispatchSpy: jasmine.Spy;

describe('AddOrderNoAuthComponent', () => {
  let component: AddOrderNoAuthComponent;
  let fixture: ComponentFixture<AddOrderNoAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddOrderNoAuthComponent,
        TextInputComponent,
        TextareaComponent,
        DateInputComponent,
        SelectComponent,
        CheckboxComponent,
        AuthNotifyComponent,
        QuestionHintComponent,
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxMaskModule.forRoot(),
        InlineSVGModule.forRoot(),
        HttpClientModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            order: {
              addOrderLocalities: [] as ILocality[],
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AddOrderNoAuthComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request localities from the store at the initialization', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      OrderActions.getLocalitiesRequest({})
    );
  });

  it('should see only the type field at the beginning', () => {
    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    expect(fields.length).toBe(1);
    expect(fields[0].nativeElement.getAttribute('fieldid')).toBe('type');
  });

  it('should display fields for garbage type, if user selected it', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('rawType')).toBeFalsy();
    expect(types.includes('rawAmount')).toBeTruthy();
    expect(types.includes('rawAmountUnit')).toBeFalsy();
    expect(types.includes('deliveryType')).toBeFalsy();
    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeTruthy();
    expect(types.includes('deliveryAddressHouse')).toBeTruthy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeFalsy();
    expect(types.includes('desiredPickupDate')).toBeTruthy();
    expect(types.includes('desiredPickupTime')).toBeTruthy();
    expect(types.includes('hasAssistant')).toBeTruthy();
    expect(types.includes('customerOrganizationLegalName')).toBeTruthy();
    expect(types.includes('customerOrganizationActualName')).toBeTruthy();
    expect(types.includes('customerContactName')).toBeTruthy();
    expect(types.includes('customerContactPhone')).toBeTruthy();
    expect(types.includes('paymentMethod')).toBeTruthy();
    expect(types.includes('paymentMethodData')).toBeFalsy();
    expect(types.includes('comment')).toBeTruthy();
    expect(types.includes('division')).toBeFalsy();
  });

  it('should display fields for recyclable type, if user selected it', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    // expect(component.form.controls.deliveryType.value).toBe(DeliveryType.company + '')
    expect(types.includes('rawType')).toBeTruthy();
    expect(types.includes('rawAmount')).toBeTruthy();
    expect(types.includes('rawAmountUnit')).toBeTruthy();
    expect(types.includes('deliveryType')).toBeTruthy();
    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeFalsy();
    expect(types.includes('deliveryAddressHouse')).toBeFalsy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeFalsy();
    expect(types.includes('desiredPickupDate')).toBeTruthy();
    expect(types.includes('desiredPickupTime')).toBeTruthy();
    expect(types.includes('hasAssistant')).toBeFalsy();
    expect(types.includes('customerOrganizationLegalName')).toBeTruthy();
    expect(types.includes('customerOrganizationActualName')).toBeTruthy();
    expect(types.includes('customerContactName')).toBeTruthy();
    expect(types.includes('customerContactPhone')).toBeTruthy();
    expect(types.includes('paymentMethod')).toBeTruthy();
    expect(types.includes('paymentMethodData')).toBeFalsy();
    expect(types.includes('comment')).toBeTruthy();
    expect(types.includes('division')).toBeFalsy();
  });

  it('should display fields for recyclable type, if user selected it', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('rawType')).toBeTruthy();
    expect(types.includes('rawAmount')).toBeTruthy();
    expect(types.includes('rawAmountUnit')).toBeTruthy();
    expect(types.includes('deliveryType')).toBeTruthy();
    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeFalsy();
    expect(types.includes('deliveryAddressHouse')).toBeFalsy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeFalsy();
    expect(types.includes('desiredPickupDate')).toBeTruthy();
    expect(types.includes('desiredPickupTime')).toBeTruthy();
    expect(types.includes('hasAssistant')).toBeFalsy();
    expect(types.includes('customerOrganizationLegalName')).toBeTruthy();
    expect(types.includes('customerOrganizationActualName')).toBeTruthy();
    expect(types.includes('customerContactName')).toBeTruthy();
    expect(types.includes('customerContactPhone')).toBeTruthy();
    expect(types.includes('paymentMethod')).toBeTruthy();
    expect(types.includes('paymentMethodData')).toBeFalsy();
    expect(types.includes('comment')).toBeTruthy();
    expect(types.includes('division')).toBeFalsy();
  });

  it('should display fields for company delivery, if order type is recyclable raw', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.company + '');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeTruthy();
    expect(types.includes('deliveryAddressHouse')).toBeTruthy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeFalsy();
    expect(types.includes('hasAssistant')).toBeTruthy();
  });

  it('should display fields for pickup delivery, if order type is recyclable raw', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeFalsy();
    expect(types.includes('deliveryAddressHouse')).toBeFalsy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeTruthy();
    expect(types.includes('hasAssistant')).toBeFalsy();
  });

  it('should not display fields for pickup delivery, if order type is garbage', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');
    component.form.controls.deliveryType.setValue('');
    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeTruthy();
    expect(types.includes('deliveryAddressHouse')).toBeTruthy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeFalsy();
    expect(types.includes('hasAssistant')).toBeTruthy();
    expect(types.includes('division')).toBeFalsy();
  });

  it('should display division field, if locality selected and deliveryType is pickup', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');
    component.form.controls.deliveryAddressLocality.setValue('1');
    component.selectDivisionsOptions = [
      {
        text: '1',
        value: '1',
      },
      {
        text: '2',
        value: '2',
      },
    ];

    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeFalsy();
    expect(types.includes('deliveryAddressHouse')).toBeFalsy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeTruthy();
    expect(types.includes('division')).toBeTruthy();
    expect(types.includes('hasAssistant')).toBeFalsy();
  });

  it('should not display division field, if division is only 1', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');
    component.form.controls.deliveryAddressLocality.setValue('1');
    component.selectDivisionsOptions = [
      {
        text: '1',
        value: '1',
      },
    ];

    fixture.detectChanges();

    const fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    const types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('deliveryAddressLocality')).toBeTruthy();
    expect(types.includes('deliveryAddressStreet')).toBeFalsy();
    expect(types.includes('deliveryAddressHouse')).toBeFalsy();
    expect(types.includes('deliveryCustomerCarNumber')).toBeTruthy();
    expect(types.includes('division')).toBeFalsy();
    expect(types.includes('hasAssistant')).toBeFalsy();
  });

  it('should display payment information field, if payment type is non-cash or card', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.paymentMethod.setValue(PaymentMethod.nonCash + '');

    fixture.detectChanges();

    let fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    let types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('paymentMethodData')).toBeTruthy();

    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.paymentMethod.setValue(PaymentMethod.card + '');

    fixture.detectChanges();

    fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('paymentMethodData')).toBeTruthy();

    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.paymentMethod.setValue(PaymentMethod.cash + '');

    fixture.detectChanges();

    fields = fixture.debugElement.queryAll(By.css('[fieldid]'));

    types = [];
    fields.forEach((field) => {
      types.push(field.nativeElement.getAttribute('fieldid'));
    });

    expect(types.includes('paymentMethodData')).toBeFalsy();
  });

  it('should has required validation error for type field, if it is empty', () => {
    const field = component.form.get('type');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the rawType field, if the rawType field is empty and the type field is recyclable', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');

    const field = component.form.get('rawType');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should not has required validation error for the rawType field, if the rawType field is empty and the type field is garbage', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');

    const field = component.form.get('rawType');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors && field.errors.required).toBeFalsy();
  });

  it('should has required validation error for the rawAmount field, if the rawAmount field is empty', () => {
    const field = component.form.get('rawAmount');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the rawAmountUnit field, if the rawAmountUnit field is empty and the type field is recyclable', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');

    const field = component.form.get('rawAmountUnit');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has not required validation error for the rawAmountUnit field, if the rawAmountUnit field is empty and the type field is garbage', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');

    const field = component.form.get('rawAmountUnit');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors && field.errors.required).toBeFalsy();
  });

  it('should has required validation error for the rawAmount field, if the rawAmount field is empty', () => {
    const field = component.form.get('rawAmount');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has min value validation error for the rawAmount field, if the rawAmount field is less then 1', () => {
    const field = component.form.get('rawAmount');

    field.setValue('0');
    fixture.detectChanges();

    expect(field.errors.min).toBeTruthy();
  });

  it('should has required validation error for the deliveryType field, if the type field is recyclable', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');

    const field = component.form.get('deliveryType');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has not required validation error for the deliveryType field, if the type field is garbage', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');

    const field = component.form.get('deliveryType');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors && field.errors.required).toBeFalsy();
  });

  it('should has required validation error for the deliveryAddressLocality field, if it is empty', () => {
    const field = component.form.get('deliveryAddressLocality');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the division field, if the type field is recyclable and deliveryType is pickup', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');

    const field = component.form.get('division');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has not required validation error for the division field, if the type field is recyclable and deliveryType is company', () => {
    component.form.controls.type.setValue(OrderType.recyclable + '');
    component.form.controls.deliveryType.setValue(DeliveryType.company + '');

    const field = component.form.get('division');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors && field.errors.required).toBeFalsy();
  });

  it('should has not required validation error for the division field, if the type field is garbage', () => {
    component.form.controls.type.setValue(OrderType.garbage + '');

    const field = component.form.get('division');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors && field.errors.required).toBeFalsy();
  });

  it(
    'should has required validation error for the deliveryAddressStreet field, ' +
      'if the type field is recyclable and deliveryType is company',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.company + '');

      const field = component.form.get('deliveryAddressStreet');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it(
    'should has not required validation error for the deliveryAddressStreet field, ' +
      'if the type field is recyclable and deliveryType is pickup',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');

      const field = component.form.get('deliveryAddressStreet');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors && field.errors.required).toBeFalsy();
    }
  );

  it(
    'should has required validation error for the deliveryAddressStreet field, ' +
      'if the type field is garbage',
    () => {
      component.form.controls.type.setValue(OrderType.garbage + '');

      const field = component.form.get('deliveryAddressStreet');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it(
    'should has required validation error for the deliveryAddressHouse field, ' +
      'if the type field is recyclable and deliveryType is company',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.company + '');

      const field = component.form.get('deliveryAddressHouse');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it(
    'should has not required validation error for the deliveryAddressHouse field, ' +
      'if the type field is recyclable and deliveryType is pickup',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');

      const field = component.form.get('deliveryAddressHouse');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors && field.errors.required).toBeFalsy();
    }
  );

  it(
    'should has required validation error for the deliveryAddressHouse field, ' +
      'if the type field is garbage',
    () => {
      component.form.controls.type.setValue(OrderType.garbage + '');

      const field = component.form.get('deliveryAddressHouse');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it(
    'should has required validation error for the deliveryCustomerCarNumber field, ' +
      'if the type field is recyclable and the deliveryType field is pickup',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');

      const field = component.form.get('deliveryCustomerCarNumber');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it(
    'should has minlength validation error for the deliveryCustomerCarNumber field, ' +
      'if this field is less then 5 chars, the type field is recyclable and the deliveryType field is pickup',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.pickup + '');

      const field = component.form.get('deliveryCustomerCarNumber');

      field.setValue('23');
      fixture.detectChanges();

      expect(field.errors.minlength).toBeTruthy();
    }
  );

  it(
    'should has not required validation error for the deliveryCustomerCarNumber field, ' +
      'if the type field is recyclable and the deliveryType field is company',
    () => {
      component.form.controls.type.setValue(OrderType.recyclable + '');
      component.form.controls.deliveryType.setValue(DeliveryType.company + '');

      const field = component.form.get('deliveryCustomerCarNumber');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors && field.errors.required).toBeFalsy();
    }
  );

  it(
    'should has not required validation error for the deliveryCustomerCarNumber field, ' +
      'if the type field is garbage',
    () => {
      component.form.controls.type.setValue(OrderType.garbage + '');

      const field = component.form.get('deliveryCustomerCarNumber');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors && field.errors.required).toBeFalsy();
    }
  );

  it('should has required validation error for the desiredPickupDate field, if it is empty', () => {
    const field = component.form.get('desiredPickupDate');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the desiredPickupTime field, if it is empty', () => {
    const field = component.form.get('desiredPickupTime');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the customerContactName field, if it is empty', () => {
    const field = component.form.get('customerContactName');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error for the customerContactPhone field, if it is empty', () => {
    const field = component.form.get('customerContactPhone');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has minlength validation error for the customerContactPhone field, if it less then 10 chars without +7', () => {
    const field = component.form.get('customerContactPhone');

    field.setValue('434343');
    fixture.detectChanges();

    expect(field.errors.minlength).toBeTruthy();
  });

  it('should has required validation error for the paymentMethod field, if it is empty', () => {
    const field = component.form.get('paymentMethod');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it(
    'should has required validation error for the paymentMethodData field, ' +
      'if it is empty, the type field is recyclable and paymentMethod is card or nonCash',
    () => {
      component.form.get('type').setValue(OrderType.recyclable + '');
      component.form.get('paymentMethod').setValue(PaymentMethod.card + '');
      const field = component.form.get('paymentMethodData');

      field.setValue('');
      fixture.detectChanges();

      expect(field.errors.required).toBeTruthy();
    }
  );

  it('should dispatch an add order action if the fields are correct', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.form.controls.type.setValue(OrderType.garbage + '');
    component.form.controls.rawAmount.setValue('4');
    component.form.controls.deliveryAddressLocality.setValue('location1');
    component.form.controls.deliveryAddressStreet.setValue('street');
    component.form.controls.deliveryAddressHouse.setValue('house');
    component.form.controls.desiredPickupDate.setValue(tomorrow);
    component.form.controls.desiredPickupTime.setValue(timeOptions[0]);
    component.form.controls.customerContactName.setValue('name');
    component.form.controls.customerContactPhone.setValue('0987654321');
    component.form.controls.paymentMethod.setValue(PaymentMethod.cash);
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not dispatch an add order action if the fields are incorrect', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.form.controls.type.setValue(OrderType.garbage + '');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });
});
