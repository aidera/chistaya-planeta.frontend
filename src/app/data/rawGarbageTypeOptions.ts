import { OptionType } from '../models/types/OptionType';
import RawType from '../models/enums/RawType';

const rawRecyclableTypeOptions: OptionType[] = [
  {
    text: 'Мусор мешочный / ТКО',
    value: RawType.bagGarbageAndSolidHouseholdWaste + '',
  },
];

export default rawRecyclableTypeOptions;
