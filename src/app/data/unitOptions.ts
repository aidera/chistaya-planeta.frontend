import { OptionType } from '../models/types/OptionType';
import RawUnit from '../models/enums/RawUnit';
import Unit from '../models/enums/Unit';

const unitOptions: OptionType[] = [
  { text: 'шт', value: Unit.pc + '' },
  { text: 'кг', value: Unit.kg + '' },
  { text: 'куб', value: Unit.cube + '' },
  { text: 'мешок 120л', value: Unit.bag120 + '' },
  { text: 'мешок 160л', value: Unit.bag160 + '' },
];

export default unitOptions;
