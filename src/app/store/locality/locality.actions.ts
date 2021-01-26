import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { PaginationType } from '../../models/types/PaginationType';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { SimpleStatus } from '../../models/enums/SimpleStatus';

export const GET_LOCALITIES_REQUEST = '[locality] get - localities - request';
export const GET_LOCALITIES_SUCCESS = '[locality] get - localities - success';
export const GET_LOCALITIES_FAILURE = '[locality] get - localities - failure';

export const GET_LOCALITY_REQUEST = '[locality] get - locality - request';
export const GET_LOCALITY_SUCCESS = '[locality] get - locality - success';
export const GET_LOCALITY_FAILURE = '[locality] get - locality - failure';

export const UPDATE_LOCALITY_STATUS_REQUEST =
  '[locality] update - update locality status - request';
export const UPDATE_LOCALITY_STATUS_SUCCESS =
  '[locality] update - update locality status - success';
export const UPDATE_LOCALITY_STATUS_FAILURE =
  '[locality] update - update locality status - failure';

export const UPDATE_LOCALITY_REQUEST =
  '[locality] update - update locality - request';
export const UPDATE_LOCALITY_SUCCESS =
  '[locality] update - update locality - success';
export const UPDATE_LOCALITY_FAILURE =
  '[locality] update - update locality - failure';
export const REFRESH_UPDATE_LOCALITY_SUCCESS =
  '[locality] refresh - update locality success';

export const getLocalitiesRequest = createAction(
  GET_LOCALITIES_REQUEST,
  props<GetRouteParamsType>()
);
export const getLocalitiesSuccess = createAction(
  GET_LOCALITIES_SUCCESS,
  props<{
    localities: ILocality[];
    pagination: PaginationType;
  }>()
);
export const getLocalitiesFailure = createAction(
  GET_LOCALITIES_FAILURE,
  props<{ error: ServerError }>()
);

export const getLocalityRequest = createAction(
  GET_LOCALITY_REQUEST,
  props<{ id: string }>()
);
export const getLocalitySuccess = createAction(
  GET_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const getLocalityFailure = createAction(
  GET_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);

export const updateLocalityStatusRequest = createAction(
  UPDATE_LOCALITY_STATUS_REQUEST,
  props<{ id: string; status: SimpleStatus }>()
);
export const updateLocalityStatusSuccess = createAction(
  UPDATE_LOCALITY_STATUS_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const updateLocalityStatusFailure = createAction(
  UPDATE_LOCALITY_STATUS_FAILURE,
  props<{ error: ServerError }>()
);

export const updateLocalityRequest = createAction(
  UPDATE_LOCALITY_REQUEST,
  props<{ id: string; name: string }>()
);
export const updateLocalitySuccess = createAction(
  UPDATE_LOCALITY_SUCCESS,
  props<{
    locality: ILocality;
  }>()
);
export const updateLocalityFailure = createAction(
  UPDATE_LOCALITY_FAILURE,
  props<{ error: ServerError }>()
);

export const refreshUpdateLocalitySucceed = createAction(
  REFRESH_UPDATE_LOCALITY_SUCCESS
);
