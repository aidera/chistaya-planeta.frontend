import { OptionType } from '../models/types/OptionType';
import RawType from '../models/enums/RawType';

const rawRecyclableTypeOptions: OptionType[] = [
  {
    text: 'Мусор мешочный / ТКО',
    value: RawType.garbage + '',
  },
];

export default rawRecyclableTypeOptions;
