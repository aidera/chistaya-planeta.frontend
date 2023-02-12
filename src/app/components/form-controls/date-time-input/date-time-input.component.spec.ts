import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DateTimeInputComponent } from './date-time-input.component';
import { DateInputComponent } from '../date-input/date-input.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

describe('DateTimeInputComponent', () => {
  let component: DateTimeInputComponent;
  let fixture: ComponentFixture<DateTimeInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          DateTimeInputComponent,
          DateInputComponent,
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
    fixture = TestBed.createComponent(DateTimeInputComponent);
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

  it('should be with undefined date and time values, if control value was undefined or empty', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('date').value).toBe('');
    expect(component.form.get('time').value).toBe('');
  });

  it('should be with date and time values, if control value was not undefined or empty', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('date').value).not.toBe('');
    expect(component.form.get('time').value).not.toBe('');
  });

  it('should be with correct time value that includes : symbol', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('time').value).toContain(':');
  });

  it('should be with correct time value that length is 1 or 2 symbols for hours and 2 symbols for minutes', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    const split = component.form.get('time').value.split(':');
    expect(split).toBeTruthy();
    expect(split.length).toBe(2);
    expect(split[0].length).toBeGreaterThan(0);
    expect(split[0].length).toBeLessThan(3);
    expect(split[1].length).toBe(2);
  });

  it('should be with correct time value with numbers', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    const split = component.form.get('time').value.split(':');
    expect(split).toBeTruthy();
    expect(Number.isInteger(+split[0])).toBeTrue();
    expect(Number.isInteger(+split[1])).toBeTrue();
  });

  it('should set new time if input time is valid', () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    component.control.setValue(date);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(hours);
    expect(component.control.value.getMinutes()).toBe(minutes);
  });

  it(
    'should set time to 00:00 if the date was picked first time ' +
      '(or when pass empty string to time parameter in setDateTime function)',
    () => {
      const date = new Date();
      const newDate = new Date(date.setHours(0, 0, 0, 0));

      component.control.setValue(newDate);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.form.get('time').value).toBe('00:00');
    }
  );
});
