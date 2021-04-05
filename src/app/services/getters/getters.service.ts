import { Injectable } from '@angular/core';
import { ILocality } from '../../models/Locality';
import { ItemFieldListElement } from '../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { simpleStatusColors } from '../../data/simpleStatusData';
import { IDivision } from '../../models/Division';
import { ICar } from '../../models/Car';
import { carStatusColors } from '../../data/carStatusData';
import { IEmployee } from '../../models/Employee';
import { unitStrings } from 'src/app/data/unitOptions';
import { IOffer } from '../../models/Offer';
import { Unit } from '../../models/enums/Unit';
import { IService } from '../../models/Service';
import { DeliveryType } from '../../models/enums/DeliveryType';
import { OrderType } from '../../models/enums/OrderType';
import { IOrder } from '../../models/Order';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { IScheduledOrder } from '../../models/ScheduledOrder';

@Injectable({
  providedIn: 'root',
})
export class GettersService {
  constructor() {}

  public getRealBooleanFromStringedBoolean(value: any): boolean | undefined {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return undefined;
  }

  public getNumberFromString(value: string): number | undefined {
    const newNumber = Number(value);

    if (!isNaN(newNumber)) {
      return newNumber;
    }
    return undefined;
  }

  public getArrayOrUndefined<T>(
    value: any,
    arrayLength?: number,
    elementTransformer?: (e: any) => any
  ): T[] | undefined {
    if (!value) {
      return undefined;
    }
    if (Array.isArray(value)) {
      if (arrayLength !== undefined) {
        if (value.length === arrayLength) {
          return elementTransformer ? elementTransformer(value) : value;
        } else {
          return undefined;
        }
      }
      return elementTransformer ? elementTransformer(value) : value;
    }
    return undefined;
  }

  public getArrayFromStringedBooleanToRealBoolean(array: string[]): boolean[] {
    return array.map((el) => el === 'true');
  }

  public getArrayFromNumberBooleanToRealBoolean(array: number[]): boolean[] {
    return array.map((el) => el > 0);
  }

  public getArrayFromAnyToString(array: any[]): string[] {
    return array.map((el) => el + '');
  }

  public getArrayFromStringsToNullOrString(array: any[]): (string | null)[] {
    return array.map((el) => (el === '' ? null : el + ''));
  }

  public getServerFromToDateInISOStringArray(
    dateFrom?: Date,
    dateTo?: Date
  ): string[] | undefined {
    let valueToReturn = [];
    if (dateFrom) {
      valueToReturn[0] = new Date(dateFrom).toISOString();
    } else {
      valueToReturn[0] = null;
    }
    if (dateTo) {
      valueToReturn[1] = new Date(dateTo).toISOString();
    } else {
      valueToReturn[1] = null;
    }
    if (
      (valueToReturn[0] === null && valueToReturn[1] === null) ||
      valueToReturn.length <= 0
    ) {
      valueToReturn = undefined;
    }
    return valueToReturn;
  }

  public getArrayOfEnumValues(enumObject): any[] {
    const allValues = Object.values(enumObject);
    const half = Math.ceil(allValues.length / 2);

    return allValues.splice(0, half);
  }

  public getArrayOfEnumKeys(enumObject): any[] {
    const allValues = Object.values(enumObject);
    const half = Math.ceil(allValues.length / 2);

    return allValues.splice(-half);
  }

  public getArrayOfStringedEnumKeys(enumObject): string[] {
    const values = this.getArrayOfEnumKeys(enumObject);
    return values.map((value) => String(value));
  }

