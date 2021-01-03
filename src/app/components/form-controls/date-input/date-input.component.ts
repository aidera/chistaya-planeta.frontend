import { Component, Input } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent extends AbstractFormControlComponent {
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  isDatepickerOpen = false;
}
