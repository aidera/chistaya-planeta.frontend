import { OptionType } from '../models/types/OptionType';
import { TextColor } from '../models/types/TextColor';
import EmployeeStatus from '../models/enums/EmployeeStatus';

export const employeeStatusStrings: string[] = [];
employeeStatusStrings[EmployeeStatus.active] = 'Активно';
employeeStatusStrings[EmployeeStatus.vacation] = 'В отпуске';
employeeStatusStrings[EmployeeStatus.fired] = 'Не активно';

export const employeeStatusColors: TextColor[] = [];
employeeStatusColors[EmployeeStatus.active] = 'green';
employeeStatusColors[EmployeeStatus.vacation] = 'yellow';
employeeStatusColors[EmployeeStatus.fired] = 'red';

export const employeeStatusOptions: OptionType[] = [
  {
    text: employeeStatusStrings[EmployeeStatus.active],
    value: EmployeeStatus.active + '',
  },
  {
    text: employeeStatusStrings[EmployeeStatus.vacation],
    value: EmployeeStatus.vacation + '',
  },
  {
    text: employeeStatusStrings[EmployeeStatus.fired],
    value: EmployeeStatus.fired + '',
  },
];
