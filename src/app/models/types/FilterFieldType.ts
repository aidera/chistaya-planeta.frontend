import { FilterType } from '../enums/FilterType';

export type FilterFieldType = {
  [key: string]: {
    key: string;
    type: FilterType;
    isArray?: boolean;
    exact?: boolean;
  };
};
