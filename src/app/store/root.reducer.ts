import { ActionReducerMap } from '@ngrx/store';

import * as fromApp from './app/app.reducer';
import * as fromUsers from './users/users.reducer';
import * as fromOrders from './orders/orders.reducer';
import * as fromClients from './clients/clients.reducer';
import * as fromLocalities from './localities/localities.reducer';
import * as fromDivisions from './divisions/divisions.reducer';
import * as fromCars from './cars/cars.reducer';
import * as fromEmployees from './employees/employees.reducer';
import * as fromOffers from './offers/offers.reducer';
import * as fromServices from './services/services.reducer';
import * as fromTasks from './tasks/tasks.reducer';
import * as fromScheduledOrders from './scheduled-orders/scheduled-orders.reducer';
import { LOGOUT } from './users/users.actions';

export interface State {
  app: fromApp.AppState;
  users: fromUsers.UsersState;
  orders: fromOrders.OrdersState;
  clients: fromClients.ClientsState;
  localities: fromLocalities.LocalitiesState;
  divisions: fromDivisions.DivisionsState;
  cars: fromCars.CarsState;
  employees: fromEmployees.EmployeesState;
  offers: fromOffers.OffersState;
  services: fromServices.ServicesState;
  tasks: fromTasks.TasksState;
  scheduledOrders: fromScheduledOrders.ScheduledOrdersState;
}

export const rootReducer: ActionReducerMap<State> = {
  app: fromApp.appReducer,
  users: fromUsers.usersReducer,
  orders: fromOrders.ordersReducer,
  clients: fromClients.clientsReducer,
  localities: fromLocalities.localitiesReducer,
  divisions: fromDivisions.divisionsReducer,
  cars: fromCars.carsReducer,
  employees: fromEmployees.employeesReducer,
  offers: fromOffers.offersReducer,
  services: fromServices.servicesReducer,
  tasks: fromTasks.tasksReducer,
  scheduledOrders: fromScheduledOrders.scheduledOrdersReducer,
};

export function clearState(reducer): any {
  return (state, action) => {
    if (action.type === LOGOUT) {
      localStorage.removeItem('token');
      state = undefined;
    }
    return reducer(state, action);
  };
}
