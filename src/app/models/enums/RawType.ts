/*
 * Тип сырья:
 * -- (не вторсырье) мусор мешочный/тко (твёрдые бытовые отходы, обычный мусор)
 * -- картон
 * -- белая бумага
 * -- пленка стрейтч/пвд (пленка из полиэтилена высокого давления)
 * -- пэт бутылка до 5 л включительно
 */

enum RawType {
  garbage,
  cardboard,
  whitePaper,
  stretchAndHighPressurePolyethyleneFilm,
  petBottleUpTo5l,
}

export default RawType;

const rawTypeStrings: string[] = [];
rawTypeStrings[RawType.garbage] = 'смешанные отходы / мусор';
rawTypeStrings[RawType.cardboard] = 'картон';
rawTypeStrings[RawType.whitePaper] = 'белая бумага';
rawTypeStrings[RawType.stretchAndHighPressurePolyethyleneFilm] =
  'пленка стрейтч/ПВД';
rawTypeStrings[RawType.petBottleUpTo5l] = 'ПЭТ бутылки';

export { rawTypeStrings };
