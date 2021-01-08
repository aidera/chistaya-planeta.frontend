import { AppEffects } from './app/app.effects';
import { OrderEffects } from './order/order.effects';
import { LocalityEffects } from './locality/locality.effects';
import { UserEffects } from './user/user.effects';

export const rootEffects = [
  AppEffects,
  UserEffects,
  OrderEffects,
  LocalityEffects,
];
