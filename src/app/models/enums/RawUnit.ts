/*
 * Единица количества сырья/мусора:
 * -- кг
 * -- куб
 * -- мешок 120 л
 * -- мешок 160л
 */

enum RawUnit {
  kg,
  cube,
  bag120,
  bag160,
}

export default RawUnit;

const rawUnitStrings: string[] = [];
rawUnitStrings[RawUnit.kg] = 'кг';
rawUnitStrings[RawUnit.cube] = 'куб';
rawUnitStrings[RawUnit.bag120] = 'мешок 120л';
rawUnitStrings[RawUnit.bag160] = 'мешок 160л';

export { rawUnitStrings };
