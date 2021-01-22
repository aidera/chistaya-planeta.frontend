import { Component, Input, OnInit } from '@angular/core';

import { FormControlComponent } from '../form-control.component';

@Component({
  selector: 'app-date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
})
export class DateTimeInputComponent
  extends FormControlComponent
  implements OnInit {
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  public dateValue;
  public timeValue = '';

  ngOnInit(): void {
    let initialValue;
    if (this.control || this.value !== undefined) {
      if (this.control) {
        initialValue = new Date(this.control.value);
        if (isFinite(initialValue)) {
          this.dateValue = new Date(initialValue.setHours(0, 0, 0, 0));
          let hoursString = this.control.value.getHours();
          hoursString = '' + hoursString;
          let minutesString = this.control.value.getMinutes();
          minutesString =
            minutesString < 10 ? '0' + minutesString : '' + minutesString;
          this.timeValue = hoursString + ':' + minutesString;
        }
      }
      if (this.value !== undefined) {
        initialValue = new Date(this.value);
        if (isFinite(initialValue)) {
          this.dateValue = new Date(initialValue.setHours(0, 0, 0, 0));
          let hoursString = this.value.getHours();
          hoursString = '' + hoursString;
          let minutesString = this.value.getMinutes();
          minutesString =
            minutesString < 10 ? '0' + minutesString : '' + minutesString;
          this.timeValue = hoursString + ':' + minutesString;
        }
      }
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
          splitTime &&
          splitTime.length > 1 &&
          splitTime[0].length > 0 &&
          splitTime[1].length > 1 &&
          +splitTime[0] < 24 &&
          +splitTime[0] >= 0 &&
          +splitTime[1] < 60 &&
          +splitTime[1] >= 0
        ) {
          this.timeValue = time;
          const fullDate = dateToSet.setHours(+splitTime[0], +splitTime[1]);
          if (this.control) {
            this.control.setValue(new Date(fullDate));
          }
          if (this.value !== undefined) {
            this.valueChange.emit(new Date(fullDate));
          }
        }
      } else {
        this.timeValue = '00:00';
        if (this.control) {
          this.control.setValue(new Date(date));
        }
        if (this.value !== undefined) {
          this.valueChange.emit(new Date(date));
        }
      }
    } else {
      if (this.control) {
        this.control.setValue('');
      }
      if (this.value !== undefined) {
        this.valueChange.emit('');
      }
      this.timeValue = '';
    }
  }
}
