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
      const setTime = (value) => {
        if (isFinite(initialValue)) {
          this.dateValue = new Date(initialValue.setHours(0, 0, 0, 0));
          let hoursString = value.getHours();
          hoursString = hoursString < 10 ? '0' + hoursString : '' + hoursString;
          let minutesString = value.getMinutes();
          minutesString =
            minutesString < 10 ? '0' + minutesString : '' + minutesString;
          this.timeValue = hoursString + ':' + minutesString;
        }
      };
      if (this.control) {
        this.control.valueChanges.subscribe((next) => {
          if (next) {
            initialValue = new Date(this.control.value);
            setTime(this.control.value);
          } else {
            this.dateValue = undefined;
            this.timeValue = '';
          }
        });
      }
      if (this.value !== undefined) {
        if (this.value) {
          initialValue = new Date(this.value);
          setTime(this.value);
        } else {
          this.dateValue = undefined;
          this.timeValue = '';
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
          const newDate = new Date(date);
          newDate.setHours(0, 0, 0, 0);
          this.control.setValue(newDate);
        }
        if (this.value !== undefined) {
          const newDate = new Date(date);
          newDate.setHours(0, 0, 0, 0);
          this.valueChange.emit(newDate);
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
