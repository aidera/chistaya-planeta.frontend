import { OptionType } from '../models/types/OptionType';
import RawUnit from '../models/enums/RawUnit';

const rawUnitOptions: OptionType[] = [
  { text: 'кг', value: RawUnit.kg + '' },
  { text: 'куб', value: RawUnit.cube + '' },
];

export default rawUnitOptions;
