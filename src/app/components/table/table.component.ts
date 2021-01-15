import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { TableColumnType } from '../../models/types/TableColumnType';
import { FilterType } from '../../models/enums/FilterType';
import { TableSortType } from '../../models/types/TableSortType';
import {
  TableDisplayType,
  TableDisplayOutputType,
} from '../../models/types/TableDisplayType';
import {
  TableFilterType,
  TableFilterOutputType,
} from '../../models/types/TableFilterType';
import { PaginationType } from '../../models/types/PaginationType';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columnsData: TableColumnType[];
  @Input() data: { [key: string]: any }[];

  @Input() displayedColumns?: TableDisplayOutputType[];
  @Input() sorting?: TableSortType;
  @Input() filtration?: TableFilterOutputType[];
  @Input() isLoading?: boolean;
  @Input() pagination?: PaginationType;

  @Output() display = new EventEmitter<TableDisplayOutputType[]>();
  @Output() sort = new EventEmitter<TableSortType>();
  @Output() filter = new EventEmitter<TableFilterOutputType[]>();
  @Output() paginate = new EventEmitter<PaginationType>();
  @Output() itemClick = new EventEmitter<number>();

  public filterType = FilterType;
  public allDisplayedColumns: TableDisplayOutputType[];

  ngOnInit(): void {
    if (this.columnsData && this.columnsData.length > 0) {
      this.allDisplayedColumns = this.columnsData.map((column) => column.key);
    }
    if (this.displayedColumns === undefined) {
      this.displayedColumns = this.allDisplayedColumns;
    }
  }

  findColumnInfo(field: string): TableColumnType {
    return this.columnsData.find((el) => el.key === field);
  }

  findFilterInfo(field: string): TableFilterOutputType {
    return this.filtration
      ? this.filtration.find((el) => el.field === field)
      : undefined;
  }

  onDisplay(event: TableDisplayType): void {
    this.allDisplayedColumns = this.columnsData.map((column) => column.key);

    /* Показать все */
    if (event.all === true && event.status === true) {
      this.display.emit(this.allDisplayedColumns);
    }

    /* Другие действия */
    if (!event.all && event.status !== undefined && event.field !== undefined) {
      const isExist = this.displayedColumns.includes(event.field);
      if (isExist) {
        if (!event.status) {
          const index = this.displayedColumns.indexOf(event.field);
          this.displayedColumns.splice(index, 1);
          if (this.displayedColumns.length <= 0) {
            this.display.emit(undefined);
          } else {
            this.display.emit(this.displayedColumns);
          }
        }
      } else {
        if (event.status) {
          const newDisplayedColumns: TableDisplayOutputType[] = [];

          this.allDisplayedColumns.forEach((column) => {
            if (
              this.displayedColumns.includes(column) ||
              column === event.field
            ) {
              newDisplayedColumns.push(column);
            }
          });

          this.display.emit(newDisplayedColumns);
        } else {
          const filteredFields = this.displayedColumns.filter(
            (el) => el !== event.field
          );
          if (filteredFields.length <= 0) {
            this.display.emit(undefined);
          } else {
            this.display.emit(filteredFields);
          }
        }
      }
    }
  }

  onSort(field: string): void {
    let sortType: 'asc' | 'desc' = 'asc';
    if (
      this.sorting &&
      this.sorting.field === field &&
      this.sorting.type === 'asc'
    ) {
      sortType = 'desc';
    }
    this.sort.emit({ field, type: sortType });
  }

  onFilter(event: TableFilterType): void {
    const field = this.filtration
      ? this.filtration.find((el) => el.field === event.field)
      : undefined;
    const allValues = this.columnsData.find((el) => el.key === event.field)
      .filter.values;
    let filtrationCopy = this.filtration;

    switch (event.type) {
      case FilterType.text:
        /* Очистка */
        if (event.value === true) {
          if (filtrationCopy) {
            filtrationCopy = filtrationCopy.filter(
              (el) => el.field !== event.field
            );
          }
        } else {
          /* Другие действия */
          if (field) {
            if (event.value === '') {
              filtrationCopy = filtrationCopy.filter(
                (el) => el.field !== field.field
              );
            } else {
              field.value = event.value;
              filtrationCopy = filtrationCopy.map((el) =>
                el.field === event.field ? field : el
              );
            }
          } else {
            if (filtrationCopy) {
              filtrationCopy.push({
                field: event.field,
                value: event.value,
              });
            } else {
              filtrationCopy = [
                {
                  field: event.field,
                  value: event.value,
                },
              ];
            }
          }
        }

        break;

      case FilterType.values:
        /* "Показать все" */
        if (event.parameter === undefined && event.value === true) {
          if (filtrationCopy) {
            filtrationCopy = filtrationCopy.filter(
              (el) => el.field !== event.field
            );
          }
        }

        /* "Добавить отображаемый параметр". Если parameter есть и value === true */
        if (event.parameter !== undefined && event.value === true) {
          if (field) {
            const parameterIndex = (field.value as string[]).indexOf(
              event.parameter
            );
            if (parameterIndex < 0) {
              if (!field.value) {
                field.value = [event.parameter];
              } else {
                (field.value as string[]).push(event.parameter);
              }
            }

            if (
              field &&
              field.value &&
              field.value.length === allValues.length
            ) {
              filtrationCopy = filtrationCopy.filter(
                (el) => el.field !== event.field
              );
            } else {
              filtrationCopy = filtrationCopy.map((el) =>
                el.field === event.field ? field : el
              );
            }
          } else {
            if (filtrationCopy) {
              filtrationCopy.push({
                field: event.field,
                value: [event.parameter],
              });
            } else {
              filtrationCopy = [
                {
                  field: event.field,
                  value: [event.parameter],
                },
              ];
            }
          }
        }

        /* "Убрать отображаемый параметр". Если parameter есть и value === false */
        if (event.parameter !== undefined && event.value === false) {
          if (field) {
            const parameterIndex = (field.value as string[]).indexOf(
              event.parameter
            );
            if (parameterIndex >= 0) {
              (field.value as string[]).splice(parameterIndex, 1);
              if (field.value.length > 0) {
                filtrationCopy = filtrationCopy.map((el) =>
                  el.field === event.field ? field : el
                );
              } else {
                filtrationCopy = filtrationCopy.filter(
                  (el) => el.field !== event.field
                );
              }
            }
          } else {
            if (filtrationCopy) {
              filtrationCopy = filtrationCopy.filter(
                (el) => el.field !== event.field
              );
            }
          }
        }

        break;

      case FilterType.number:
        /* Очистка */
        if (event.value === true) {
          filtrationCopy = filtrationCopy.filter(
            (el) => el.field !== event.field
          );
        } else {
          /* Другие действия */
          if (event.value === '') {
            event.value = null;
          } else {
            event.value = +event.value;
          }

          if (field) {
            if (event.parameter === 'from') {
              field.value = [event.value, field.value[1] || null];
            } else if (event.parameter === 'to') {
              field.value = [field.value[0] || null, event.value];
            }

            if (
              (field.value[0] === null || field.value[0] === undefined) &&
              (field.value[1] === null || field.value[1] === undefined)
            ) {
              filtrationCopy = filtrationCopy.filter(
                (el) => el.field !== event.field
              );
            } else {
              filtrationCopy = filtrationCopy.map((el) =>
                el.field === event.field ? field : el
              );
            }
          } else {
            if (event.value !== null) {
              if (event.parameter === 'from') {
                if (filtrationCopy) {
                  filtrationCopy.push({
                    field: event.field,
                    value: [event.value, null],
                  });
                } else {
                  filtrationCopy = [
                    {
                      field: event.field,
                      value: [event.value, null],
                    },
                  ];
                }
              } else if (event.parameter === 'to') {
                if (filtrationCopy) {
                  filtrationCopy.push({
                    field: event.field,
                    value: [null, event.value],
                  });
                } else {
                  filtrationCopy = [
                    {
                      field: event.field,
                      value: [null, event.value],
                    },
                  ];
                }
              }
            }
          }
        }

        break;

      case FilterType.date:
        /* Очистка */
        if (event.value === true) {
          if (filtrationCopy) {
            filtrationCopy = filtrationCopy.filter(
              (el) => el.field !== event.field
            );
          }
        } else {
          /* Другие действия */
          if (event.value === '') {
            event.value = null;
          }

          if (field) {
            if (event.parameter === 'from') {
              field.value = [event.value, field.value[1] || null];
            } else if (event.parameter === 'to') {
              field.value = [field.value[0] || null, event.value];
            }

            if (
              (field.value[0] === null || field.value[0] === undefined) &&
              (field.value[1] === null || field.value[1] === undefined)
            ) {
              filtrationCopy = filtrationCopy.filter(
                (el) => el.field !== event.field
              );
            } else {
              filtrationCopy = filtrationCopy.map((el) =>
                el.field === event.field ? field : el
              );
            }
          } else {
            if (event.value !== null) {
              if (event.parameter === 'from') {
                if (filtrationCopy) {
                  filtrationCopy.push({
                    field: event.field,
                    value: [event.value, null],
                  });
                } else {
                  filtrationCopy = [
                    {
                      field: event.field,
                      value: [event.value, null],
                    },
                  ];
                }
              } else if (event.parameter === 'to') {
                if (filtrationCopy) {
                  filtrationCopy.push({
                    field: event.field,
                    value: [null, event.value],
                  });
                } else {
                  filtrationCopy = [
                    {
                      field: event.field,
                      value: [null, event.value],
                    },
                  ];
                }
              }
            }
          }
        }

        break;
    }

    if (!filtrationCopy || filtrationCopy.length <= 0) {
      this.filter.emit(undefined);
    } else {
      this.filter.emit(filtrationCopy);
    }
  }

  onPaginate(event: PageEvent): void {
    this.paginate.emit({
      perPage: event.pageSize,
      totalItemsCount: event.length,
      totalPagesCount: Math.ceil(event.length / event.pageSize),
      currentPage: event.pageIndex,
    });
  }

  onItemClick(index: number): void {
    this.itemClick.emit(index);
  }
}
