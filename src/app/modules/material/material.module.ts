import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

const modules: any[] = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatPaginatorModule,
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }],
})
export class MaterialModule {}
