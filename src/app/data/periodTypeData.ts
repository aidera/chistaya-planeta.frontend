import { OptionType } from '../models/types/OptionType';
import PeriodType from '../models/enums/PeriodType';

export const periodTypeStrings: string[] = [];
periodTypeStrings[PeriodType.month] = 'мес.';
periodTypeStrings[PeriodType.week] = 'нед.';
periodTypeStrings[PeriodType.day] = 'д.';

export const periodTypeOptions: OptionType[] = [
  { text: 'мес.', value: PeriodType.month + '' },
  { text: 'нед.', value: PeriodType.week + '' },
  { text: 'д.', value: PeriodType.day + '' },
];
