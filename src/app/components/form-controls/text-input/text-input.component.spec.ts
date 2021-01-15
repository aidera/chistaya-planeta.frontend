import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TextInputComponent } from './text-input.component';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextInputComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.debugElement.componentInstance;
    const form = new FormGroup({
      test: new FormControl('', [Validators.required]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    fixture.detectChanges();
  });

  it('should create the component', () => {
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

  it('should display an error message, if it has', () => {
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

  it('should display an icon if it have to', () => {
    component.icon = '../assets/icons/show.svg';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.icon'))).toBeTruthy();

    component.icon = undefined;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.icon'))).toBeFalsy();
  });

  it('should be a password type if it have to', () => {
    component.type = 'password';
    fixture.detectChanges();
    const htmlInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    expect(htmlInputElement.getAttribute('type')).toBe('password');
  });

  it('should be an email type if it have to', () => {
    component.type = 'email';
    fixture.detectChanges();
    const htmlInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    expect(htmlInputElement.getAttribute('type')).toBe('email');
  });

  it('should display label if it have to', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const htmlLabelElement = fixture.debugElement.query(By.css('label'))
      .nativeElement;
    expect(htmlLabelElement.innerHTML).toContain('test label');
  });

  it('should be displayed if template-driven form is using', () => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.debugElement.componentInstance;
    component.value = 'test value';
    component.onValueChange = () => {};
    component.fieldId = 'test';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should be displayed with the right value if template-driven form is using', () => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.debugElement.componentInstance;
    component.value = 'test value';
    component.onValueChange = () => {};
    component.fieldId = 'test';
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(
      By.css('.mat-input-element')
    ).nativeElement;
    expect(inputElement.getAttribute('ng-reflect-model')).toBe('test value');
  });
});
