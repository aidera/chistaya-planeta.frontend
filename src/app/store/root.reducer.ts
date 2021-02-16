import { ActionReducerMap } from '@ngrx/store';

import * as fromApp from './app/app.reducer';
import * as fromUsers from './users/users.reducer';
import * as fromOrders from './orders/orders.reducer';
import * as fromLocalities from './localities/localities.reducer';
import * as fromDivisions from './divisions/divisions.reducer';
import * as fromCars from './cars/cars.reducer';
import * as fromEmployees from './employees/employees.reducer';
import { LOGOUT } from './users/users.actions';

export interface State {
  app: fromApp.AppState;
  users: fromUsers.UsersState;
  orders: fromOrders.OrdersState;
  localities: fromLocalities.LocalitiesState;
  divisions: fromDivisions.DivisionsState;
  cars: fromCars.CarsState;
  employees: fromEmployees.EmployeesState;
}

export const rootReducer: ActionReducerMap<State> = {
  app: fromApp.appReducer,
  users: fromUsers.usersReducer,
  orders: fromOrders.ordersReducer,
  localities: fromLocalities.localitiesReducer,
  divisions: fromDivisions.divisionsReducer,
  cars: fromCars.carsReducer,
  employees: fromEmployees.employeesReducer,
};

export function clearState(reducer): any {
  return (state, action) => {
    if (action.type === LOGOUT) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
