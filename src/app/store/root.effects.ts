import { AppEffects } from './app/app.effects';
import { OrderEffects } from './order/order.effects';
import { LocalityEffects } from './locality/locality.effects';

export const rootEffects = [AppEffects, OrderEffects, LocalityEffects];
