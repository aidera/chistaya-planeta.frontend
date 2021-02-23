import { OptionType } from '../models/types/OptionType';
import OrderType from '../models/enums/OrderType';

const orderTypeOptions: OptionType[] = [
  { text: 'Продать вторсырьё', value: OrderType.offer + '' },
  { text: 'Вывести мусор (ТКО)', value: OrderType.service + '' },
];

export default orderTypeOptions;
