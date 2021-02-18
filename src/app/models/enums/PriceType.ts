/*
 * Тип цены:
 * -- единая стоимость
 * -- за единицу
 */

enum PriceType {
  single,
  unit,
}

export default PriceType;

const priceTypeStrings: string[] = [];
priceTypeStrings[PriceType.single] = 'единая стоимость';
priceTypeStrings[PriceType.unit] = 'за единицу';

export { priceTypeStrings };
