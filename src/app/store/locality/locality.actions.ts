import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { ServerPaginationRequest } from 'src/app/models/types/ServerPaginationRequest';
import { PaginationType } from '../../models/types/PaginationType';
import { ServerSortingRequest } from 'src/app/models/types/ServerSortingRequest';
import { ServerFilterRequest } from '../../models/types/ServerFilterRequest';

export const GET_LOCALITIES_REQUEST = '[locality] get - localities - request';
export const GET_LOCALITIES_SUCCESS = '[locality] get - localities - success';
export const GET_LOCALITIES_FAILURE = '[locality] get - localities - failure';

export const getLocalitiesRequest = createAction(
  GET_LOCALITIES_REQUEST,
  props<{
    pagination?: ServerPaginationRequest;
    sorting?: ServerSortingRequest;
    filter?: ServerFilterRequest;
    search?: string;
  }>()
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
