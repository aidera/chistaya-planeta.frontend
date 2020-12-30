import { Component } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends AbstractFormControlComponent {}
