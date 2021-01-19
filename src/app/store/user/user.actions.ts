import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { IEmployee } from '../../models/Employee';
import { UserType } from '../../models/enums/UserType';
import IClient from '../../models/Client';

export const LOGIN_REQUEST = '[user] login - request';
export const LOGIN_SUCCESS = '[user] login - success';
export const LOGIN_FAILURE = '[user] login - failure';
export const REFRESH_LOGIN_SUCCESS = '[user] refresh - login success';
export const LOGOUT = '[user] Logout';

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
