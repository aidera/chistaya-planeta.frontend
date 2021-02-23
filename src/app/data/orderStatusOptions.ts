import { OptionType } from '../models/types/OptionType';
import OrderStatus from '../models/enums/OrderStatus';

const orderStatusOptions: OptionType[] = [
  { text: 'Не обработано', value: OrderStatus.raw + '' },
  { text: 'Отказ', value: OrderStatus.refused + '' },
  { text: 'Отменено', value: OrderStatus.cancelled + '' },
  { text: 'Обработано', value: OrderStatus.processed + '' },
  { text: 'В пути', value: OrderStatus.inTransit + '' },
  { text: 'Доставлено', value: OrderStatus.delivered + '' },
  { text: 'Взвешено', value: OrderStatus.weighed + '' },
  { text: 'Завершено', value: OrderStatus.completed + '' },
];

export default orderStatusOptions;
