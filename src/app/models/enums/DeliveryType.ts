/*
 * Тип доставки:
 * -- компанией
 * -- самовывоз
 */

enum DeliveryType {
  company,
  pickup,
}

export default DeliveryType;

const deliveryTypeStrings: string[] = [];
deliveryTypeStrings[DeliveryType.company] = 'компанией';
deliveryTypeStrings[DeliveryType.pickup] = 'самовывоз';

export { deliveryTypeStrings };
