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
deliveryTypeStrings[DeliveryType.company] = 'компанией';
deliveryTypeStrings[DeliveryType.pickup] = 'самовывоз';

export { deliveryTypeStrings };