  public getClearServerRequestString(value: string): string {
    return value.replace(/[`~!@#$%^&*_|+\-=?;:<>\{\}\[\]\\\/]/gi, '');
  }

  getBeautifiedPhoneNumber(value: string): string {
    if (value.length === 12) {
      return (
        value[0] +
        value[1] +
        ' (' +
        value[2] +
        value[3] +
        value[4] +
        ') ' +
        value[5] +
        value[6] +
        value[7] +
        '-' +
        value[8] +
        value[9] +
        '-' +
        value[10] +
        value[11]
      );
    } else {
      return value;
    }
  }

  public getUserInitials(
    name: string,
    surname: string,
    patronymic?: string
  ): string {
    const shortName = name?.length > 1 ? name.substr(0, 1) : name;
    const shortNameCapitalized = name
      ? shortName.charAt(0).toUpperCase() + shortName.slice(1)
      : '';
    const surnameCapitalized =
      surname?.length > 1
        ? surname.charAt(0).toUpperCase() + surname.slice(1)
        : surname;
    const shortPatronymic =
      patronymic?.length > 1 ? patronymic.substr(0, 1) : patronymic;
    const shortPatronymicCapitalized = patronymic
      ? shortPatronymic.charAt(0).toUpperCase() + shortPatronymic.slice(1)
      : undefined;

    if (patronymic) {
      return (
        surnameCapitalized +
        ' ' +
        shortNameCapitalized +
        '. ' +
        shortPatronymicCapitalized +
        '.'
      );
    } else {
      return surnameCapitalized + ' ' + shortNameCapitalized + '.';
    }
  }

  public getItemLocalitiesFieldListElements(
    localities: (ILocality | string)[]
  ): ItemFieldListElement[] {
    return (
      (localities as ILocality[])?.map((el) => {
        return {
          text: el.name,
          color: simpleStatusColors[el.status],
          linkArray: ['../../', 'localities', el._id],
        };
      }) || []
    );
  }

  public getItemDivisionsFieldListElements(
    divisions: (IDivision | string)[]
  ): ItemFieldListElement[] {
    return (
      (divisions as IDivision[])?.map((el) => {
        return {
          text: el.name,
          color: simpleStatusColors[el.status],
          linkArray: ['../../', 'divisions', el._id],
        };
      }) || []
    );
  }

  public getItemCarsFieldListElements(
    cars: (ICar | string)[]
  ): ItemFieldListElement[] {
    return (
      (cars as ICar[])?.map((el) => {
        return {
          text: el.licensePlate,
          color: carStatusColors[el.status],
          linkArray: ['../../', 'cars', el._id],
        };
      }) || []
    );
  }

  public getItemEmployeesFieldListElements(
    employees: (IEmployee | string)[]
  ): ItemFieldListElement[] {
    return (
      (employees as IEmployee[])?.map((el) => {
        return {
          text: this.getUserInitials(el.name, el.surname, el.patronymic),
          color: carStatusColors[el.status],
          linkArray: ['../../', 'employees', el._id],
        };
      }) || []
    );
  }

  public getDivisionsValuesArray(divisions: (IDivision | string)[]): string[] {
    return (
      (divisions as IDivision[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getEmployeesValuesArray(employees: (IEmployee | string)[]): string[] {
    return (
      (employees as IEmployee[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getCarsValuesArray(cars: (ICar | string)[]): string[] {
    return (
      (cars as ICar[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getOrderOffersAmount(order?: IOrder): string | undefined {
    if (order?.offers) {
      const unit = unitStrings[order.offers.amountUnit];
      return order.offers.amount + ' ' + unit;
    }
    return undefined;
  }

  public getOrderServicesAmount(order?: IOrder): string | undefined {
    if (order?.services) {
      const unit = unitStrings[order.services.amountUnit];
      return order.services.amount + ' ' + unit;
    }
    return undefined;
  }

  public getOrderWeighedOffersList(
    order?: IOrder,
    offers?: IOffer[]
  ): ItemFieldListElement[] {
    if (order?.weighed?.offers) {
      return order.weighed.offers.map((offer) => {
        const allPrices = offers
          ?.find((el) => el._id === (offer.item as IOffer)?._id)
          ?.prices.find((el) => el.unit === offer.amountUnit);
        const price =
          order.delivery._type === DeliveryType.company ||
          order.type === OrderType.service
            ? allPrices?.amountWithDelivery
            : allPrices?.amountWithoutDelivery;

        return {
          text:
            (offer.item as IOffer)?.name +
            ' - ' +
            offer.amount +
            ' ' +
            unitStrings[offer.amountUnit] +
            ' (' +
            price * offer.amount +
            ' руб.)',
        };
      });
    }
    return [];
  }

  public getOrderWeighedServicesList(order?: IOrder): ItemFieldListElement[] {
    if (order?.weighed?.services) {
      return (order?.weighed?.services).map((service) => {
        return {
          text: service.amount + ' ' + unitStrings[service.amountUnit],
        };
      });
    }
    return [];
  }

  public getOrderOfferCost(
    offerId: string,
    offerUnit: Unit,
    offerAmount: number,
    order?: IOrder,
    offers?: IOffer[]
  ): number {
    if (order && offers) {
      const targetOffer = offers.find((offer) => offer._id === offerId)?.prices;
      const targetOfferPrice = targetOffer?.find(
        (price) => price.unit === offerUnit
      );
      if (order.delivery._type === DeliveryType.company) {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithDelivery * offerAmount
          : 0;
      } else {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithoutDelivery * offerAmount
          : 0;
      }
    } else {
      return 0;
    }
  }

  public getOrderServiceCost(
    serviceUnit: Unit,
    serviceAmount: number,
    order?: IOrder,
    services?: IService[]
  ): number {
    if (order && services) {
      const targetService = services[0].prices;
      const targetServicePrice = targetService?.find(
        (price) => price.unit === serviceUnit
      );
      return targetServicePrice
        ? targetServicePrice?.amount * serviceAmount
        : 0;
    } else {
      return 0;
    }
  }

  public getOrderOfferItemsArrayString(order?: IOrder): string {
    if (order?.offers) {
      return JSON.stringify(
        (order.offers.items as IOffer[])
          .map((el) => {
            return el._id;
          })
          .concat()
      );
    }
    return '';
  }

  public getScheduledOrderOffersList(
    scheduledOrder?: IScheduledOrder
  ): ItemFieldListElement[] {
    if (scheduledOrder?.offers?.items) {
      return (scheduledOrder.offers.items as IOffer[]).map((offer) => {
        return {
          text: offer.name,
          color: offer.status === SimpleStatus.inactive ? 'red' : undefined,
        };
      });
    }
    return [];
  }

  public getScheduledOrderOfferCost(
    offerId: string,
    offerUnit: Unit,
    offerAmount: number,
    scheduledOrder?: IScheduledOrder,
    offers?: IOffer[]
  ): number {
    if (scheduledOrder && offers) {
      const targetOffer = offers.find((offer) => offer._id === offerId)?.prices;
      const targetOfferPrice = targetOffer?.find(
        (price) => price.unit === offerUnit
      );
      if (scheduledOrder.delivery._type === DeliveryType.company) {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithDelivery * offerAmount
          : 0;
      } else {
        return targetOfferPrice
          ? targetOfferPrice?.amountWithoutDelivery * offerAmount
          : 0;
      }
    } else {
      return 0;
    }
  }

  public getScheduledOrderServiceCost(
    serviceUnit: Unit,
    serviceAmount: number,
    scheduledOrder?: IScheduledOrder,
    services?: IService[]
  ): number {
    if (scheduledOrder && services) {
      const targetService = services[0].prices;
      const targetServicePrice = targetService?.find(
        (price) => price.unit === serviceUnit
      );
      return targetServicePrice
        ? targetServicePrice?.amount * serviceAmount
        : 0;
    } else {
      return 0;
    }
  }

  getScheduledOrderOfferItemsArray(scheduledOrder?: IScheduledOrder): string[] {
    if (scheduledOrder?.offers) {
      return (scheduledOrder.offers.items as IOffer[]).map((el) => {
        return el._id;
      });
    }
    return [];
  }
}
