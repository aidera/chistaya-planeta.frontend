import { SimpleStatus } from './enums/SimpleStatus';
import { Price } from './types/Price';
import { Unit } from './enums/Unit';

export interface IOffer {
  _id: string;
  name: string;
  description?: string;
  status: SimpleStatus;
  prices: Price[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOfferLessInfo {
  _id: string;
  name: string;
  status: SimpleStatus;
  prices: Price[];
}

export interface IOfferToWeigh {
  id: string;
  amount: number;
  unit: Unit;
}
