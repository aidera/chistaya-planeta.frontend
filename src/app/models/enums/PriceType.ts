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
priceTypeStrings[PriceType.single] = 'Единая стоимость';
priceTypeStrings[PriceType.unit] = 'За единицу';

export { priceTypeStrings };
