import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { UserState } from './user.reducer';

export const selectAll = (state: State) => state.user;

export const selectUserType = createSelector(
  selectAll,
  (state: UserState) => state.type
);

export const selectUser = createSelector(
  selectAll,
  (state: UserState) => state.user
);

export const selectIsLoggingIn = createSelector(
  selectAll,
  (state: UserState) => state.isLoggingIn
);

export const selectIsLoginSucceed = createSelector(
  selectAll,
  (state: UserState) => state.isLoginSucceed
);

export const selectServerError = createSelector(
  selectAll,
  (state: UserState) => state.serverError
);
