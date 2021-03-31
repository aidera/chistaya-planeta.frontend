import { AppEffects } from './app/app.effects';
import { OrdersEffects } from './orders/orders.effects';
import { LocalitiesEffects } from './localities/localities.effects';
import { UsersEffects } from './users/users.effects';
import { DivisionsEffects } from './divisions/divisions.effects';
import { CarsEffects } from './cars/cars.effects';
import { EmployeesEffects } from './employees/employees.effects';
import { OffersEffects } from './offers/offers.effects';
import { ServicesEffects } from './services/services.effects';
import { TasksEffects } from './tasks/tasks.effects';
import { ClientsEffects } from './clients/clients.effects';
import { ScheduledOrdersEffects } from './scheduled-orders/scheduled-orders.effects';

export const rootEffects = [
  AppEffects,
  UsersEffects,
  OrdersEffects,
  ClientsEffects,
  LocalitiesEffects,
  DivisionsEffects,
  CarsEffects,
  EmployeesEffects,
  OffersEffects,
  ServicesEffects,
  TasksEffects,
  ScheduledOrdersEffects,
];
