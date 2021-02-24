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
paymentMethodStrings[PaymentMethod.cash] = 'Наличными';
paymentMethodStrings[PaymentMethod.nonCash] = 'Безналичными';
paymentMethodStrings[PaymentMethod.card] = 'На карту';

export { paymentMethodStrings };
