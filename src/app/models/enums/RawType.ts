/*
 * Тип сырья:
 * -- картон
 * -- белая бумага
 * -- пленка стрейтч/пвд (пленка из полиэтилена высокого давления)
 * -- пэт бутылка до 5 л включительно
 * -- мусор мешочный/тко (твёрдые бытовые отходы, обычный мусор)
 */

enum RawType {
  cardboard,
  whitePaper,
  stretchAndHighPressurePolyethyleneFilm,
  petBottleUpTo5l,
  garbage,
}

export default RawType;
