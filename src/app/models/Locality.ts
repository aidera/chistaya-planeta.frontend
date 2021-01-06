import { IDivision } from './Division';

export interface ILocality {
  _id: string;
  isActive: boolean;
  name: string;
  divisions: (IDivision | string)[];
  createdAt: Date;
  updatedAt: Date;
}
