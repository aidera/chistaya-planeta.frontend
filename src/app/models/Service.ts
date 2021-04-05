import { SimpleStatus } from './enums/SimpleStatus';
import { Price } from './types/Price';
import { Unit } from './enums/Unit';

export interface IService {
  _id: string;
  name: string;
  description?: string;
  status: SimpleStatus;
  prices: Price[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceLessInfo {
  _id: string;
  name: string;
  status: SimpleStatus;
  prices: Price[];
}

export interface IServiceToWeigh {
  id: string;
  amount: number;
  unit: Unit;
}
