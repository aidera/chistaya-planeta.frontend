import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { DateInputComponent } from './date-input.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DateInputComponent, ErrorMessageComponent],
        imports: [
          ReactiveFormsModule,
          MatFormFieldModule,
          BrowserAnimationsModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatInputModule,
          HttpClientModule,
          InlineSVGModule.forRoot(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      test: new FormControl('', [Validators.required]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display an error message, at the beginning', () => {
    const textField = fixture.debugElement.query(By.css('input')).nativeElement;
    const messageToCheck = 'This field is required';

    component.errorMessages = { required: messageToCheck };
    let htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'));
    expect(htmlErrorElement).toBeFalsy();
    textField.dispatchEvent(new InputEvent('focus'));
    fixture.detectChanges();
    htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'));
    expect(htmlErrorElement).toBeFalsy();
  });

  it('should display an error message if the field is not focused', () => {
    const textField = fixture.debugElement.query(By.css('input')).nativeElement;
    const messageToCheck = 'This field is required';

    component.errorMessages = { required: messageToCheck };
    textField.dispatchEvent(new InputEvent('focus'));
    fixture.detectChanges();
    textField.dispatchEvent(new InputEvent('blur'));
    fixture.detectChanges();
    const htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'))
      .nativeElement;

    expect(htmlErrorElement.innerHTML).toContain(messageToCheck);
  });

  it('should display an icon', () => {
    expect(fixture.debugElement.query(By.css('.icon'))).toBeTruthy();
  });

  it('should display label if it have to', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const htmlLabelElement = fixture.debugElement.query(By.css('label'))
      .nativeElement;
    expect(htmlLabelElement.innerHTML).toContain('test label');
  });
});
