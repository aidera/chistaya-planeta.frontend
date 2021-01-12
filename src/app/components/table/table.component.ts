import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { TableColumnData } from '../../models/types/TableColumnData';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data: { [key: string]: any }[];
  @Input() columnsData: { [key: string]: TableColumnData };
  @Input() sorting?: { field: string; type: 'asc' | 'desc' };

  @Output() sort = new EventEmitter<{ field: string; type: 'asc' | 'desc' }>();

  public displayedColumns: string[] = [];

  constructor() {}

  ngOnInit(): void {
    Object.keys(this.columnsData).forEach((column) => {
      this.displayedColumns.push(column);
    });
  }

  onSort(field): void {
    let sortType: 'asc' | 'desc' = 'asc';
    if (this.sorting.field === field && this.sorting.type === 'asc') {
      sortType = 'desc';
    }
    this.sort.emit({ field, type: sortType });
  }
}
