/*
 * Единица количества сырья/мусора:
 * -- кг
 * -- куб
 * -- мешок 120 л
 * -- мешок 160л
 */

enum Unit {
  pc,
  kg,
  cube,
  bag120,
  bag160,
}

export default Unit;

const unitStrings: string[] = [];
unitStrings[Unit.pc] = 'шт';
unitStrings[Unit.kg] = 'кг';
unitStrings[Unit.cube] = 'куб';
unitStrings[Unit.bag120] = 'мешок 120л';
unitStrings[Unit.bag160] = 'мешок 160л';

export { unitStrings };
