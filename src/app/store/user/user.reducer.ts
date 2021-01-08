import { Action, createReducer, on } from '@ngrx/store';

import * as UserActions from './user.actions';
import { UserType } from '../../models/enums/UserType';
import { IEmployee } from '../../models/Employee';
import IClient from '../../models/Client';
import { ServerError } from '../../models/ServerResponse';

export const userInitialState = {
  type: null as UserType | null,
  user: null as IEmployee | IClient | null,
  isLoggingIn: false,
  isLoginSucceed: false,
  serverError: null as ServerError | null,
};
export type UserState = typeof userInitialState;

const _userReducer = createReducer(
  userInitialState,

  on(UserActions.loginRequest, (state) => ({
    ...state,
    isLoggingIn: true,
    isLoginSucceed: false,
    serverError: null,
  })),

  on(UserActions.loginSuccess, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: true,
    type: payload.userType,
    user: payload.user,
    serverError: null,
  })),

  on(UserActions.loginFailure, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: false,
    serverError: { ...payload.error },
  })),

  on(UserActions.loginSuccessRefresher, (state, payload) => ({
    ...state,
    isLoginSucceed: false,
  }))
);

export function userReducer(
  state: UserState | undefined,
  action: Action
): UserState {
  return _userReducer(state, action);
}
