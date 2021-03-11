import { OptionType } from '../models/types/OptionType';
import { TextColor } from '../models/types/TextColor';
import OrderStatus from '../models/enums/OrderStatus';

export const orderStatusStrings: string[] = [];
orderStatusStrings[OrderStatus.raw] = 'Необработано';
orderStatusStrings[OrderStatus.refused] = 'Отменено клиентом';
orderStatusStrings[OrderStatus.cancelled] = 'Отменено сотрудником';
orderStatusStrings[OrderStatus.processed] = 'Обработано';
orderStatusStrings[OrderStatus.inTransit] = 'В пути';
orderStatusStrings[OrderStatus.packed] = 'Погружено';
orderStatusStrings[OrderStatus.delivered] = 'Доставлено';
orderStatusStrings[OrderStatus.weighed] = 'Взвешено';
orderStatusStrings[OrderStatus.completed] = 'Завершено';

export const orderStatusColors: TextColor[] = [];
orderStatusColors[OrderStatus.raw] = 'yellow';
orderStatusColors[OrderStatus.refused] = 'red';
orderStatusColors[OrderStatus.cancelled] = 'red';
orderStatusColors[OrderStatus.processed] = 'blue';
orderStatusColors[OrderStatus.inTransit] = 'blue';
orderStatusColors[OrderStatus.packed] = 'blue';
orderStatusColors[OrderStatus.delivered] = 'blue';
orderStatusColors[OrderStatus.weighed] = 'blue';
orderStatusColors[OrderStatus.completed] = 'green';

export const orderStatusOptions: OptionType[] = [
  { text: orderStatusStrings[OrderStatus.raw], value: OrderStatus.raw + '' },
  {
    text: orderStatusStrings[OrderStatus.refused],
    value: OrderStatus.refused + '',
  },
  {
    text: orderStatusStrings[OrderStatus.cancelled],
    value: OrderStatus.cancelled + '',
  },
  {
    text: orderStatusStrings[OrderStatus.processed],
    value: OrderStatus.processed + '',
  },
  {
    text: orderStatusStrings[OrderStatus.inTransit],
    value: OrderStatus.inTransit + '',
  },
  {
    text: orderStatusStrings[OrderStatus.delivered],
    value: OrderStatus.delivered + '',
  },
  {
    text: orderStatusStrings[OrderStatus.weighed],
    value: OrderStatus.weighed + '',
  },
  {
    text: orderStatusStrings[OrderStatus.completed],
    value: OrderStatus.completed + '',
  },
];
