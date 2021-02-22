import { Component } from '@angular/core';
import { PhonePipe } from '../../../../pipes/phone.pipe';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  providers: [PhonePipe],
})
export class OrdersTableComponent {}
