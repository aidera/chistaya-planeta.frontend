/*
 * Тип сырья:
 * -- картон
 * -- белая бумага
 * -- пленка стрейтч/пвд (пленка из полиэтилена высокого давления)
 * -- пэт бутылка до 5 л включительно
 * -- мусор мешочный/тко (твёрдые бытовые отходы)
 */

enum RawType {
  cardboard,
  whitePaper,
  stretchAndHighPressurePolyethyleneFilm,
  petBottleUpTo5l,
  bagGarbageAndSolidHouseholdWaste,
}

export default RawType;
