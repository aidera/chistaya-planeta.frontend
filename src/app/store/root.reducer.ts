import { ActionReducerMap } from '@ngrx/store';

import * as fromApp from './app/app.reducer';
import * as fromUser from './user/user.reducer';
import * as fromOrder from './order/order.reducer';
import * as fromLocality from './locality/locality.reducer';
import { LOGOUT } from './user/user.actions';

export interface State {
  app: fromApp.AppState;
  user: fromUser.UserState;
  order: fromOrder.OrderState;
  locality: fromLocality.LocalityState;
}

export const rootReducer: ActionReducerMap<State> = {
  app: fromApp.appReducer,
  user: fromUser.userReducer,
  order: fromOrder.orderReducer,
  locality: fromLocality.localityReducer,
};

export function clearState(reducer): any {
  return (state, action) => {
    if (action.type === LOGOUT) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
