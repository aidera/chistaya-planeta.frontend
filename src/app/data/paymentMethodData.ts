import PaymentMethod from '../models/enums/PaymentMethod';
import { OptionType } from '../models/types/OptionType';

export const paymentMethodStrings: string[] = [];
paymentMethodStrings[PaymentMethod.cash] = 'Наличными';
paymentMethodStrings[PaymentMethod.nonCash] = 'Безналичными';
paymentMethodStrings[PaymentMethod.card] = 'На карту';

export const paymentMethodOffersOptions: OptionType[] = [
  {
    text: paymentMethodStrings[PaymentMethod.cash],
    value: PaymentMethod.cash + '',
  },
  {
    text: paymentMethodStrings[PaymentMethod.nonCash],
    value: PaymentMethod.nonCash + '',
  },
  {
    text: paymentMethodStrings[PaymentMethod.card],
    value: PaymentMethod.card + '',
  },
];

export const paymentMethodServicesOptions: OptionType[] = [
  {
    text: paymentMethodStrings[PaymentMethod.cash],
    value: PaymentMethod.cash + '',
  },
  {
    text: paymentMethodStrings[PaymentMethod.nonCash],
    value: PaymentMethod.nonCash + '',
  },
];
