import { OptionType } from '../models/types/OptionType';
import { TextColor } from '../models/types/TextColor';
import { SimpleStatus } from '../models/enums/SimpleStatus';

export const simpleStatusStrings: string[] = [];
simpleStatusStrings[SimpleStatus.active] = 'Активно';
simpleStatusStrings[SimpleStatus.inactive] = 'Не активно';

export const simpleStatusColors: TextColor[] = [];
simpleStatusColors[SimpleStatus.active] = 'green';
simpleStatusColors[SimpleStatus.inactive] = 'red';

export const simpleStatusOptions: OptionType[] = [
  {
    text: simpleStatusStrings[SimpleStatus.active],
    value: SimpleStatus.active + '',
  },
  {
    text: simpleStatusStrings[SimpleStatus.inactive],
    value: SimpleStatus.inactive + '',
  },
];
