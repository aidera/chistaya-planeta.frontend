import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import OrderType from '../../models/enums/OrderType';
import DeliveryType from '../../models/enums/DeliveryType';
import RawUnit from '../../models/enums/RawUnit';
import PaymentMethod from '../../models/enums/PaymentMethod';
import { environment } from '../../../environments/environment';
import { IOrder } from '../../models/Order';
import ServerResponse from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import OrderStatus from '../../models/enums/OrderStatus';
import Unit from '../../models/enums/Unit';

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

export interface IAddOrderRequest {
  type: OrderType;
  deadline: Date;

  locality: string;

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
  deliveryAddressStreet?: string;
  deliveryAddressHouse?: string;

  approximateRawOffers?: string[];
  approximateRawServices?: string[];
  approximateRawAmountUnit?: RawUnit;
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

  add(order: IAddOrderRequest): Observable<IAddOrderResponse> {
    console.log(order);
    const newOrder = {
      type: order.type,
      deadline: order.deadline ? order.deadline.toISOString() : undefined,

      locality: order.locality || undefined,

      offersItems: order.offersItems || undefined,
      offersAmountUnit: order.offersAmountUnit || undefined,
      offersAmount: order.offersAmount || undefined,

      servicesItems: order.servicesItems || undefined,
      servicesAmountUnit: order.servicesAmountUnit || undefined,
      servicesAmount: order.servicesAmount || undefined,

      customerContactName: order.customerContactName || undefined,
      customerContactPhone: order.customerContactPhone || undefined,
      customerOrganizationActualName:
        order.customerOrganizationActualName || undefined,
      customerOrganizationLegalName:
        order.customerOrganizationLegalName || undefined,

      deliveryType: order.deliveryType,
      deliveryCustomerCarNumber: order.deliveryCustomerCarNumber || undefined,
      deliveryHasAssistant: order.deliveryHasAssistant,
      deliveryAddressHouse: order.deliveryAddressHouse || undefined,
      deliveryAddressStreet: order.deliveryAddressStreet || undefined,

      approximateRawOffers: order.approximateRawOffers || undefined,
      approximateRawServices: order.approximateRawServices || undefined,
      approximateRawAmount: order.approximateRawAmount
        ? Number(order.approximateRawAmount)
        : undefined,
      approximateRawAmountUnit: order.approximateRawAmountUnit
        ? Number(order.approximateRawAmountUnit)
        : undefined,

      paymentMethod: order.paymentMethod
        ? Number(order.paymentMethod)
        : undefined,
      paymentMethodData: order.paymentMethodData || undefined,

      customerComment: order.customerComment || undefined,
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
