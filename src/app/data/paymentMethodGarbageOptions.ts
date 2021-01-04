import { OptionType } from '../models/types/OptionType';
import PaymentMethod from '../models/enums/PaymentMethod';

const paymentMethodGarbageOptions: OptionType[] = [
  { text: 'Наличными', value: PaymentMethod.cash + '' },
  { text: 'Безналичными', value: PaymentMethod.nonCash + '' },
];

export default paymentMethodGarbageOptions;
