import { OptionType } from '../models/types/OptionType';
import EmployeeStatus from '../models/enums/EmployeeStatus';

const employeeStatusOptions: OptionType[] = [
  { text: 'Активный', value: EmployeeStatus.active + '' },
  { text: 'В отпуске', value: EmployeeStatus.vacation + '' },
  { text: 'Уволен', value: EmployeeStatus.fired + '' },
];

export default employeeStatusOptions;
