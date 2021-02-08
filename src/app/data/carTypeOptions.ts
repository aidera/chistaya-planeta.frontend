import { OptionType } from '../models/types/OptionType';
import CarType from '../models/enums/CarType';

const carTypeOptions: OptionType[] = [
  { text: 'Легковой', value: CarType.small + '' },
  { text: 'Фургон', value: CarType.van + '' },
  { text: 'Самосвал', value: CarType.tipper + '' },
];

export default carTypeOptions;
