import { Component } from '@angular/core';

import { FormControlComponent } from '../form-control.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends FormControlComponent {}
