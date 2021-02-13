import { SimpleStatus } from './enums/SimpleStatus';
import { ICar } from './Car';
import { ILocality } from './Locality';
import { IEmployee } from './Employee';

export interface IDivision {
  _id: string;
  name: string;
  locality: ILocality | string;
  street: string;
  house: string;
  status: SimpleStatus;
  cars: (ICar | string)[];
  employees: (IEmployee | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDivisionLessInfo {
  _id: string;
  name: string;
  locality: string;
  street: string;
  house: string;
  cars: string[];
  employees: string[];
}
