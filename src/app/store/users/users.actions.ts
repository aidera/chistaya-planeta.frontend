import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { IEmployee } from '../../models/Employee';
import { UserType } from '../../models/enums/UserType';
import IClient from '../../models/Client';

/* ------------- */
/* --- Login --- */
/* ------------- */

export const LOGIN_REQUEST = '[users] login - request';
export const LOGIN_SUCCESS = '[users] login - success';
export const LOGIN_FAILURE = '[users] login - failure';
export const REFRESH_LOGIN_SUCCESS = '[user] refresh - login success';
export const LOGOUT = '[user] Logout';

/* ---------------- */
/* --- Get user --- */
/* ---------------- */

export const GET_USER_REQUEST = '[users] get - user - request';
export const GET_USER_SUCCESS = '[users] get - user - success';
export const GET_USER_FAILURE = '[users] get - user - failure';

/* ------------- */
/* --- Login --- */
/* ------------- */

export const loginRequest = createAction(
  LOGIN_REQUEST,
  props<{
    email: string;
    password: string;
    userType: UserType;
  }>()
);

export const loginSuccess = createAction(
  LOGIN_SUCCESS,
  props<{
    userType: UserType;
    user: IEmployee | IClient;
  }>()
);

export const loginFailure = createAction(
  LOGIN_FAILURE,
  props<{ error: ServerError }>()
);

export const loginSuccessRefresher = createAction(REFRESH_LOGIN_SUCCESS);

/* ---------------- */
/* --- Get user --- */
/* ---------------- */

export const getUserRequest = createAction(GET_USER_REQUEST);

export const getUserSuccess = createAction(
  GET_USER_SUCCESS,
  props<{
    user: IEmployee | IClient;
    userType: UserType;
  }>()
);

export const getUserFailure = createAction(
  GET_USER_FAILURE,
  props<{ error: ServerError }>()
);
