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

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columnsData: TableColumnType[];
  @Input() data: { [key: string]: any }[];

  @Input() displayedColumns: TableDisplayOutputType[];
  @Input() sorting?: TableSortType;
  @Input() filtration?: TableFilterOutputType[];

  @Output() display = new EventEmitter<TableDisplayOutputType[]>();
  @Output() sort = new EventEmitter<TableSortType>();
  @Output() filter = new EventEmitter<TableFilterOutputType[]>();

  public filterType = FilterType;

  constructor() {}

  ngOnInit(): void {}

  findColumnInfo(field: string): TableColumnType {
    return this.columnsData.find((el) => el.key === field);
  }

  findFilterInfo(field: string): { field: string; value: string | any[] } {
    return this.filtration.find((el) => el.field === field);
  }

  onDisplay(event: TableDisplayType): void {
    const isExist = this.displayedColumns.includes(event.field);
    if (isExist) {
      if (!event.status) {
        const index = this.displayedColumns.indexOf(event.field);
        this.displayedColumns.splice(index, 1);
        this.display.emit(this.displayedColumns);
      }
    } else {
      if (event.status) {
        const allDisplayedColumns = this.columnsData.map(
          (column) => column.key
        );
        this.display.emit(
          allDisplayedColumns.filter((column) => {
            return (
              this.displayedColumns.includes(column) || column === event.field
            );
          })
        );
      }
    }
  }

  onSort(field: string): void {
    let sortType: 'asc' | 'desc' = 'asc';
    if (this.sorting.field === field && this.sorting.type === 'asc') {
      sortType = 'desc';
    }
    this.sort.emit({ field, type: sortType });
  }

  onFilter(event: TableFilterType): void {
    const field = this.filtration.find((el) => el.field === event.field);

    switch (event.type) {
      case FilterType.text:
        if (field) {
          field.value = event.value;
        } else {
          this.filtration.push({
            field: event.field,
            value: event.value,
          });
        }
        break;

      case FilterType.values:
        if (field) {
          if (event.value === true) {
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
          } else {
            const parameterIndex = (field.value as string[]).indexOf(
              event.parameter
            );
            if (parameterIndex >= 0) {
              (field.value as string[]).splice(parameterIndex, 1);
            }
          }
        } else {
          this.filtration.push({
            field: event.field,
            value: [event.parameter],
          });
        }
        break;
    }

    const newFilter = this.filtration.map((el) => {
      if (el.field === event.field) {
        return field;
      } else {
        return el;
      }
    });

    this.filter.emit(newFilter);
  }
}
