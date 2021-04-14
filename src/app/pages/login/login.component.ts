import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

import * as fromRoot from '../../store/root.reducer';
import * as UsersActions from '../../store/users/users.actions';
import * as UsersSelectors from '../../store/users/users.selectors';
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
    private title: Title,
    private meta: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>
  ) {
    title.setTitle('Авторизация - Чистая планета');
    meta.addTags([
      {
        name: 'keywords',
        content:
          'чистая планета, авторизация, авторизоваться, войти, войти в личный кабинет',
      },
      {
        name: 'description',
        content:
          'Авторизация в личном кабинете. Чистая Планета - сохраним природу детям!',
      },
    ]);
  }

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }

    this.isLoginSucceed$ = this.store
      .select(UsersSelectors.selectIsLoginSucceed)
      .subscribe((status) => {
        if (status === true) {
          if (this.isEmployee) {
            this.router.navigate(['/e', 'cabinet']);
          } else {
            this.router.navigate(['/cabinet']);
          }
        }
      });

    this.isFetching$ = this.store
      .select(UsersSelectors.selectIsLoggingIn)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.serverError$ = this.store
      .select(UsersSelectors.selectServerError)
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
              this.serverError = 'Неправильный логин или пароль';
              break;
            case responseCodes.invalidEmail:
              this.serverError = 'Некорректный e-mail';
              break;
            case responseCodes.authorizationPeriodExpired:
              this.serverError = 'Истек срок авторизации';
              break;
            case responseCodes.noPermission:
              this.serverError = 'Нет доступа. Аккаунт заблокирован.';
              break;
            case responseCodes.unauthenticated:
              this.serverError = 'Истек срок авторизации';
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
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
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
        UsersActions.loginRequest({
          userType: this.isEmployee ? UserType.employee : UserType.client,
          login: this.form.get('login').value,
          password: this.form.get('password').value,
        })
      );
    }
  }
}
