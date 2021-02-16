import { Action, createReducer, on } from '@ngrx/store';

import * as UsersActions from './users.actions';
import { UserType } from '../../models/enums/UserType';
import { IEmployee } from '../../models/Employee';
import IClient from '../../models/Client';
import { ServerError } from '../../models/ServerResponse';

export const usersInitialState = {
  type: null as UserType | null,
  user: null as IEmployee | IClient | null,
  isLoggingIn: false,
  isLoginSucceed: false,
  serverError: null as ServerError | null,
};
export type UsersState = typeof usersInitialState;

const _usersReducer = createReducer(
  usersInitialState,

  on(UsersActions.loginRequest, (state) => ({
    ...state,
    isLoggingIn: true,
    isLoginSucceed: false,
    serverError: null,
  })),

  on(UsersActions.loginSuccess, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: true,
    type: payload.userType,
    user: payload.user,
    serverError: null,
  })),

  on(UsersActions.loginFailure, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: false,
    serverError: { ...payload.error },
  })),

  on(UsersActions.loginSuccessRefresher, (state, payload) => ({
    ...state,
    isLoginSucceed: false,
  }))
);

export function usersReducer(
  state: UsersState | undefined,
  action: Action
): UsersState {
  return _usersReducer(state, action);
}
