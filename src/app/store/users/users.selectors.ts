import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { UsersState } from './users.reducer';

export const selectAll = (state: State) => state.users;

export const selectUserType = createSelector(
  selectAll,
  (state: UsersState) => state.type
);

export const selectUser = createSelector(
  selectAll,
  (state: UsersState) => state.user
);

export const selectIsLoggingIn = createSelector(
  selectAll,
  (state: UsersState) => state.isLoggingIn
);

export const selectIsLoginSucceed = createSelector(
  selectAll,
  (state: UsersState) => state.isLoginSucceed
);

export const selectServerError = createSelector(
  selectAll,
  (state: UsersState) => state.serverError
);
