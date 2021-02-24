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
