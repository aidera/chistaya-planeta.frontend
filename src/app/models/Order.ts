import DeliveryType from './enums/DeliveryType';
import RawUnit from './enums/RawUnit';
import PaymentMethod from './enums/PaymentMethod';
import OrderStatus from './enums/OrderStatus';
import OrderType from './enums/OrderType';
import { IDivision } from './Division';
import { IOffer } from './Offer';
import { IService } from './Service';
import { ILocality } from './Locality';

export interface IOrder {
  _id: string;
  status: OrderStatus;
  type: OrderType;
  scheduledOrder?: string;
  locality?: ILocality | string;
  division?: IDivision | string;
  desiredPickupDate: Date; // Желаемая дата, чтобы приехал водитель и забрал (если доставка компанией) или дата приезда (если самовывоз)
  comment: string; // комментарий от заказчика (комментарий компании в процессинге)
  customer: {
    // Информация о заказчике
    client?: string; // Является ли заказчик зарегистрированным клиентом
    organizationLegalName?: string;
    organizationActualName?: string;
    contactName: string;
    contactPhone: string;
  };
  delivery: {
    _type: DeliveryType;
    customerCarNumber?: string; // если выбран самовывоз, то необходимо указать номер автомобиля заказчика.
    hasAssistant?: boolean; // если доставка компанией, то нужно спросить, будет ли помошник для загрузки авто
    addressFrom?: {
      street: string;
      house: string;
    }; // если доставка компанией, то нужно узнать адрес точки, с который забирать сырье
  };
  approximateRaw: {
    // предположительное сырье. Может отличатся от реального взвешивания. Все равно вписывается для удобства менеджеру в определении авто
    offers: (IOffer | string)[];
    services: (IService | string)[];
    amountUnit: RawUnit;
    amount: number;
  };
  payment: {
    // Вознаграждение (тут указывается спомоб вознаграждения и карта/счет если не нал. Все остальное в процессинге)
    method?: PaymentMethod;
    methodData?: string;
  };
  processing?: {
    clientManagerAssign?: string;
    clientManagerAccepted?: boolean; // принял ли менеджер заявку
    receivingManagerAssign?: string;
    receivingManagerAccepted?: boolean;
    driverAssign?: string;
    driverAccepted?: boolean; // принял ли водитель заявку
    carAssign?: string;
    statusDateAccepted?: Date;
    statusDateInTransit?: Date;
    statusDatePacked?: Date;
    statusDateDelivered?: Date;
    statusDateWeighed?: Date;
    statusDateCompleted?: Date;
    clientCancellationReason?: string; // если клиент отказался от заявки, тут будет его письменная причина (если он укажет конечно)
    companyCancellationReason?: string; // если компания отказалась от заявки, тут будет письменная причина (если укажут конечно)
    comment?: string; // комментарий компании о клиенте (клиент не должен это видеть)
    weighedRaw?: {
      // взвешивание привезеного сырья
      offers: (IOffer | string)[];
      services: (IService | string)[];
      amount: number;
      amountUnit: RawUnit;
      paymentAmount: number;
    }[];
    rawAmount?: number; // итоговый вес взвешенного сырья
    paymentAmount?: number; // итоговая стоимость вознаграждения
  };
  createdAt?: Date;
  updatedAt?: Date;
}
