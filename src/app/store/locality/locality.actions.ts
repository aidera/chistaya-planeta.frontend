import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';

export const GET_LOCALITIES_REQUEST = '[locality] Get Localities Request';
export const GET_LOCALITIES_SUCCESS = '[locality] Get Localities Success';
export const GET_LOCALITIES_FAILURE = '[locality] Get Localities Failure';

export const getLocalitiesRequest = createAction(
  GET_LOCALITIES_REQUEST,
  props<{
    pages?: boolean;
  }>()
);
export const getLocalitiesSuccess = createAction(
  GET_LOCALITIES_SUCCESS,
  props<{
    localities: ILocality[];
  }>()
);
export const getLocalitiesFailure = createAction(
  GET_LOCALITIES_FAILURE,
  props<{ error: ServerError }>()
);
