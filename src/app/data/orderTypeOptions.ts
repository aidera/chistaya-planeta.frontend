import { OptionType } from '../models/types/OptionType';
import OrderType from '../models/enums/OrderType';

const orderTypeOptions: OptionType[] = [
  { text: 'Продать вторсырьё', value: OrderType.recyclable + '' },
  { text: 'Вывести мусор (ТКО)', value: OrderType.garbage + '' },
];

export default orderTypeOptions;
