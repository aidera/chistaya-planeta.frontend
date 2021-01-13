import { FilterType } from '../enums/FilterType';

export type TableFilterType = {
  field: string;
  type: FilterType;
  value: any;
  parameter?: any;
};
export type TableFilterOutputType = { field: string; value: string | any[] };
