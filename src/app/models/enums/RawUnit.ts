/*
 * Единица количества сырья:
 * -- кг
 * -- куб
 */

enum RawUnit {
  kg,
  cube,
}

export default RawUnit;

const rawUnitStrings: string[] = [];
rawUnitStrings[RawUnit.kg] = 'кг';
rawUnitStrings[RawUnit.cube] = 'куб';

export { rawUnitStrings };
