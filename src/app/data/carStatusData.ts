import { OptionType } from '../models/types/OptionType';
import { TextColor } from '../models/types/TextColor';
import CarStatus from '../models/enums/CarStatus';

export const carStatusStrings: string[] = [];
carStatusStrings[CarStatus.active] = 'Активно';
carStatusStrings[CarStatus.temporaryUnavailable] = 'Временно не активно';
carStatusStrings[CarStatus.unavailable] = 'Не активно';

export const carStatusColors: TextColor[] = [];
carStatusColors[CarStatus.active] = 'green';
carStatusColors[CarStatus.temporaryUnavailable] = 'yellow';
carStatusColors[CarStatus.unavailable] = 'red';

export const carStatusOptions: OptionType[] = [
  { text: carStatusStrings[CarStatus.active], value: CarStatus.active + '' },
  {
    text: carStatusStrings[CarStatus.temporaryUnavailable],
    value: CarStatus.temporaryUnavailable + '',
  },
  {
    text: carStatusStrings[CarStatus.unavailable],
    value: CarStatus.unavailable + '',
  },
];
