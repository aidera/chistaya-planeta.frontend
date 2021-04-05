import { OptionType } from '../models/types/OptionType';
import { EmployeeRole } from '../models/enums/EmployeeRole';

export const employeeRoleStrings: string[] = [];
employeeRoleStrings[EmployeeRole.head] = 'Глава';
employeeRoleStrings[EmployeeRole.admin] = 'Администратор';
employeeRoleStrings[EmployeeRole.clientManager] =
  'Менеджер по работе с клиентами';
employeeRoleStrings[EmployeeRole.driver] = 'Водитель';
employeeRoleStrings[EmployeeRole.receivingManager] = 'Принимающий менеджер';

export const employeeRoleOptions: OptionType[] = [
  {
    text: employeeRoleStrings[EmployeeRole.head],
    value: EmployeeRole.head + '',
  },
  {
    text: employeeRoleStrings[EmployeeRole.admin],
    value: EmployeeRole.admin + '',
  },
  {
    text: employeeRoleStrings[EmployeeRole.clientManager],
    value: EmployeeRole.clientManager + '',
  },
  {
    text: employeeRoleStrings[EmployeeRole.driver],
    value: EmployeeRole.driver + '',
  },
  {
    text: employeeRoleStrings[EmployeeRole.receivingManager],
    value: EmployeeRole.receivingManager + '',
  },
];
