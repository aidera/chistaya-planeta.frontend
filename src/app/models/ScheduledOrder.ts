import { DeliveryType } from './enums/DeliveryType';
import { PeriodType } from './enums/PeriodType';
import { OrderType } from './enums/OrderType';
import { PaymentMethod } from './enums/PaymentMethod';
import { SimpleStatus } from './enums/SimpleStatus';
import { Unit } from './enums/Unit';
import { IClient } from './Client';
import { ILocality } from './Locality';
import { IOffer } from './Offer';
import { IService } from './Service';

export interface IScheduledOrder extends Document {
  /* Refers to schedule */
  _id: string;
  status: SimpleStatus;
  periodType: PeriodType;
  periodAmount: number;
  startDate: string;
  nextUpdate?: Date;
  createdAt: string;
  updatedAt: string;

  /* Refers to order settings */
  type: OrderType;
  client?: IClient | string;
  locality?: ILocality | string;

  offers?: {
    items: (IOffer | string)[];
    amountUnit: Unit;
    amount: number;
  };

  services?: {
    items: (IService | string)[];
    amountUnit: Unit;
    amount: number;
  };

  customer: {
    organizationLegalName?: string;
    organizationActualName?: string;
    contactName: string;
    contactPhone: string;
  };

  delivery: {
    _type: DeliveryType;
    customerCarNumber?: string;
    hasAssistant?: boolean;
    addressFrom?: {
      street: string;
      house: string;
    };
  };

  payment: {
    method?: PaymentMethod;
    methodData?: string;
  };

  customerComment?: string;
  companyComment?: string;
}
