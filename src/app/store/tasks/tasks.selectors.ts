import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { TasksState } from './tasks.reducer';

export const selectAll = (state: State) => state.tasks;

export const selectTasks = createSelector(
  selectAll,
  (state: TasksState) => state.tasks
);

export const selectGetTasksAreFetching = createSelector(
  selectAll,
  (state: TasksState) => state.getTasksAreFetching
);

export const selectGetTasksError = createSelector(
  selectAll,
  (state: TasksState) => state.getTasksError
);
