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

/* ------------------- */
/* --- Update user --- */
/* ------------------- */

export const UPDATE_USER_REQUEST = '[users] update - user - request';
export const UPDATE_USER_SUCCESS = '[users] update - user - success';
export const UPDATE_USER_FAILURE = '[users] update - user - failure';
export const REFRESH_UPDATE_USER_SUCCESS =
  '[users] refresh - update user success';
export const REFRESH_UPDATE_USER_FAILURE =
  '[users] refresh - update user failure';

/* ------------------------------ */
/* --- Update user's password --- */
/* ------------------------------ */

export const UPDATE_USERS_PASSWORD_REQUEST =
  '[users] update - users password - request';
export const UPDATE_USERS_PASSWORD_SUCCESS =
  '[users] update - users password - success';
export const UPDATE_USERS_PASSWORD_FAILURE =
  '[users] update - users password - failure';
export const REFRESH_UPDATE_USERS_PASSWORD_SUCCESS =
  '[users] refresh - update users password success';
export const REFRESH_UPDATE_USERS_PASSWORD_FAILURE =
  '[users] refresh - update users password failure';

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

export const logout = createAction(LOGOUT);

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

/* ------------------- */
/* --- Update user --- */
/* ------------------- */

export const updateUserRequest = createAction(
  UPDATE_USER_REQUEST,
  props<{
    name?: string;
    surname?: string;
    patronymic?: string;
    phone?: string;
    email?: string;
  }>()
);
export const updateUserSuccess = createAction(
  UPDATE_USER_SUCCESS,
  props<{
    user: IEmployee | IClient;
  }>()
);
export const updateUserFailure = createAction(
  UPDATE_USER_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateUserSucceed = createAction(
  REFRESH_UPDATE_USER_SUCCESS
);
export const refreshUpdateUserFailure = createAction(
  REFRESH_UPDATE_USER_FAILURE
);

/* ------------------------------ */
/* --- Update user's password --- */
/* ------------------------------ */

export const updateUsersPasswordRequest = createAction(
  UPDATE_USERS_PASSWORD_REQUEST,
  props<{
    password: string;
  }>()
);
export const updateUsersPasswordSuccess = createAction(
  UPDATE_USERS_PASSWORD_SUCCESS
);
export const updateUsersPasswordFailure = createAction(
  UPDATE_USERS_PASSWORD_FAILURE,
  props<{ error: ServerError }>()
);
export const refreshUpdateUsersPasswordSucceed = createAction(
  REFRESH_UPDATE_USERS_PASSWORD_SUCCESS
);
export const refreshUpdateUsersPasswordFailure = createAction(
  REFRESH_UPDATE_USERS_PASSWORD_FAILURE
);
