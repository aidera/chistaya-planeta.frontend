import { ILocality } from '../Locality';

type Address = {
  locality: string | ILocality;
  street: string;
  house: string;
};

export default Address;
