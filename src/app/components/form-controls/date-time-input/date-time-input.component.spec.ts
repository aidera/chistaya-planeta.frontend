import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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

describe('DateTimeInputComponent', () => {
  let component: DateTimeInputComponent;
  let fixture: ComponentFixture<DateTimeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateTimeInputComponent,
        DateInputComponent,
        TextInputComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeInputComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      test: new FormControl(''),
    });
    component.control = form.get('test');
    component.value = undefined;
    component.fieldId = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be with undefined date and time values, if control value was undefined or empty', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.timeValue).toBe('');
    expect(component.dateValue).toBe(undefined);
  });

  it('should be with date and time values, if control value was not undefined or empty', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.timeValue).not.toBe('');
    expect(component.dateValue).not.toBe(undefined);
  });

  it('should be with undefined date and empty time values, if primary value was  empty', () => {
    component.control = undefined;
    component.value = '';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.timeValue).toBe('');
    expect(component.dateValue).toBe(undefined);
  });

  it('should be with date and time values, if primary value was not undefined or empty', () => {
    component.control = undefined;
    component.value = new Date();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.timeValue).not.toBe('');
    expect(component.dateValue).not.toBe(undefined);
  });

  it('should be with correct time value that includes : symbol', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.timeValue).toContain(':');
  });

  it('should be with correct time value that length is 1 or 2 symbols for hours and 2 symbols for minutes', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    const split = component.timeValue.split(':');
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

    const split = component.timeValue.split(':');
    expect(split).toBeTruthy();
    expect(Number.isInteger(+split[0])).toBeTrue();
    expect(Number.isInteger(+split[1])).toBeTrue();
  });

  it('should set new time if input time is valid (check 1)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(component.dateValue, '4:32');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(4);
    expect(component.control.value.getMinutes()).toBe(32);
  });

  it('should set new time if input time is valid (check 2)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(component.dateValue, '14:32');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(14);
    expect(component.control.value.getMinutes()).toBe(32);
  });

  it('should not set new time if input time is not valid (check 1)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(new Date(), '3:32');
    fixture.detectChanges();

    component.setDateTime(new Date(), '43:11');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(3);
    expect(component.control.value.getMinutes()).toBe(32);
  });
  it('should not set new time if input time is not valid (check 2)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(new Date(), '3:32');
    fixture.detectChanges();

    component.setDateTime(new Date(), ':11');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(3);
    expect(component.control.value.getMinutes()).toBe(32);
  });
  it('should not set new time if input time is not valid (check 3)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(new Date(), '3:32');
    fixture.detectChanges();

    component.setDateTime(new Date(), '1:1');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(3);
    expect(component.control.value.getMinutes()).toBe(32);
  });
  it('should not set new time if input time is not valid (check 4)', () => {
    component.control.setValue(new Date());
    component.ngOnInit();
    fixture.detectChanges();

    component.setDateTime(new Date(), '3:32');
    fixture.detectChanges();

    component.setDateTime(new Date(), '1:77');
    fixture.detectChanges();

    expect(component.control.value.getHours()).toBe(3);
    expect(component.control.value.getMinutes()).toBe(32);
  });
  it(
    'should set time to 00:00 if the date was picked first time ' +
      '(or when pass empty string to time parameter in setDateTime function)',
    () => {
      component.control.setValue(new Date());
      component.ngOnInit();
      fixture.detectChanges();

      component.setDateTime(new Date(), '');
      fixture.detectChanges();

      expect(component.timeValue).toBe('00:00');
    }
  );
});
