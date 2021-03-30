import DeliveryType from './enums/DeliveryType';
import ScheduledOrderStatus from './enums/ScheduledOrderStatus';
import PeriodType from './enums/PeriodType';
import OrderType from './enums/OrderType';
import { IClient } from './Client';
import { ILocality } from './Locality';
import { IOffer } from './Offer';
import Unit from './enums/Unit';
import { IService } from './Service';
import PaymentMethod from './enums/PaymentMethod';

export interface IScheduledOrder extends Document {
  /* Refers to schedule */
  _id: string;
  status: ScheduledOrderStatus;
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
}
