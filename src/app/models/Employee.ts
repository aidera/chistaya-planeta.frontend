import { EmployeeStatus } from './enums/EmployeeStatus';
import { EmployeeRole } from './enums/EmployeeRole';
import { ILocality } from './Locality';
import { IDivision } from './Division';
import { ICar } from './Car';

export interface IEmployee {
  _id: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email?: string;
  password?: string;
  locality: ILocality | string;
  division: IDivision | string;
  cars: (ICar | string)[];
  dismissalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployeeLessInfo {
  _id: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  name: string;
  surname: string;
  patronymic: string;
  division: string;
  locality: string;
  cars: string[];
}
