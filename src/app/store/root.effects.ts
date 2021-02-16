import { AppEffects } from './app/app.effects';
import { OrdersEffects } from './orders/orders.effects';
import { LocalitiesEffects } from './localities/localities.effects';
import { UsersEffects } from './users/users.effects';
import { DivisionsEffects } from './divisions/divisions.effects';
import { CarsEffects } from './cars/cars.effects';
import { EmployeesEffects } from './employees/employees.effects';

export const rootEffects = [
  AppEffects,
  UsersEffects,
  OrdersEffects,
  LocalitiesEffects,
  DivisionsEffects,
  CarsEffects,
  EmployeesEffects,
];
