import { OptionType } from '../models/types/OptionType';
import DeliveryType from '../models/enums/DeliveryType';

const deliveryTypeOptions: OptionType[] = [
  { text: 'Компанией "Чистая Планета"', value: DeliveryType.company + '' },
  { text: 'Самовывоз', value: DeliveryType.pickup + '' },
];

export default deliveryTypeOptions;
