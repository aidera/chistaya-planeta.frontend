/*
 * Статус заказа:
 * -- необработанно
 * -- отменен клиентом (отказ)
 * -- отменен компанией (отменен)
 * -- обработанно
 * -- в пути
 * -- погружено
 * -- доставлено на базу
 * -- взвешено
 * -- завершено
 */

enum OrderStatus {
  raw,
  refused,
  cancelled,
  processed,
  inTransit,
  packed,
  delivered,
  weighed,
  completed,
}

export default OrderStatus;

const orderStatusStrings: string[] = [];
orderStatusStrings[OrderStatus.raw] = 'Необработано';
orderStatusStrings[OrderStatus.refused] = 'Отказ';
orderStatusStrings[OrderStatus.cancelled] = 'Отменено';
orderStatusStrings[OrderStatus.processed] = 'Обработано';
orderStatusStrings[OrderStatus.inTransit] = 'В пути';
orderStatusStrings[OrderStatus.packed] = 'Погружено';
orderStatusStrings[OrderStatus.delivered] = 'Доставлено';
orderStatusStrings[OrderStatus.weighed] = 'Взвешено';
orderStatusStrings[OrderStatus.completed] = 'Завершено';

const orderStatusColors: ('yellow' | 'blue' | 'red' | 'green')[] = [];
orderStatusColors[OrderStatus.raw] = 'yellow';
orderStatusColors[OrderStatus.refused] = 'red';
orderStatusColors[OrderStatus.cancelled] = 'red';
orderStatusColors[OrderStatus.processed] = 'yellow';
orderStatusColors[OrderStatus.inTransit] = 'blue';
orderStatusColors[OrderStatus.packed] = 'blue';
orderStatusColors[OrderStatus.delivered] = 'blue';
orderStatusColors[OrderStatus.weighed] = 'blue';
orderStatusColors[OrderStatus.completed] = 'green';

export { orderStatusStrings, orderStatusColors };
