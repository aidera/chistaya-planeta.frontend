export type TableColumnData = {
  title: string;
  width?: number;
  modificator?: (value: any) => string;
  breakLine?: boolean;
};
