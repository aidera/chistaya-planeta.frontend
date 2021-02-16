import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-not-found',
  templateUrl: './item-not-found.component.html',
  styleUrls: ['./item-not-found.component.scss'],
})
export class ItemNotFoundComponent {
  @Input() title = 'Страница не найдена';
  @Input() description = 'К сожалению, этой страницы мы не нашли...';
}
