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

  updateUserIsFetching: false,
  updateUserSucceed: false,
  updateUserError: null as ServerError | null,

  updateUsersPasswordIsFetching: false,
  updateUsersPasswordSucceed: false,
  updateUsersPasswordError: null as ServerError | null,

  isRegistering: false,
  registerServerError: null as ServerError | null,

  resetClientsPasswordIsFetching: false,
  resetClientsPasswordSucceed: false,
  resetClientsPasswordError: null as ServerError | null,
};
export type UsersState = typeof usersInitialState;

const _usersReducer = createReducer(
  usersInitialState,

  /* ------------- */
  /* --- Login --- */
  /* ------------- */

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
    type: UserType.unauthorized,
    user: null,
  })),

  on(UsersActions.loginSuccessRefresher, (state) => ({
    ...state,
    isLoginSucceed: false,
  })),

  /* ---------------- */
  /* --- Get user --- */
  /* ---------------- */

  on(UsersActions.getUserRequest, (state) => ({
    ...state,
    isLoggingIn: true,
    isLoginSucceed: false,
    serverError: null,
  })),

  on(UsersActions.getUserSuccess, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: true,
    type: payload.userType,
    user: payload.user,
    serverError: null,
  })),

  on(UsersActions.getUserFailure, (state, payload) => ({
    ...state,
    isLoggingIn: false,
    isLoginSucceed: false,
    serverError: payload.error,
    type: UserType.unauthorized,
  })),

  /* ------------------- */
  /* --- Update user --- */
  /* ------------------- */

  on(UsersActions.updateUserRequest, (state) => ({
    ...state,
    updateUserIsFetching: true,
    updateUserError: null,
  })),
  on(UsersActions.updateUserSuccess, (state, payload) => ({
    ...state,
    user: payload.user,
    updateUserIsFetching: false,
    updateUserError: null,
    updateUserSucceed: true,
  })),
  on(UsersActions.updateUserFailure, (state, payload) => ({
    ...state,
    updateUserIsFetching: false,
    updateUserError: payload.error,
  })),
  on(UsersActions.refreshUpdateUserSucceed, (state) => ({
    ...state,
    updateUserSucceed: false,
  })),
  on(UsersActions.refreshUpdateUserFailure, (state) => ({
    ...state,
    updateUserError: null,
  })),

  /* ------------------------------ */
  /* --- Update user's password --- */
  /* ------------------------------ */

  on(UsersActions.updateUsersPasswordRequest, (state) => ({
    ...state,
    updateUsersPasswordIsFetching: true,
    updateUsersPasswordError: null,
  })),
  on(UsersActions.updateUsersPasswordSuccess, (state) => ({
    ...state,
    updateUsersPasswordIsFetching: false,
    updateUsersPasswordError: null,
    updateUsersPasswordSucceed: true,
  })),
  on(UsersActions.updateUsersPasswordFailure, (state, payload) => ({
    ...state,
    updateUsersPasswordIsFetching: false,
    updateUsersPasswordError: payload.error,
  })),
  on(UsersActions.refreshUpdateUsersPasswordSucceed, (state) => ({
    ...state,
    updateUsersPasswordSucceed: false,
  })),
  on(UsersActions.refreshUpdateUsersPasswordFailure, (state) => ({
    ...state,
    updateUsersPasswordError: null,
  })),

  /* ----------------------- */
  /* --- Register Client --- */
  /* ----------------------- */

  on(UsersActions.registerClientRequest, (state) => ({
    ...state,
    isRegistering: true,
    registerServerError: null,
  })),

  on(UsersActions.registerClientSuccess, (state, payload) => ({
    ...state,
    isRegistering: false,
    isLoggingIn: false,
    isLoginSucceed: true,
    type: UserType.client,
    user: payload.client,
    registerServerError: null,
    serverError: null,
  })),

  on(UsersActions.registerClientFailure, (state, payload) => ({
    ...state,
    isRegistering: false,
    isLoggingIn: false,
    isLoginSucceed: false,
    registerServerError: { ...payload.error },
    type: UserType.unauthorized,
    user: null,
  })),

  /* ------------------------------- */
  /* --- Reset clients' password --- */
  /* ------------------------------- */

  on(UsersActions.resetClientsPasswordRequest, (state) => ({
    ...state,
    resetClientsPasswordIsFetching: true,
    resetClientsPasswordError: null,
  })),
  on(UsersActions.resetClientsPasswordSuccess, (state) => ({
    ...state,
    resetClientsPasswordIsFetching: false,
    resetClientsPasswordError: null,
    resetClientsPasswordSucceed: true,
  })),
  on(UsersActions.resetClientsPasswordFailure, (state, payload) => ({
    ...state,
    resetClientsPasswordIsFetching: false,
    resetClientsPasswordError: payload.error,
  })),
  on(UsersActions.refreshResetClientsPasswordSucceed, (state) => ({
    ...state,
    resetClientsPasswordSucceed: false,
  })),
  on(UsersActions.refreshResetClientsPasswordFailure, (state) => ({
    ...state,
    resetClientsPasswordError: null,
  }))
);

export function usersReducer(
  state: UsersState | undefined,
  action: Action
): UsersState {
  return _usersReducer(state, action);
}
