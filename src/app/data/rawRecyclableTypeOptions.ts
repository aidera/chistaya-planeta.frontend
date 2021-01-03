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
    text: 'Пэт бутылка до 5 л включительно',
    value: RawType.petBottleUpTo5l + '',
  },
];

export default rawRecyclableTypeOptions;
