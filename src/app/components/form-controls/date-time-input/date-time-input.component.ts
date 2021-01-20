import { Component, Input, OnInit } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';

@Component({
  selector: 'app-date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
})
export class DateTimeInputComponent
  extends AbstractFormControlComponent
  implements OnInit {
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  public dateValue;
  public timeValue;

  ngOnInit(): void {
    let initialValue;
    if ((this.control && this.control.value) || this.value) {
      if (this.control && this.control.value) {
        initialValue = new Date(this.control.value);
      }
      if (this.value) {
        initialValue = new Date(this.value);
      }
      this.dateValue = new Date(initialValue.setHours(0, 0, 0, 0));
      let hoursString = this.control.value.getHours();
      hoursString = '' + hoursString;
      let minutesString = this.control.value.getMinutes();
      minutesString =
        minutesString < 10 ? '0' + minutesString : '' + minutesString;
      this.timeValue = hoursString + ':' + minutesString;
    }
  }

  onDateChange(value): void {
    this.dateValue = value;
    this.setDateTime(value, this.timeValue);
  }

  onTimeChange(value: string): void {
    this.setDateTime(this.dateValue, value);
  }

  setDateTime(date: Date, time: string): void {
    const dateToSet = new Date(date);
    if (date) {
      if (time) {
        const splitTime = time.split(':');
        if (
          splitTime.length > 1 &&
          splitTime[0].length > 0 &&
          splitTime[1].length > 1
        ) {
          this.timeValue = time;
          const fullDate = dateToSet.setHours(+splitTime[0], +splitTime[1]);
          this.control.setValue(new Date(fullDate));
        }
      } else {
        this.control.setValue(new Date(date));
      }
    } else {
      this.control.setValue('');
      this.timeValue = undefined;
    }
  }
}
