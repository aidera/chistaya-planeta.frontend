import { OptionType } from '../models/types/OptionType';
import CarStatus from '../models/enums/CarStatus';

const carStatusOptions: OptionType[] = [
  { text: 'Активный', value: CarStatus.active + '' },
  { text: 'Временно не активный', value: CarStatus.temporaryUnavailable + '' },
  { text: 'Не активный', value: CarStatus.unavailable + '' },
];

export default carStatusOptions;
