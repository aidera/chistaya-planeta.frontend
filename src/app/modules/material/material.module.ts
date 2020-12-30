import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';


const modules: any[] = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatTooltipModule
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules],
})

export class MaterialModule {
}
