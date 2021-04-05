import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Title, Meta } from '@angular/platform-browser';

import * as fromRoot from '../../store/root.reducer';
import * as OrdersActions from '../../store/orders/orders.actions';

@Component({
  selector: 'app-order-succeed',
  templateUrl: './order-succeed.component.html',
  styleUrls: ['./order-succeed.component.scss'],
})
export class OrderSucceedComponent implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
    private store: Store<fromRoot.State>
  ) {
    title.setTitle('Заявка успешно отправлена - Чистая планета');
    meta.addTags([
      {
        name: 'keywords',
        content:
          'чистая планета, заявка отправлена, успешная заявка, заявка оставлена',
      },
      {
        name: 'description',
        content:
          'Спасибо за Вашу заявку! Наш менеджер свяжется с Вами в скором времени для подтверждения. Чистая Планета - сохраним природу детям!',
      },
    ]);
  }

  ngOnInit(): void {
    this.store.dispatch(OrdersActions.refreshAddOrderSucceed());
  }
}
