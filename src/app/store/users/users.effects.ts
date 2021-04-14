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
            login: action.login,
            password: action.password,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.user) {
                localStorage.setItem('token', resData.token);
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

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getUserRequest),
      switchMap(() => {
        return this.usersApi.getUser().pipe(
          map((resData) => {
            if (resData && resData.user) {
              return UsersActions.getUserSuccess({
                user: resData.user,
                userType: resData.type,
              });
            }
            return UsersActions.getUserFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              UsersActions.getUserFailure({
                error: errorRes.error,
              })
            );
          })
        );
      })
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserRequest),
      switchMap((action) => {
        return this.usersApi
          .updateUser({
            name: action.name,
            surname: action.surname,
            patronymic: action.patronymic,
            phone: action.phone,
            email: action.email,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedUser) {
                return UsersActions.updateUserSuccess({
                  user: resData.updatedUser,
                });
              }
              return UsersActions.updateUserFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                UsersActions.updateUserFailure({
                  error: errorRes.error,
                })
              );
            })
          );
      })
    )
  );

  updateUsersPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUsersPasswordRequest),
      switchMap((action) => {
        return this.usersApi.changeUserPassword(action.password).pipe(
          map((resData) => {
            if (resData && resData.message) {
              return UsersActions.updateUsersPasswordSuccess();
            }
            return UsersActions.updateUsersPasswordFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              UsersActions.updateUsersPasswordFailure({
                error: errorRes.error,
              })
            );
          })
        );
      })
    )
  );

  registerClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.registerClientRequest),
      switchMap((action) => {
        return this.usersApi
          .registerClient({
            name: action.name,
            phone: action.phone,
            email: action.email,
            password: action.password,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.user) {
                localStorage.setItem('token', resData.token);
                return UsersActions.registerClientSuccess({
                  client: resData.user,
                });
              }
              return UsersActions.registerClientFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                UsersActions.registerClientFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  resetClientsPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.resetClientsPasswordRequest),
      switchMap((action) => {
        return this.usersApi.resetClientsPassword(action.email).pipe(
          map((resData) => {
            if (resData && resData.message) {
              return UsersActions.resetClientsPasswordSuccess();
            }
            return UsersActions.resetClientsPasswordFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              UsersActions.resetClientsPasswordFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
