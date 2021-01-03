import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
})
export class RestorePasswordComponent implements OnInit {
  public form1: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;

  public currentForm: 1 | 2 | 3 = 1;

  constructor() {}

  ngOnInit(): void {
    this.formInit1();
    this.formInit2();
    this.formInit3();
  }

  private formInit1(): void {
    this.form1 = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private formInit2(): void {
    this.form2 = new FormGroup({
      code: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]),
    });
  }

  private formInit3(): void {
    this.form3 = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        validators: this.confirmPasswordValidation.bind(this),
      }
    );
  }

  confirmPasswordValidation(
    formGroup: FormGroup
  ): { [key: string]: boolean } | null {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  public submit1(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1.valid) {
      console.log('form is valid');
      this.currentForm = 2;
    }

    console.log('Form submitted: ', this.form1);
    const formData = { ...this.form1.value };
    console.log('Form Data:', formData);
  }

  public submit2(): void {
    Object.keys(this.form2.controls).forEach((field) => {
      const control = this.form2.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form2.valid) {
      console.log('form is valid');
      this.currentForm = 3;
    }

    console.log('Form submitted: ', this.form2);
    const formData = { ...this.form2.value };
    console.log('Form Data:', formData);
  }

  public submit3(): void {
    Object.keys(this.form3.controls).forEach((field) => {
      const control = this.form3.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form3.valid) {
      console.log('form is valid');
      this.currentForm = 1;
    }

    console.log('Form submitted: ', this.form3);
    const formData = { ...this.form3.value };
    console.log('Form Data:', formData);
  }
}
