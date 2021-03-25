import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import * as UsersActions from '../../store/users/users.actions';
import { responseCodes } from '../../data/responseCodes';
import { debounceTime, take } from 'rxjs/operators';
import { ClientsApiService } from '../../services/api/clients-api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public form: FormGroup;

  private client$: Subscription;
  private isFetching$: Subscription;
  public isFetching: boolean;
  private serverError$: Subscription;
  public serverError: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private clientsApi: ClientsApiService
  ) {}

  ngOnInit(): void {
    this.client$ = this.store
      .select(UsersSelectors.selectUser)
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/cabinet']);
        }
      });

    this.isFetching$ = this.store
      .select(UsersSelectors.selectIsRegistering)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.serverError$ = this.store
      .select(UsersSelectors.selectRegisterServerError)
      .subscribe((error) => {
        if (error) {
          let errorCode: string;
          if (error.code === responseCodes.validationFailed) {
            errorCode = error.errors[0].msg;
          } else {
            errorCode = error.code;
          }

          switch (errorCode) {
            case responseCodes.emailOrPasswordIsNotCorrect:
              this.serverError = 'Неправильный e-mail или пароль';
              break;
            case responseCodes.invalidEmail:
              this.serverError = 'Некорректный e-mail';
              break;
            case responseCodes.authorizationPeriodExpired:
              this.serverError = 'Истек срок авторизации';
              break;
            case responseCodes.alreadyExists:
              this.serverError = 'Данный email уже зарегистрирован';
              break;
            case responseCodes.validationFailed:
              this.serverError = 'Данные некорректны';
              break;
            default:
              this.serverError =
                'Ошибка сервера. Попробуйте зарегистрироваться позже.';
              break;
          }
        } else {
          this.serverError = null;
        }
      });

    this.formInit();
  }

  private formInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        name: new FormControl('', [Validators.required]),
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

    this.form
      .get('email')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value !== '' && value.includes('@')) {
          this.clientsApi
            .checkEmail(this.form.get('email').value)
            .pipe(take(1))
            .subscribe((response) => {
              if (response?.responseCode === responseCodes.found) {
                this.form.get('email').markAsTouched();
                this.form.get('email').setErrors({ alreadyExists: true });
              }
            });
        }
      });
  }

  confirmPasswordValidation(
    formGroup: FormGroup
  ): { [key: string]: boolean } | null {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  public submit(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form.valid) {
      this.store.dispatch(
        UsersActions.registerClientRequest({
          name: this.form.get('name').value,
          email: this.form.get('email').value,
          phone: '+7' + this.form.get('phone').value,
          password: this.form.get('password').value,
        })
      );
    }
  }
}
