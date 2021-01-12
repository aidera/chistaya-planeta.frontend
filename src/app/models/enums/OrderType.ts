/*
 * Тип заказа:
 * -- Продажа вторсырья
 * -- Вывоз мусора
 */

enum OrderType {
  recyclable,
  garbage,
}

export default OrderType;

const orderTypeStrings: string[] = [];
orderTypeStrings[OrderType.recyclable] = 'продажа вторсырья';
orderTypeStrings[OrderType.garbage] = 'вывоз муcора';

export { orderTypeStrings };
