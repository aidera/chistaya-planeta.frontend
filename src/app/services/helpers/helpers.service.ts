import { Injectable } from '@angular/core';
import { OrderType } from '../../models/enums/OrderType';
import { Unit } from '../../models/enums/Unit';
import { IOffer } from '../../models/Offer';
import { IService } from '../../models/Service';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

export type getOrderApproximateCostReturn = {
  approximatePaymentCost?:
    | {
        final?: number;
        string?: string;
      }
    | undefined;
  approximateRemunerationCost?:
    | {
        from?: number;
        to?: number;
        string?: string;
      }
    | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  constructor() {}

  public getOrderApproximateCost(args: {
    offers?: IOffer[];
    services?: IService[];
    orderType?: OrderType;
    offersItems?: string[];
    offersUnit?: Unit;
    offersAmount?: number;
    servicesItems?: string[];
    servicesUnit?: Unit;
    servicesAmount?: number;
    hasDelivery?: boolean;
  }): getOrderApproximateCostReturn {
    /* Function always should returns an array with one undefined element, depending on the ORDER TYPE */

    /* Setting up necessary variables */
    let approximatePaymentCostFinal: number | undefined;
    let approximatePaymentCostString: string | undefined;

    let approximateRemunerationCostFrom: number | undefined;
    let approximateRemunerationCostTo: number | undefined;
    let approximateRemunerationCostString: string | undefined;

    /* Counting approximatePaymentCost, because Order type is offer */
    if (args.orderType === OrderType.offer) {
      let priceFrom = 0;
      let priceTo = 0;

      args.offersItems?.forEach((offer, i) => {
        const offerPrices = args.offers?.find((el) => el._id === offer).prices;

        offerPrices?.forEach((price) => {
          if (price.unit === args.offersUnit) {
            if (args.hasDelivery === true) {
              if (price.amountWithDelivery > priceTo) {
                priceTo = price.amountWithDelivery;
              }
              if (
                price.amountWithDelivery <= priceFrom ||
                args.offersItems.length === 1
              ) {
                priceFrom = price.amountWithDelivery;
              }
              if (i === 0) {
                priceTo = price.amountWithDelivery;
                priceFrom = price.amountWithDelivery;
              }
            } else if (args.hasDelivery === false) {
              if (price.amountWithoutDelivery > priceTo) {
                priceTo = price.amountWithoutDelivery;
              }
              if (
                price.amountWithoutDelivery <= priceFrom ||
                args.offersItems.length === 1
              ) {
                priceFrom = price.amountWithoutDelivery;
              }
              if (i === 0) {
                priceTo = price.amountWithoutDelivery;
                priceFrom = price.amountWithoutDelivery;
              }
            }
          }
        });
      });

      if (args.offersAmount !== undefined) {
        approximateRemunerationCostFrom = priceFrom * args.offersAmount;
        approximateRemunerationCostTo = priceTo * args.offersAmount;

        if (priceFrom === 0 && priceTo === 0) {
          approximateRemunerationCostString = undefined;
        } else if (priceFrom === priceTo) {
          approximateRemunerationCostString = `${
            priceFrom * args.offersAmount
          } руб.`;
        } else if (priceFrom === 0) {
          approximateRemunerationCostString = `до ${
            priceTo * args.offersAmount
          } руб.`;
        } else {
          approximateRemunerationCostString = `от ${
            priceFrom * args.offersAmount
          } руб. до ${priceTo * args.offersAmount} руб.`;
        }
      }
    }

    /* Counting approximateRemunerationCost, because Order type is service */
    if (args.orderType === OrderType.service) {
      /* We know, that there is only one service, that is why without forEach */
      const servicePrices = args.services[0]?.prices;

      let finalPrice = 0;

      servicePrices?.forEach((price) => {
        if (price.unit === args.servicesUnit) {
          finalPrice = price.amount;
        }
      });

      if (args.servicesAmount !== undefined) {
        approximatePaymentCostFinal = finalPrice * args.servicesAmount;

        if (finalPrice === 0) {
          approximatePaymentCostString = undefined;
        } else {
          approximatePaymentCostString = `${
            finalPrice * args.servicesAmount
          } руб.`;
        }
      }
    }

    return {
      approximatePaymentCost: {
        final: approximatePaymentCostFinal,
        string: approximatePaymentCostString,
      },
      approximateRemunerationCost: {
        from: approximateRemunerationCostFrom,
        to: approximateRemunerationCostTo,
        string: approximateRemunerationCostString,
      },
    };
  }

  public updateValidatorsOnCostChange(args: {
    orderType: OrderType;
    approximateRemunerationCostFrom?: number;
    approximateRemunerationCostTo?: number;
    approximatePaymentCostFinal?: number;
    fields: {
      paymentMethod?: FormControl | AbstractControl;
    };
  }): void {
    if (args.orderType === OrderType.offer) {
      if (
        args.approximateRemunerationCostFrom === 0 &&
        args.approximateRemunerationCostTo === 0
      ) {
        args.fields.paymentMethod?.clearValidators();
        args.fields.paymentMethod?.setErrors(null);
      } else if (
        args.approximateRemunerationCostFrom ===
        args.approximateRemunerationCostTo
      ) {
        args.fields.paymentMethod?.setValidators(Validators.required);
        args.fields.paymentMethod?.updateValueAndValidity();
      } else if (args.approximateRemunerationCostFrom === 0) {
        args.fields.paymentMethod?.setValidators(Validators.required);
        args.fields.paymentMethod?.updateValueAndValidity();
      } else {
        args.fields.paymentMethod?.setValidators(Validators.required);
        args.fields.paymentMethod?.updateValueAndValidity();
      }
    } else if (args.orderType === OrderType.service) {
      args.fields.paymentMethod?.setValidators(Validators.required);
      args.fields.paymentMethod?.updateValueAndValidity();
    } else {
      args.fields.paymentMethod?.clearValidators();
      args.fields.paymentMethod?.setErrors(null);
    }
  }
}
