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
