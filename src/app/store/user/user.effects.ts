import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as UserActions from './user.actions';
import { UserService } from '../../services/api/user.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userApi: UserService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginRequest),
      switchMap((action) => {
        return this.userApi
          .login({
            type: action.userType,
            email: action.email,
            password: action.password,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.user) {
                return UserActions.loginSuccess({
                  userType: action.userType,
                  user: resData.user,
                });
              }
              return UserActions.loginFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                UserActions.loginFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );
}
