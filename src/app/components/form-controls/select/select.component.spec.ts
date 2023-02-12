import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SelectComponent } from './select.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectComponent, ErrorMessageComponent],
        imports: [
          MatSelectModule,
          BrowserAnimationsModule,
          ReactiveFormsModule,
          MatFormFieldModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
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
    const selectField = fixture.debugElement.query(By.css('.mat-select'))
      .nativeElement;
    const messageToCheck = 'This field is required';

    component.errorMessages = { required: messageToCheck };
    let htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'));
    expect(htmlErrorElement).toBeFalsy();
    selectField.dispatchEvent(new InputEvent('focus'));
    fixture.detectChanges();
    htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'));
    expect(htmlErrorElement).toBeFalsy();
  });

  it('should display an error message, if it has', () => {
    const selectField = fixture.debugElement.query(By.css('.mat-select'))
      .nativeElement;
    const messageToCheck = 'This field is required';

    component.errorMessages = { required: messageToCheck };
    selectField.dispatchEvent(new InputEvent('focus'));
    fixture.detectChanges();
    selectField.dispatchEvent(new InputEvent('blur'));
    fixture.detectChanges();
    const htmlErrorElement = fixture.debugElement.query(By.css('.mat-hint'))
      .nativeElement;

    expect(htmlErrorElement.innerHTML).toContain(messageToCheck);
  });

  it('should display label if it have to', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const htmlLabelElement = fixture.debugElement.query(By.css('label'))
      .nativeElement;
    expect(htmlLabelElement.innerHTML).toContain('test label');
  });
});
