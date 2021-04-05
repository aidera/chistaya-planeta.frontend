import { OptionType } from '../models/types/OptionType';
import { Unit } from '../models/enums/Unit';

export const unitStrings: string[] = [];
unitStrings[Unit.pc] = 'шт';
unitStrings[Unit.kg] = 'кг';
unitStrings[Unit.cube] = 'куб';
unitStrings[Unit.bag120] = 'мешок 120л';
unitStrings[Unit.bag160] = 'мешок 160л';

export const unitOptions: OptionType[] = [
  { text: unitStrings[Unit.kg], value: Unit.kg + '' },
  { text: unitStrings[Unit.cube], value: Unit.cube + '' },
  { text: unitStrings[Unit.bag120], value: Unit.bag120 + '' },
  { text: unitStrings[Unit.bag160], value: Unit.bag160 + '' },
];

export const unitOffersOptions: OptionType[] = [
  { text: unitStrings[Unit.kg], value: Unit.kg + '' },
  { text: unitStrings[Unit.cube], value: Unit.cube + '' },
];

export const unitServicesOptions: OptionType[] = [
  { text: unitStrings[Unit.kg], value: Unit.kg + '' },
  { text: unitStrings[Unit.cube], value: Unit.cube + '' },
  { text: unitStrings[Unit.bag120], value: Unit.bag120 + '' },
  { text: unitStrings[Unit.bag160], value: Unit.bag160 + '' },
];
