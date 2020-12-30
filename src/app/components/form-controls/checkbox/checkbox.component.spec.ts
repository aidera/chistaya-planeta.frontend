import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CheckboxComponent } from './checkbox.component';
import {MaterialModule} from '../../../modules/material/material.module';
import { By } from '@angular/platform-browser';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.debugElement.componentInstance;
    const form = new FormGroup({
      test: new FormControl(true, [Validators.requiredTrue]),
    });
    component.control = form.get('test');
    component.fieldId = 'test';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not be with error at the beginning', () => {
    component.errorMessages = { requiredTrue: 'test' };
    const htmlCheckboxElement = fixture.debugElement.query(
      By.css('.mat-checkbox')
    ).nativeElement;
    expect(htmlCheckboxElement.classList.contains('.error')).toBeFalsy();
  });

  it('should be with error if the field requires and touched', () => {
    component.errorMessages = { requiredTrue: 'test' };
    component.control.setValue(false);
    component.control.markAllAsTouched();
    fixture.detectChanges();

    const htmlCheckboxElement = fixture.debugElement.query(
      By.css('.mat-checkbox')
    ).nativeElement;
    expect(htmlCheckboxElement.classList).toContain('error');
  });

  it('should display label if it have to', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const htmlLabelElement = fixture.debugElement.query(By.css('label'))
      .nativeElement;
    expect(htmlLabelElement.innerHTML).toContain('test label');
  });
});
