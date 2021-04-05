import { OptionType } from '../models/types/OptionType';
import { DeliveryType } from '../models/enums/DeliveryType';

export const deliveryTypeStrings: string[] = [];
deliveryTypeStrings[DeliveryType.without] = '-';
deliveryTypeStrings[DeliveryType.company] = 'Компанией "Чистая Планета"';
deliveryTypeStrings[DeliveryType.pickup] = 'Самовывоз';

export const deliveryTypeOptions: OptionType[] = [
  {
    text: deliveryTypeStrings[DeliveryType.company],
    value: DeliveryType.company + '',
  },
  {
    text: deliveryTypeStrings[DeliveryType.pickup],
    value: DeliveryType.pickup + '',
  },
];
