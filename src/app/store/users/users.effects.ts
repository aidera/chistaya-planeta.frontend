import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UsersActions from './users.actions';
import { UsersApiService } from '../../services/api/users-api.service';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersApi: UsersApiService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loginRequest),
      switchMap((action) => {
        return this.usersApi
          .login({
            type: action.userType,
            email: action.email,
            password: action.password,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.user) {
                return UsersActions.loginSuccess({
                  userType: action.userType,
                  user: resData.user,
                });
              }
              return UsersActions.loginFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                UsersActions.loginFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );
}