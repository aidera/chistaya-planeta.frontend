import EmployeeStatus from './enums/EmployeeStatus';
import EmployeeRole from './enums/EmployeeRole';

export interface IEmployee {
  _id: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
  division: string;
  dismissalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
