import { OptionType } from '../models/types/OptionType';
import EmployeeStatus from '../models/enums/EmployeeStatus';

const employeeStatusOptions: OptionType[] = [
  { text: 'Активно', value: EmployeeStatus.active + '' },
  { text: 'В отпуске', value: EmployeeStatus.vacation + '' },
  { text: 'Не активно', value: EmployeeStatus.fired + '' },
];

export default employeeStatusOptions;
