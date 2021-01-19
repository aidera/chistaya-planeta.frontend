import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { TableColumnType } from '../../models/types/TableColumnType';
import { TableSortType } from '../../models/types/TableSortType';
import {
  TableDisplayType,
  TableDisplayOutputType,
} from '../../models/types/TableDisplayType';
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

  @Input() columnsCanBeDisplayed: TableDisplayOutputType[];
  @Input() displayedColumns?: TableDisplayOutputType[];
  @Input() sorting?: TableSortType;
  @Input() isLoading?: boolean;
  @Input() pagination?: PaginationType;

  @Output() display = new EventEmitter<TableDisplayOutputType[]>();
  @Output() sort = new EventEmitter<TableSortType>();
  @Output() paginate = new EventEmitter<PaginationType>();
  @Output() itemClick = new EventEmitter<number>();

  ngOnInit(): void {
    if (this.displayedColumns === undefined) {
      this.displayedColumns = this.columnsCanBeDisplayed;
    }
  }

  findColumnInfo(field: string): TableColumnType {
    return this.columnsData.find((el) => el.key === field);
  }

  onDisplay(event: TableDisplayType): void {
    /* Показать все */
    if (event.all === true && event.status === true) {
      this.display.emit(this.columnsCanBeDisplayed);
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

          this.columnsCanBeDisplayed.forEach((column) => {
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
