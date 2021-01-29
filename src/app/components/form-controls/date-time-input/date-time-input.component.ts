import { Component, Input, OnInit } from '@angular/core';

import { FormControlComponent } from '../form-control.component';
import { FormControl, FormGroup } from '@angular/forms';

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

  public form: FormGroup;

  static getTimeFromString(timeString): { hours: number; minutes: number } {
    const splitTime = timeString.split(':');
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
      return {
        hours: +splitTime[0],
        minutes: +splitTime[1],
      };
    } else {
      return {
        hours: 0,
        minutes: 0,
      };
    }
  }

  static getTimelessDate(dateTime): Date | string {
    const newDate = new Date(dateTime);
    if (!isNaN(newDate.getDate())) {
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    } else {
      return '';
    }
  }

  static getTimeString(dateTime): string {
    const newDate = new Date(dateTime);
    if (!isNaN(newDate.getDate())) {
      let hoursString = dateTime.getHours();
      hoursString = hoursString < 10 ? '0' + hoursString : '' + hoursString;
      let minutesString = dateTime.getMinutes();
      minutesString =
        minutesString < 10 ? '0' + minutesString : '' + minutesString;

      return hoursString + ':' + minutesString;
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    if (this.control && this.control.value) {
      const date = DateTimeInputComponent.getTimelessDate(this.control.value);
      const time = DateTimeInputComponent.getTimeString(this.control.value);
      this.formInit({ date, time });
    } else {
      this.formInit({ date: '', time: '' });
    }

    this.control.valueChanges.subscribe((newMainControlValue) => {
      if (
        !newMainControlValue &&
        this.form.get('date').value !== '' &&
        this.form.get('time').value !== ''
      ) {
        this.form.setValue({
          date: '',
          time: '',
        });
      }
    });
  }

  private formInit(initFormData: { date: Date | string; time: string }): void {
    this.form = new FormGroup({
      date: new FormControl(initFormData.date),
      time: new FormControl(initFormData.time),
    });

    this.form.get('date').valueChanges.subscribe((fieldValue) => {
      this.setDateTime(fieldValue, this.form.get('time').value);
      if (this.form.get('time').value === '') {
        this.form.get('time').setValue('00:00');
      }
    });

    this.form.get('time').valueChanges.subscribe((fieldValue) => {
      this.setDateTime(this.form.get('date').value, fieldValue);
    });
  }

  private setDateTime(date: Date, time: string): void {
    const mainControlTimelessDate = DateTimeInputComponent.getTimelessDate(
      this.control.value
    );
    const mainControlTimeString = DateTimeInputComponent.getTimeString(
      this.control.value
    );

    if (date !== mainControlTimelessDate || time !== mainControlTimeString) {
      const dateToSet = new Date(date);
      if (date) {
        if (time) {
          const extractedTime = DateTimeInputComponent.getTimeFromString(time);
          const fullDate = dateToSet.setHours(
            extractedTime.hours,
            extractedTime.minutes
          );

          if (this.control.value !== new Date(fullDate)) {
            this.control.setValue(new Date(fullDate));
          }
        } else {
          const newDate = new Date(date);
          newDate.setHours(0, 0, 0, 0);

          if (this.form.get('time').value !== '00:00') {
            this.form.get('time').setValue('00:00');
          }
          if (this.control.value !== new Date(newDate)) {
            this.control.setValue(new Date(newDate));
          }
        }
      }
    } else {
      if (this.control.value !== '') {
        this.control.setValue('');
      }
    }
  }
}
