import { FilterType } from '../enums/FilterType';

export type TableColumnType = {
  key: string;
  title: string;
  filter?: {
    type: FilterType;
    values?: {
      value: string | number;
      text: string;
    }[];
  };
};
