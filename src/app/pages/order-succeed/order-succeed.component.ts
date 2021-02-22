import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/root.reducer';
import * as OrdersActions from '../../store/orders/orders.actions';

@Component({
  selector: 'app-order-succeed',
  templateUrl: './order-succeed.component.html',
  styleUrls: ['./order-succeed.component.scss'],
})
export class OrderSucceedComponent implements OnInit {
  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.store.dispatch(OrdersActions.refreshAddOrderSucceed());
  }
}
