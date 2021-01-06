import { ActionReducerMap } from '@ngrx/store';

import * as fromApp from './app/app.reducer';
import * as fromOrder from './order/order.reducer';
import * as fromLocality from './locality/locality.reducer';

export interface State {
  app: fromApp.AppState;
  order: fromOrder.OrderState;
  locality: fromLocality.LocalityState;
}

export const rootReducer: ActionReducerMap<State> = {
  app: fromApp.appReducer,
  order: fromOrder.orderReducer,
  locality: fromLocality.localityReducer,
};
