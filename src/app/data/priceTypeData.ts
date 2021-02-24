import PriceType from '../models/enums/PriceType';

export const priceTypeStrings: string[] = [];
priceTypeStrings[PriceType.single] = 'Единая стоимость';
priceTypeStrings[PriceType.unit] = 'За единицу';
