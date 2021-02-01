import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../store/root.reducer';
import * as UserActions from '../../store/user/user.actions';
import * as UserSelectors from '../../store/user/user.selectors';
import { UserType } from '../../models/enums/UserType';
import { responseCodes } from '../../data/responseCodes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public isEmployee: boolean;
  public form: FormGroup;

  private isLoginSucceed$: Subscription;
  private isFetching$: Subscription;
  public isFetching: boolean;
  private serverError$: Subscription;
  public serverError: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }

    this.isLoginSucceed$ = this.store
      .select(UserSelectors.selectIsLoginSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.router.navigate(['/order-succeed']);
        }
      });

    this.isFetching$ = this.store
      .select(UserSelectors.selectIsLoggingIn)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.serverError$ = this.store
      .select(UserSelectors.selectServerError)
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
            default:
              this.serverError =
                'Ошибка сервера. Попробуйте авторизироваться позже.';
              break;
          }
        } else {
          this.serverError = null;
        }
      });

    this.formInit();
  }

  ngOnDestroy(): void {
    this.isLoginSucceed$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
    this.isLoginSucceed$?.unsubscribe?.();
  }

  private formInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.form.valueChanges.subscribe((val) => {
      this.serverError = null;
    });
  }

  public submit(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form.valid) {
      this.store.dispatch(
        UserActions.loginRequest({
          userType: this.isEmployee ? UserType.employee : UserType.client,
          email: this.form.get('email').value,
          password: this.form.get('password').value,
        })
      );
    }
  }
}
