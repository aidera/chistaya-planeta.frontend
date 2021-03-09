import { Action, createReducer, on } from '@ngrx/store';

import * as TasksActions from './tasks.actions';
import { ServerError } from '../../models/ServerResponse';
import { IOrderLessInfo } from '../../models/Order';

export const tasksInitialState = {
  tasks: null as IOrderLessInfo[] | null,

  getTasksAreFetching: false,
  getTasksError: null as ServerError | null,
};
export type TasksState = typeof tasksInitialState;

const _tasksReducer = createReducer(
  tasksInitialState,

  on(TasksActions.getTasksRequest, (state) => ({
    ...state,
    getTasksAreFetching: true,
    getTasksError: null,
  })),
  on(TasksActions.getTasksSuccess, (state, payload) => ({
    ...state,
    tasks: payload.tasks,
    getTasksAreFetching: false,
    getTasksError: null,
  })),
  on(TasksActions.getTasksFailure, (state, payload) => ({
    ...state,
    getTasksAreFetching: false,
    getTasksError: payload.error,
  }))
);

export function tasksReducer(
  state: TasksState | undefined,
  action: Action
): TasksState {
  return _tasksReducer(state, action);
}
