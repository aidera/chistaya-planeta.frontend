import { SimpleStatus } from './enums/SimpleStatus';
import Price from './types/Price';

export interface IService {
  _id: string;
  name: string;
  description?: string;
  status: SimpleStatus;
  prices: Price[];
  createdAt?: Date;
  updatedAt?: Date;
}
