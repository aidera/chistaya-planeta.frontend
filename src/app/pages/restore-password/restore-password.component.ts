import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import * as UsersActions from '../../store/users/users.actions';
import { responseCodes } from '../../data/responseCodes';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  private isFetching$: Subscription;
  public isFetching: boolean;
  private isSucceed$: Subscription;
  public isSucceed: boolean;
  private serverError$: Subscription;

  public form: FormGroup;

  private restoreSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    private title: Title,
    private meta: Meta,
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    title.setTitle('Восстановление пароля - Чистая планета');
    meta.addTags([
      {
        name: 'keywords',
        content:
          'чистая планета, забыл пароль, восстановление пароля, сменить пароль, поменять пароль',
      },
      {
        name: 'description',
        content:
          'Сменить пароль от личного кабинета. Чистая Планета - сохраним природу детям!',
      },
    ]);
  }

  ngOnInit(): void {
    this.formInit();

    this.isFetching$ = this.store
      .select(UsersSelectors.selectResetClientsPasswordIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.isSucceed$ = this.store
      .select(UsersSelectors.selectResetClientsPasswordSucceed)
      .subscribe((status) => {
        this.isSucceed = status;

        if (status) {
          this.restoreSnackbar = this.snackBar.open('Отправлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(
            UsersActions.refreshResetClientsPasswordSucceed()
          );

          this.router.navigate(['../', 'login'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(UsersSelectors.selectResetClientsPasswordError)
      .subscribe((error) => {
        if (error) {
          if (error.code) {
            if (error.code === responseCodes.notFound) {
              this.form.get('email').markAsTouched();
              this.form.get('email').setErrors({ notExists: true });
            }
          } else {
            this.restoreSnackbar = this.snackBar.open(
              'Ошибка при восстановлении пароля. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(UsersActions.refreshResetClientsPasswordFailure());
      });
  }

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.isSucceed$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
  }

  private formInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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
        UsersActions.resetClientsPasswordRequest({
          email: this.form.get('email').value,
        })
      );
    }
  }
}
