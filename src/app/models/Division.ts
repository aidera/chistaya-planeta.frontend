import Address from './types/Address';

export interface IDivision {
  _id: string;
  name: string;
  address: Address;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
