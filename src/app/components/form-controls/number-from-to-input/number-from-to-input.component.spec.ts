import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NumberFromToInputComponent } from './number-from-to-input.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

describe('NumberFromToInputComponent', () => {
  let component: NumberFromToInputComponent;
  let fixture: ComponentFixture<NumberFromToInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          NumberFromToInputComponent,
          TextInputComponent,
          ErrorMessageComponent,
        ],
        imports: [
          ReactiveFormsModule,
          HttpClientModule,
          NgxMaskModule.forRoot(),
          MatDatepickerModule,
          MatNativeDateModule,
          InlineSVGModule.forRoot(),
          MatFormFieldModule,
          MatInputModule,
          BrowserAnimationsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberFromToInputComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      test: new FormControl(''),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the first number if control has value', () => {
    const form = new FormGroup({
      test: new FormControl([1, null]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('number1').value).toBe(1);
    expect(component.form.get('number2').value).toBe(null);
  });

  it('should set the second number if control has value', () => {
    const form = new FormGroup({
      test: new FormControl([null, 1]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('number1').value).toBe(null);
    expect(component.form.get('number2').value).toBe(1);
  });

  it('should set both numbers if the control has value', () => {
    const form = new FormGroup({
      test: new FormControl([2, 1]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('number1').value).toBe(2);
    expect(component.form.get('number2').value).toBe(1);
  });

  it('should set empty values if the control is empty', () => {
    const form = new FormGroup({
      test: new FormControl(''),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('number1').value).toBe(null);
    expect(component.form.get('number2').value).toBe(null);
  });
});
