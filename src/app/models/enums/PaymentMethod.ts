/*
 * Способ оплаты:
 * -- наличными
 * -- безналичными
 * -- картой
 */

enum PaymentMethod {
  cash,
  nonCash,
  card,
}

export default PaymentMethod;

const paymentMethodStrings: string[] = [];
paymentMethodStrings[PaymentMethod.cash] = 'наличными';
paymentMethodStrings[PaymentMethod.nonCash] = 'безналичными';
paymentMethodStrings[PaymentMethod.card] = 'на карту';

export { paymentMethodStrings };
