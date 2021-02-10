import Address from './types/Address';
import { SimpleStatus } from './enums/SimpleStatus';
import { ICar } from './Car';

export interface IDivision {
  _id: string;
  name: string;
  address: Address;
  status: SimpleStatus;
  cars: (ICar | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDivisionLessInfo {
  _id: string;
  name: string;
  address: Address;
  cars: string[];
}
