import { OptionType } from '../models/types/OptionType';
import EmployeeRole from '../models/enums/EmployeeRole';

const employeeRoleOptions: OptionType[] = [
  { text: 'Глава', value: EmployeeRole.head + '' },
  { text: 'Администратор', value: EmployeeRole.admin + '' },
  {
    text: 'Менеджер по работе с клиентами',
    value: EmployeeRole.clientManager + '',
  },
  { text: 'Водитель', value: EmployeeRole.driver + '' },
  { text: 'Принимающий менеджер', value: EmployeeRole.acceptManager + '' },
];

export default employeeRoleOptions;
