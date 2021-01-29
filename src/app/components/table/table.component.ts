import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';

import { PaginationType } from '../../models/types/PaginationType';

export type TableColumnType = {
  key: string;
  title: string;
  isSorting?: boolean;
};
export type TableDataType = { [key: string]: any };
export type TableDisplayOutputType = string;
export type TableSortType = { field: string; type: 'asc' | 'desc' };

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columnsData: TableColumnType[];
  @Input() data: TableDataType[] | null;

  @Input() columnsCanBeDisplayed: TableDisplayOutputType[];
  @Input() displayedColumns?: TableDisplayOutputType[];
  @Input() sorting?: TableSortType;
  @Input() isLoading?: boolean;
  @Input() pagination?: PaginationType;

  @Output() display = new EventEmitter<TableDisplayOutputType[]>();
  @Output() sort = new EventEmitter<TableSortType>();
  @Output() paginate = new EventEmitter<number>();
  @Output() itemClick = new EventEmitter<number>();

  public displayForm: FormGroup;

  ngOnInit(): void {
    if (this.displayedColumns === undefined) {
      this.displayedColumns = this.columnsCanBeDisplayed;
    }
    this.initDisplayForm();
  }

  public findColumnInfo(field: string): TableColumnType {
    return this.columnsData.find((el) => el.key === field);
  }

  private initDisplayForm(): void {
    const controls: { [key: string]: FormControl } = {};

    let trueCountInit = 0;
    this.columnsCanBeDisplayed.forEach((field) => {
      controls[field] = new FormControl(this.displayedColumns.includes(field));
      if (this.displayedColumns.includes(field)) {
        trueCountInit += 1;
      }
    });

    this.displayForm = new FormGroup(controls);

    this.columnsCanBeDisplayed.forEach((field) => {
      if (trueCountInit <= 1 && this.displayForm.get(field).value === true) {
        this.displayForm.get(field).disable({ emitEvent: false });
      } else {
        this.displayForm.get(field).enable({ emitEvent: false });
      }
    });

    this.displayForm.valueChanges.subscribe((_) => {
      const newDisplayedColumns: TableDisplayOutputType[] = [];
      let trueCount = 0;

      Object.keys(this.displayForm.controls).forEach((key) => {
        if (this.displayForm.get(key).value) {
          newDisplayedColumns.push(key);
          trueCount += 1;
        }
      });

      Object.keys(this.displayForm.controls).forEach((key) => {
        if (trueCount <= 1 && this.displayForm.get(key).value === true) {
          this.displayForm.get(key).disable({ emitEvent: false });
        } else {
          this.displayForm.get(key).enable({ emitEvent: false });
        }
      });

      this.display.emit(newDisplayedColumns);
    });
  }

  public displayAll(): void {
    const controls = {};
    Object.keys(this.displayForm.controls).forEach((field) => {
      controls[field] = true;
    });
    this.displayForm.setValue(controls);
  }

  public onSort(field: string): void {
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

  public onPaginate(page: PageEvent): void {
    this.paginate.emit(page.pageIndex + 1);
  }

  public onItemClick(index: number): void {
    this.itemClick.emit(index);
  }
}
