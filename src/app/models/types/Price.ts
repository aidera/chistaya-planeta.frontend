import { PriceType } from '../enums/PriceType';
import { Unit } from '../enums/Unit';

export type Price = {
  type: PriceType;
  unit?: Unit;
  amountWithDelivery?: number;
  amountWithoutDelivery?: number;
  amount?: number;
  description?: string;
};
