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
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
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
    expect(htmlCheckboxElement.classList).toContain('ng-invalid');
  });

  it('should display label if it have to', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const htmlLabelElement = fixture.debugElement.query(By.css('label'))
      .nativeElement;
    expect(htmlLabelElement.innerHTML).toContain('test label');
  });

  it('should be displayed if template-driven form is using', () => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.debugElement.componentInstance;
    component.control = undefined;
    component.value = true;
    component.onValueChange = () => {};
    component.fieldId = 'test';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should be displayed with the right value if template-driven form is using', () => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.debugElement.componentInstance;
    component.control = undefined;
    component.value = true;
    component.onValueChange = () => {};
    component.fieldId = 'test';
    fixture.detectChanges();

    const htmlCheckboxElement = fixture.debugElement.query(
      By.css('.mat-checkbox')
    ).nativeElement;
    expect(htmlCheckboxElement.getAttribute('ng-reflect-model')).toBe('true');

    component.value = false;
    fixture.detectChanges();
    expect(htmlCheckboxElement.getAttribute('ng-reflect-model')).toBe('false');
  });
});
