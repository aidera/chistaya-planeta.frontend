import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/root.reducer';
import * as OrderActions from '../../store/order/order.actions';

@Component({
  selector: 'app-order-succeed',
  templateUrl: './order-succeed.component.html',
  styleUrls: ['./order-succeed.component.scss'],
})
export class OrderSucceedComponent implements OnInit {
  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.store.dispatch(OrderActions.refreshAddOrderSuccess());
  }
}
