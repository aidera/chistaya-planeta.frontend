import ClientStatus from './enums/ClientStatus';

export interface IClient {
  _id: string;
  status: ClientStatus;
  phone: string;
  email: string;
  name: string;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
