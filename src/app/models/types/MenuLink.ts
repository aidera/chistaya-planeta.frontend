import { EmployeeRole } from '../enums/EmployeeRole';

export type MenuLink = {
  title: string;
  link: string;
  iconPath: string;
  employeesCanSee?: EmployeeRole[];
  clientCanSee?: boolean;
};
