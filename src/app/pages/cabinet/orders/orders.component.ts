import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { tableOrderColumnsData } from '../../../data/tableOrderColumnsData';
import { tableOrderData } from '../../../data/tableOrderData';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public isEmployee: boolean;

  // remove to ngrx
  public totalOrdersCount = 22;
  public totalPagesCount = 3;
  public currentPage = 1;
  public perPage = 10;

  public tableHeaders = tableOrderColumnsData;
  public tableData = tableOrderData;

  public displayedColumns: string[] = ['id'];

  public sorting: { field: string; type: 'asc' | 'desc' } | undefined = {
    field: 'status',
    type: 'asc',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }
  }

  onSort(value: { field: string; type: 'asc' | 'desc' }): void {
    this.sorting = value;
  }
}
