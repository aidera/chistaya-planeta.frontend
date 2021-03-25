import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import OrderType from '../../models/enums/OrderType';
import DeliveryType from '../../models/enums/DeliveryType';
import PaymentMethod from '../../models/enums/PaymentMethod';
import { environment } from '../../../environments/environment';
import { IOrder, IOrderLessInfo } from '../../models/Order';
import ServerResponse from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import OrderStatus from '../../models/enums/OrderStatus';
import Unit from '../../models/enums/Unit';
import { IOfferToWeigh } from '../../models/Offer';
import { IServiceToWeigh } from '../../models/Service';

export interface IGetOneOrderResponse extends ServerResponse {
  order?: IOrder;
}

export interface IUpdateOrderResponse extends ServerResponse {
  updatedOrder?: IOrder;
}

export interface IRemoveOrderResponse extends ServerResponse {
  removedOrder?: IOrder;
}

export interface IGetOrdersResponse extends ServerResponse {
  orders?: IOrder[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

export interface IGetAllOrdersLessInfoResponse extends ServerResponse {
  orders?: IOrderLessInfo[];
}

export interface IAddOrderRequest {
  type: OrderType;
  deadline: Date;

  locality: string;
  client?: string;

  offersItems?: string[];
  offersAmountUnit?: Unit;
  offersAmount?: number;

  servicesItems?: string[];
  servicesAmountUnit?: Unit;
  servicesAmount?: number;

  customerOrganizationLegalName?: string;
  customerOrganizationActualName?: string;
  customerContactName: string;
  customerContactPhone: string;

  deliveryType?: DeliveryType;
  deliveryCustomerCarNumber?: string;
  deliveryHasAssistant?: boolean;
  deliveryAddressFromStreet?: string;
  deliveryAddressFromHouse?: string;

  approximateRawOffers?: string[];
  approximateRawServices?: string[];
  approximateRawAmountUnit?: Unit;
  approximateRawAmount?: number;

  paymentMethod?: PaymentMethod;
  paymentMethodData?: string;

  customerComment?: string;
}

export interface IAddOrderResponse extends ServerResponse {
  addedOrder?: IOrder;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private path = 'orders';

  constructor(private http: HttpClient, private api: ApiService) {}

  getAllLessInfo(): Observable<IGetAllOrdersLessInfoResponse> {
    return this.http.get<IGetAllOrdersLessInfoResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetOrdersResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetOrdersResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  getOne(id: string): Observable<IGetOneOrderResponse> {
    return this.http.get<IGetOneOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  updateStatus(
    id: string,
    status: OrderStatus
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/update-status/${id}`,
      { status }
    );
  }

  updateCompanyComment(
    id: string,
    comment: string
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/update-company-comment/${id}`,
      { comment }
    );
  }

  setDivision(id: string, division: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-division/${id}`,
      { division }
    );
  }

  assignClientManager(
    id: string,
    manager: string
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/assign-client-manager/${id}`,
      { manager }
    );
  }

  acceptClientManager(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/accept-client-manager/${id}`,
      {}
    );
  }

  assignReceivingManager(
    id: string,
    manager: string
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/assign-receiving-manager/${id}`,
      { manager }
    );
  }

  acceptReceivingManager(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/accept-receiving-manager/${id}`,
      {}
    );
  }

  assignDriver(id: string, driver: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/assign-driver/${id}`,
      { driver }
    );
  }

  acceptDriver(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/accept-driver/${id}`,
      {}
    );
  }

  setCar(id: string, car: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-car/${id}`,
      { car }
    );
  }

  setClient(id: string, client: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-client/${id}`,
      { client }
    );
  }

  process(fields: {
    id: string;
    division?: string;
    driver?: string;
    car?: string;
    comment?: string;
    deadline: Date;
  }): Observable<IUpdateOrderResponse> {
    const stringedDeadline = fields.deadline
      ? fields.deadline.toISOString()
      : undefined;
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/process/${fields.id}`,
      {
        division: fields.division,
        driver: fields.driver,
        car: fields.car,
        comment: fields.comment,
        deadline: stringedDeadline,
      }
    );
  }

  refuse(fields: {
    id: string;
    reason?: string;
  }): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/refuse/${fields.id}`,
      {
        reason: fields.reason,
      }
    );
  }

  cancel(fields: {
    id: string;
    reason?: string;
  }): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/cancel/${fields.id}`,
      {
        reason: fields.reason,
      }
    );
  }

  setInTransit(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-in-transit/${id}`,
      {}
    );
  }

  setDelivered(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-delivered/${id}`,
      {}
    );
  }

  weighOffers(fields: {
    id: string;
    offers: IOfferToWeigh[];
  }): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/weigh-offers/${fields.id}`,
      {
        offers: fields.offers,
      }
    );
  }

  weighServices(fields: {
    id: string;
    services: IServiceToWeigh[];
  }): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/weigh-services/${fields.id}`,
      {
        services: fields.services,
      }
    );
  }

  complete(id: string, finalSum?: number): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/complete/${id}`,
      { finalSum }
    );
  }

  add(order: IAddOrderRequest): Observable<IAddOrderResponse> {
    const newOrder = {
      type: order.type,
      deadline: order.deadline ? order.deadline.toISOString() : undefined,

      locality: order.locality,
      client: order.client,

      offersItems: order.offersItems,
      offersAmountUnit: order.offersAmountUnit,
      offersAmount: order.offersAmount,

      servicesItems: order.servicesItems,
      servicesAmountUnit: order.servicesAmountUnit,
      servicesAmount: order.servicesAmount,

      customerContactName: order.customerContactName,
      customerContactPhone: order.customerContactPhone,
      customerOrganizationActualName: order.customerOrganizationActualName,
      customerOrganizationLegalName: order.customerOrganizationLegalName,

      deliveryType: order.deliveryType,
      deliveryCustomerCarNumber: order.deliveryCustomerCarNumber,
      deliveryHasAssistant: order.deliveryHasAssistant,
      deliveryAddressFromHouse: order.deliveryAddressFromHouse,
      deliveryAddressFromStreet: order.deliveryAddressFromStreet,

      paymentMethod: order.paymentMethod,
      paymentMethodData: order.paymentMethodData,

      customerComment: order.customerComment,
    };

    return this.http.put<IAddOrderResponse>(
      `${environment.serverURL}/${this.path}/`,
      newOrder
    );
  }

  remove(id: string): Observable<IRemoveOrderResponse> {
    return this.http.delete<IRemoveOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
