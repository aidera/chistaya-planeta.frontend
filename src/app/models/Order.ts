import DeliveryType from './enums/DeliveryType';
import PaymentMethod from './enums/PaymentMethod';
import OrderStatus from './enums/OrderStatus';
import OrderType from './enums/OrderType';
import Unit from './enums/Unit';
import { IDivision } from './Division';
import { IOffer } from './Offer';
import { IService } from './Service';
import { ILocality } from './Locality';
import { IEmployee } from './Employee';
import { ICar } from './Car';

export interface IOrder {
  _id: string;
  status: OrderStatus;
  type: OrderType;
  deadline: Date;

  scheduledOrder?: string;
  client?: string;

  locality?: ILocality | string;
  division?: IDivision | string;

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

  performers: {
    clientManager?: string | IEmployee;
    clientManagerAccepted?: boolean;
    receivingManager?: string | IEmployee;
    receivingManagerAccepted?: boolean;
    driver?: string | IEmployee;
    driverAccepted?: boolean;
    car?: string | ICar;
  };

  weighed?: {
    offers: {
      item: IOffer | string;
      amountUnit: Unit;
      amount: number;
      paymentAmount: number;
    }[];
    services: {
      item: IService | string;
      amountUnit: Unit;
      amount: number;
      paymentAmount: number;
    }[];
    paymentAmount: number;
  };

  customerComment?: string;
  companyComment?: string;
  customerCancellationReason?: string;
  companyCancellationReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
  statusDateAccepted?: Date;
  statusDateDelivered?: Date;
  statusDateWeighed?: Date;
  statusDateCompleted?: Date;
}
