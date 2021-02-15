import { IDivision } from './Division';
import { SimpleStatus } from './enums/SimpleStatus';
import { ICar } from './Car';
import { IEmployee } from './Employee';

export interface ILocality {
  _id: string;
  status: SimpleStatus;
  name: string;
  divisions: (IDivision | string)[];
  cars: (ICar | string)[];
  employees: (IEmployee | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocalityLessInfo {
  _id: string;
  status: SimpleStatus;
  name: string;
  divisions: string[];
  cars: string[];
  employees: string[];
}
