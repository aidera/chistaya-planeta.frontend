import { OptionType } from '../models/types/OptionType';
import OrderType from '../models/enums/OrderType';

export const orderTypeStrings: string[] = [];
orderTypeStrings[OrderType.offer] = 'Продажа вторсырья';
orderTypeStrings[OrderType.service] = 'Вывоз мусора';

export const orderTypeOptions: OptionType[] = [
  { text: 'Продать вторсырьё', value: OrderType.offer + '' },
  { text: 'Вывести мусор (ТКО)', value: OrderType.service + '' },
];
