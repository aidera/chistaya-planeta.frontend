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
import { IClient } from './Client';

export interface IOrder {
  _id: string;
  status: OrderStatus;
  type: OrderType;
  deadline: string;

  scheduledOrder?: string;
  client?: IClient | string;

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
    }[];
    services: {
      item: IService | string;
      amountUnit: Unit;
      amount: number;
    }[];
    paymentAmount: number;
  };

  customerComment?: string;
  companyComment?: string;
  customerCancellationReason?: string;
  companyCancellationReason?: string;

  createdAt?: string;
  updatedAt?: string;
  statusDateAccepted?: string;
  statusDateDelivered?: string;
  statusDateWeighed?: string;
  statusDateCompleted?: string;
  statusDateRefused?: string;
}

export interface IOrderLessInfo {
  _id: string;
  status: OrderStatus;
  type: OrderType;
  deadline: string;

  locality?: ILocality | string;
  division?: IDivision | string;

  customer: {
    organizationLegalName?: string;
    organizationActualName?: string;
    contactName: string;
    contactPhone: string;
  };

  performers: {
    clientManager?: string;
    clientManagerAccepted?: boolean;
    receivingManager?: string;
    receivingManagerAccepted?: boolean;
    driver?: string;
    driverAccepted?: boolean;
    car?: string;
  };
}
