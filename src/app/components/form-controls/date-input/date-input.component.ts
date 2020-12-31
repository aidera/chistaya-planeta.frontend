import {Component, Input, OnInit} from '@angular/core';

import {AbstractFormControlComponent} from '../abstract-form-control.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent
  extends AbstractFormControlComponent
  implements OnInit {

  @Input() minDate?: Date;
  @Input() maxDate?: Date;


  ngOnInit(): void {

  }


}
