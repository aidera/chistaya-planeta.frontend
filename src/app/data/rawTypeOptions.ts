import { OptionType } from '../models/types/OptionType';
import RawType from '../models/enums/RawType';

const rawTypeOptions: OptionType[] = [
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
  {
    text: 'Мусор мешочный / ТКО',
    value: RawType.bagGarbageAndSolidHouseholdWaste + '',
  },
];

export default rawTypeOptions;
