import { createAction, props } from '@ngrx/store';

import { ServerError } from '../../models/ServerResponse';
import { IOrderLessInfo } from '../../models/Order';

export const GET_TASKS_REQUEST = '[tasks] get - tasks - request';
export const GET_TASKS_SUCCESS = '[tasks] get - tasks - success';
export const GET_TASKS_FAILURE = '[tasks] get - tasks - failure';

export const getTasksRequest = createAction(GET_TASKS_REQUEST);
export const getTasksSuccess = createAction(
  GET_TASKS_SUCCESS,
  props<{
    tasks: IOrderLessInfo[];
  }>()
);
export const getTasksFailure = createAction(
  GET_TASKS_FAILURE,
  props<{ error: ServerError }>()
);
