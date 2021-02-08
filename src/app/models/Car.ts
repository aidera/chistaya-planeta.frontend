import CarStatus from './enums/CarStatus';
import CarType from './enums/CarType';
import { IEmployee } from './Employee';

export interface ICar {
  _id: string;
  status: CarStatus;
  type: CarType;
  licensePlate: string;
  weight: number;
  isCorporate: boolean;
  drivers: IEmployee[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarLessInfo {
  _id: string;
  type: CarType;
  licensePlate: string;
  isCorporate: boolean;
}
