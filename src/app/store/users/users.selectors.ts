import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { UsersState } from './users.reducer';

export const selectAll = (state: State) => state.users;

/* ------------------------ */
/* --- Login / Get User --- */
/* ------------------------ */

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

/* ------------------- */
/* --- Update user --- */
/* ------------------- */

export const selectUpdateUserIsFetching = createSelector(
  selectAll,
  (state: UsersState) => state.updateUserIsFetching
);
export const selectUpdateUserSucceed = createSelector(
  selectAll,
  (state: UsersState) => state.updateUserSucceed
);
export const selectUpdateUserError = createSelector(
  selectAll,
  (state: UsersState) => state.updateUserError
);

/* ------------------------------ */
/* --- Update user's password --- */
/* ------------------------------ */

export const selectUpdateUsersPasswordIsFetching = createSelector(
  selectAll,
  (state: UsersState) => state.updateUsersPasswordIsFetching
);
export const selectUpdateUsersPasswordSucceed = createSelector(
  selectAll,
  (state: UsersState) => state.updateUsersPasswordSucceed
);
export const selectUpdateUsersPasswordError = createSelector(
  selectAll,
  (state: UsersState) => state.updateUsersPasswordError
);

/* ---------------- */
/* --- Register --- */
/* ---------------- */

export const selectIsRegistering = createSelector(
  selectAll,
  (state: UsersState) => state.isRegistering
);

export const selectRegisterServerError = createSelector(
  selectAll,
  (state: UsersState) => state.registerServerError
);

/* ------------------------------- */
/* --- Reset clients' password --- */
/* ------------------------------- */

export const selectResetClientsPasswordIsFetching = createSelector(
  selectAll,
  (state: UsersState) => state.resetClientsPasswordIsFetching
);
export const selectResetClientsPasswordSucceed = createSelector(
  selectAll,
  (state: UsersState) => state.resetClientsPasswordSucceed
);
export const selectResetClientsPasswordError = createSelector(
  selectAll,
  (state: UsersState) => state.resetClientsPasswordError
);
