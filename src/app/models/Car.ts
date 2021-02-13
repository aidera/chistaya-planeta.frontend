import CarStatus from './enums/CarStatus';
import CarType from './enums/CarType';
import { IEmployee } from './Employee';
import { ILocality } from './Locality';
import { IDivision } from './Division';

export interface ICar {
  _id: string;
  status: CarStatus;
  licensePlate: string;
  type: CarType;
  weight: number;
  isCorporate: boolean;
  drivers: (IEmployee | string)[];
  locality: ILocality | string;
  divisions: (IDivision | string)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarLessInfo {
  _id: string;
  type: CarType;
  licensePlate: string;
  isCorporate: boolean;
  locality: string;
  divisions: string[];
}
