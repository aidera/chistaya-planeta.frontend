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
orderStatusStrings[OrderStatus.raw] = 'необработано';
orderStatusStrings[OrderStatus.refused] = 'отказ';
orderStatusStrings[OrderStatus.cancelled] = 'отменено';
orderStatusStrings[OrderStatus.processed] = 'обработано';
orderStatusStrings[OrderStatus.inTransit] = 'в пути';
orderStatusStrings[OrderStatus.packed] = 'погружено';
orderStatusStrings[OrderStatus.delivered] = 'доставлено';
orderStatusStrings[OrderStatus.weighed] = 'взвешено';
orderStatusStrings[OrderStatus.completed] = 'завершено';

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
