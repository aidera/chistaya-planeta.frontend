import { AppEffects } from './app/app.effects';
import { OrderEffects } from './order/order.effects';
import { LocalityEffects } from './locality/locality.effects';
import { UserEffects } from './user/user.effects';
import { DivisionEffects } from './division/division.effects';
import { CarEffects } from './car/car.effects';
import { EmployeeEffects } from './employee/employee.effects';

export const rootEffects = [
  AppEffects,
  UserEffects,
  OrderEffects,
  LocalityEffects,
  DivisionEffects,
  CarEffects,
  EmployeeEffects,
];
