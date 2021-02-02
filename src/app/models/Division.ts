import Address from './types/Address';
import { SimpleStatus } from './enums/SimpleStatus';

export interface IDivision {
  _id: string;
  name: string;
  address: Address;
  status: SimpleStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDivisionLessInfo {
  _id: string;
  name: string;
  address: Address;
}
