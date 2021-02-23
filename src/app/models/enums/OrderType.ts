/*
 * Тип заказа:
 * -- Продажа вторсырья
 * -- Вывоз мусора
 */

enum OrderType {
  offer,
  service,
}

export default OrderType;

const orderTypeStrings: string[] = [];
orderTypeStrings[OrderType.offer] = 'продажа вторсырья';
orderTypeStrings[OrderType.service] = 'вывоз мусора';

export { orderTypeStrings };
