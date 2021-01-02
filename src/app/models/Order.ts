import DeliveryType from './enums/DeliveryType';
import RawType from './enums/RawType';
import RawUnit from './enums/RawUnit';
import PaymentMethod from './enums/PaymentMethod';
import Address from './types/Address';
import OrderStatus from './enums/OrderStatus';

interface Order {
  _id: string;
  scheduledOrderId: string | null;
  delivery: {
    type: DeliveryType;
    customerCarNumber?: string; // если выбран самовывоз, то необходимо указать номер автомобиля заказчика.
    hasAssistant?: boolean; // если доставка компанией, то нужно спросить, будет ли помошник для загрузки авто
    addressFrom?: Address; // если доставка компанией, то нужно узнать адрес точки, с который забирать сырье
  };
  // Предположительное сырье. Может отличатся от реального взвешивания.
  // Все равно вписывается для удобства менеджеру в определении авто
  approximateRaw: {
    type: RawType[];
    amountUnit: RawUnit;
    amount: number;
  };
  customer: {
    // Информация о заказчике
    client?: string; // Является ли заказчик зарегистрированным клиентом
    organizationLegalName: string;
    organizationActualName: string;
    contactName: string;
    contactPhone: string;
  };
  remuneration: {
    // Вознаграждение (тут указывается спомоб вознаграждения и карта/счет если не нал. Все остальное в процессинге)
    paymentMethod: PaymentMethod;
    paymentMethodData?: string;
  };
  desiredPickupDate: Date; // Желаемая дата, чтобы приехал водитель и забрал (если доставка компанией) или дата приезда (если самовывоз)
  comment: string; // комментарий от заказчика (комментарий компании в процессинге)
  processing?: {
    status: OrderStatus;
    division?: string; // подразделение, которое занимается заявкой
    managerAssign?: string;
    managerAccepted: boolean; // принял ли менеджер заявку
    driverAssign?: string;
    driverAccepted: boolean; // принял ли водитель заявку
    weigherAssign?: string;
    weigherAccepted: boolean; // принял ли весовщик заявку
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
      type: RawType;
      amount: number;
      unit: RawUnit;
      remunerationAmount: number;
    }[];
    remunerationAmount?: number; // итоговая стоимость вознаграждения
  };
  createdAt: Date;
  updatedAt: Date;
}

export default Order;
