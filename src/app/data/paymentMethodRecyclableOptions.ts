import { OptionType } from '../models/types/OptionType';
import PaymentMethod from '../models/enums/PaymentMethod';

const paymentMethodRecyclableOptions: OptionType[] = [
  { text: 'Наличными', value: PaymentMethod.cash + '' },
  { text: 'Безналичными', value: PaymentMethod.nonCash + '' },
  { text: 'На карту', value: PaymentMethod.card + '' },
];

export default paymentMethodRecyclableOptions;
