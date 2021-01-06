import { ILocality } from './Locality';
import Address from './types/Address';

export interface IDivision {
  _id: string;
  name: string;
  address: Address;
  locality: ILocality | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
