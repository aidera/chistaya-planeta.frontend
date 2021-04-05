import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { OrderType } from '../../models/enums/OrderType';
import { DeliveryType } from '../../models/enums/DeliveryType';
import { PaymentMethod } from '../../models/enums/PaymentMethod';
import { environment } from '../../../environments/environment';
import { ServerResponse } from '../../models/ServerResponse';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { Unit } from '../../models/enums/Unit';
import { IScheduledOrder } from '../../models/ScheduledOrder';
import { PeriodType } from '../../models/enums/PeriodType';
import { SimpleStatus } from '../../models/enums/SimpleStatus';

export interface IGetOneScheduledOrderResponse extends ServerResponse {
  scheduledOrder?: IScheduledOrder;
}

export interface IUpdateScheduledOrderResponse extends ServerResponse {
  updatedScheduledOrder?: IScheduledOrder;
}

export interface IRemoveScheduledOrderResponse extends ServerResponse {
  removedScheduledOrder?: IScheduledOrder;
}

export interface IGetScheduledOrdersResponse extends ServerResponse {
  scheduledOrders?: IScheduledOrder[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

export interface IUpdateScheduledOrderRequest {
  status?: SimpleStatus;

  periodType?: PeriodType;
  periodAmount?: number;
  startDate?: Date;

  type?: OrderType;

  locality?: string;
  client?: string;

  offersItems?: string[];
  offersAmountUnit?: Unit;
  offersAmount?: number;

  servicesItems?: string[];
  servicesAmountUnit?: Unit;
  servicesAmount?: number;

  customerOrganizationLegalName?: string;
  customerOrganizationActualName?: string;
  customerContactName?: string;
  customerContactPhone?: string;

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

export interface IAddScheduledOrderRequest {
  periodType: PeriodType;
  periodAmount: number;
  startDate: Date;

  type: OrderType;

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

export interface IAddScheduledOrderResponse extends ServerResponse {
  addedScheduledOrder?: IScheduledOrder;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduledOrdersApiService {
  private path = 'scheduled-orders';

  constructor(private http: HttpClient, private api: ApiService) {}

  get(request: GetRouteParamsType): Observable<IGetScheduledOrdersResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetScheduledOrdersResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  getOne(id: string): Observable<IGetOneScheduledOrderResponse> {
    return this.http.get<IGetOneScheduledOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  update(
    id: string,
    fields: IUpdateScheduledOrderRequest
  ): Observable<IUpdateScheduledOrderResponse> {
    return this.http.patch<IUpdateScheduledOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      {
        ...fields,
        startDate: fields.startDate
          ? fields.startDate.toISOString()
          : undefined,
      }
    );
  }

  updateStatus(
    id: string,
    status: SimpleStatus
  ): Observable<IUpdateScheduledOrderResponse> {
    return this.http.patch<IUpdateScheduledOrderResponse>(
      `${environment.serverURL}/${this.path}/update-status/${id}`,
      { status }
    );
  }

  add(
    scheduledOrder: IAddScheduledOrderRequest
  ): Observable<IAddScheduledOrderResponse> {
    const newScheduledOrder = {
      ...scheduledOrder,
      startDate: scheduledOrder.startDate.toISOString(),
    };

    return this.http.put<IAddScheduledOrderResponse>(
      `${environment.serverURL}/${this.path}/`,
      newScheduledOrder
    );
  }

  remove(id: string): Observable<IRemoveScheduledOrderResponse> {
    return this.http.delete<IRemoveScheduledOrderResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
