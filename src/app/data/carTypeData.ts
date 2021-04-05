import { OptionType } from '../models/types/OptionType';
import { CarType } from '../models/enums/CarType';

export const carTypeStrings: string[] = [];
carTypeStrings[CarType.small] = 'Легковой';
carTypeStrings[CarType.van] = 'Фургон';
carTypeStrings[CarType.tipper] = 'Самосвал';

export const carTypeOptions: OptionType[] = [
  { text: carTypeStrings[CarType.small], value: CarType.small + '' },
  { text: carTypeStrings[CarType.van], value: CarType.van + '' },
  { text: carTypeStrings[CarType.tipper], value: CarType.tipper + '' },
];
