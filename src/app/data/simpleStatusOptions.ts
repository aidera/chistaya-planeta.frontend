import { OptionType } from '../models/types/OptionType';
import { SimpleStatus } from '../models/enums/SimpleStatus';

const simpleStatusOptions: OptionType[] = [
  { text: 'Активно', value: SimpleStatus.active + '' },
  { text: 'Не активно', value: SimpleStatus.inactive + '' },
];

export default simpleStatusOptions;
