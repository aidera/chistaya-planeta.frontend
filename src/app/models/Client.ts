import ClientStatus from './enums/ClientStatus';
import { IOrder } from './Order';

interface IClient {
  _id: string;
  status: ClientStatus;
  phone: string;
  email: string;
  name: string;
  orders: string[] | IOrder[];
  scheduledOrders: string[] | IOrder[];
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IClient;
