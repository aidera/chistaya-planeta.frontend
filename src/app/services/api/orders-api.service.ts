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

export interface IGetOneOrderResponse extends ServerResponse {
  order?: IOrder;
}

export interface IUpdateOrderRequest {
  type?: OrderType;
  locality: string;
  division: string;
  desiredPickupDate?: Date;
  customerComment?: string;
  employeeComment?: string;

  customerOrganizationLegalName?: string;
  customerOrganizationActualName?: string;
  customerContactName?: string;
  customerContactPhone?: string;

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
  locality: string;
  division?: string;
  desiredPickupDate: Date;
  comment?: string;

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

  update(
    id: string,
    fields: IUpdateOrderRequest
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
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

  setOrderManagerAssign(
    id: string,
    manager: string
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-manager-assign/${id}`,
      { manager }
    );
  }

  setOrderManagerAccept(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-manager-accept/${id}`,
      {}
    );
  }

  setOrderDriverAssign(
    id: string,
    driver: string
  ): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-driver-assign/${id}`,
      { driver }
    );
  }

  setOrderDriverAccept(id: string): Observable<IUpdateOrderResponse> {
    return this.http.patch<IUpdateOrderResponse>(
      `${environment.serverURL}/${this.path}/set-driver-accept/${id}`,
      {}
    );
  }

  add(order: IAddOrderRequest): Observable<IAddOrderResponse> {
    const newOrder = {
      type: order.type ? Number(order.type) : undefined,
      locality: order.locality || undefined,
      division: order.division || undefined,
      desiredPickupDate: order.desiredPickupDate
        ? order.desiredPickupDate.toISOString()
        : undefined,
      comment: order.comment || undefined,

      customerContactName: order.customerContactName || undefined,
      customerContactPhone: order.customerContactPhone || undefined,
      customerOrganizationActualName:
        order.customerOrganizationActualName || undefined,
      customerOrganizationLegalName:
        order.customerOrganizationLegalName || undefined,

      deliveryType: order.deliveryType ? Number(order.deliveryType) : undefined,
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
    };

    Object.keys(newOrder).forEach((key) =>
      newOrder[key] === undefined || newOrder[key] === null
        ? delete newOrder[key]
        : {}
    );

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
