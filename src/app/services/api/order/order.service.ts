import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import OrderType from '../../../models/enums/OrderType';
import DeliveryType from '../../../models/enums/DeliveryType';
import RawType from '../../../models/enums/RawType';
import RawUnit from '../../../models/enums/RawUnit';
import PaymentMethod from '../../../models/enums/PaymentMethod';
import { environment } from '../../../../environments/environment';
import { IOrder } from '../../../models/Order';
import ServerResponse from '../../../models/ServerResponse';

export interface IAddOrderRequest {
  type: OrderType;
  deliveryType?: DeliveryType;
  deliveryCustomerCarNumber?: string;
  deliveryHasAssistant?: boolean;
  deliveryAddressLocality: string;
  deliveryAddressStreet?: string;
  deliveryAddressHouse?: string;
  division?: string;
  approximateRawType?: RawType[];
  approximateRawAmountUnit?: RawUnit;
  approximateRawAmount?: number;
  customerOrganizationLegalName?: string;
  customerOrganizationActualName?: string;
  customerContactName: string;
  customerContactPhone: string;
  paymentMethod?: PaymentMethod;
  paymentMethodData?: string;
  desiredPickupDate: Date;
  comment?: string;
}

export interface IAddOrderResponse extends ServerResponse {
  order?: IOrder;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  add(order: IAddOrderRequest): Observable<IAddOrderResponse> {
    const newOrder = {
      approximateRawAmount: order.approximateRawAmount
        ? Number(order.approximateRawAmount)
        : undefined,
      approximateRawAmountUnit: order.approximateRawAmountUnit
        ? Number(order.approximateRawAmountUnit)
        : undefined,
      approximateRawType: order.approximateRawType
        ? order.approximateRawType.map((el) => Number(el))
        : undefined,
      comment: order.comment || undefined,
      customerContactName: order.customerContactName || undefined,
      customerContactPhone: order.customerContactPhone || undefined,
      customerOrganizationActualName:
        order.customerOrganizationActualName || undefined,
      customerOrganizationLegalName:
        order.customerOrganizationLegalName || undefined,
      deliveryAddressHouse: order.deliveryAddressHouse || undefined,
      deliveryAddressLocality: order.deliveryAddressLocality || undefined,
      deliveryAddressStreet: order.deliveryAddressStreet || undefined,
      deliveryCustomerCarNumber: order.deliveryCustomerCarNumber || undefined,
      deliveryHasAssistant: order.deliveryHasAssistant,
      deliveryType: order.deliveryType ? Number(order.deliveryType) : undefined,
      desiredPickupDate: order.desiredPickupDate
        ? order.desiredPickupDate.getTime()
        : undefined,
      division: order.division || undefined,
      paymentMethod: order.paymentMethod
        ? Number(order.paymentMethod)
        : undefined,
      paymentMethodData: order.paymentMethodData || undefined,
      type: order.type ? Number(order.type) : undefined,
    };

    Object.keys(newOrder).forEach((key) =>
      newOrder[key] === undefined || newOrder[key] === null
        ? delete newOrder[key]
        : {}
    );

    return this.http.put<IAddOrderResponse>(
      `${environment.serverURL}/orders/`,
      newOrder
    );
  }
}
