import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TextInputComponent } from './text-input.component';
import {MaterialModule} from '../../../modules/material.module';
import { By } from '@angular/platform-browser';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextInputComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
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

  it('should not display an error message, at the beginning and without blur', () => {
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

  it('should display an error message, when blur', () => {
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

  it('should display a modules icon if it have to', () => {

    fixture.detectChanges();
    let htmlIconElement = fixture.debugElement.query(By.css('.mat-icon'))
      .nativeElement;
    expect(htmlIconElement.innerHTML).toContain('local_post_office');

    component.icon = undefined;
    fixture.detectChanges();
    htmlIconElement = fixture.debugElement.query(By.css('.mat-icon'));
    expect(htmlIconElement).toBeFalsy();
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
});
