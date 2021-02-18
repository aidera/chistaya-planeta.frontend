import PriceType from '../enums/PriceType';
import RawUnit from '../enums/RawUnit';

type Price = {
  type: PriceType;
  unit?: RawUnit;
  amountWithDelivery?: number;
  amountWithoutDelivery?: number;
  amount?: number;
  description?: string;
};

export default Price;
