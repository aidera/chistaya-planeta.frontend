import { OptionType } from '../models/types/OptionType';
import RawType from '../models/enums/RawType';

const rawRecyclableTypeOptions: OptionType[] = [
  { text: 'Картон', value: RawType.cardboard + '' },
  { text: 'Белая бумага', value: RawType.whitePaper + '' },
  {
    text: 'Пленка стрейтч / ПВД',
    value: RawType.stretchAndHighPressurePolyethyleneFilm + '',
  },
  {
    text: 'ПЭТ бутылка до 5л',
    value: RawType.petBottleUpTo5l + '',
  },
];

export default rawRecyclableTypeOptions;
