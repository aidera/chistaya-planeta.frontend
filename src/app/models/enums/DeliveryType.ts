/*
 * Тип доставки:
 * -- компанией
 * -- самовывоз
 */

enum DeliveryType {
  without,
  company,
  pickup,
}

export default DeliveryType;

const deliveryTypeStrings: string[] = [];
deliveryTypeStrings[DeliveryType.without] = '-';
deliveryTypeStrings[DeliveryType.company] = 'Компанией';
deliveryTypeStrings[DeliveryType.pickup] = 'Самовывоз';

export { deliveryTypeStrings };
