import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';
import { tomorrow } from '../../utils/date.functions';
import timeOptions from '../../data/timeOptions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, TextInputComponent],
      imports: [
        MatButtonModule,
        RouterTestingModule,
        ReactiveFormsModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
        HttpClientModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      type: new FormControl('0', Validators.required),
      rawType: new FormControl('0', Validators.required),
      rawAmount: new FormControl('6', [Validators.required, Validators.min(1)]),
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
      paymentMethod: new FormControl('0', Validators.required),
      paymentMethodData: new FormControl(),
      comment: new FormControl(),
      division: new FormControl(),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
