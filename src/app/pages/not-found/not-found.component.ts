import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private title: Title, private meta: Meta) {
    title.setTitle('Страница не найдена - Чистая планета');
    meta.addTags([
      {
        name: 'keywords',
        content: 'чистая планета, не надено, страница не найдена',
      },
      {
        name: 'description',
        content:
          'Страница не найдена. Чистая Планета - сохраним природу детям!',
      },
    ]);
  }
}
