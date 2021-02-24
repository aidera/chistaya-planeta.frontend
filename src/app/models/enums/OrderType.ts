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
orderTypeStrings[OrderType.offer] = 'Продажа вторсырья';
orderTypeStrings[OrderType.service] = 'Вывоз мусора';

export { orderTypeStrings };
