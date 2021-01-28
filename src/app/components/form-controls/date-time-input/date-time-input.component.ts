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

  ngOnInit(): void {
    this.formInit();

    if (this.control) {
      if (this.control.value) {
        const controlDate = new Date(this.control.value);

        if (!isNaN(controlDate.getDate())) {
          let hoursString = this.control.value.getHours();
          hoursString = hoursString < 10 ? '0' + hoursString : '' + hoursString;
          let minutesString = this.control.value.getMinutes();
          minutesString =
            minutesString < 10 ? '0' + minutesString : '' + minutesString;
          this.form.setValue({
            date: new Date(controlDate.setHours(0, 0, 0, 0)),
            time: hoursString + ':' + minutesString,
          });
        }
      }
    }
  }

  private formInit(): void {
    this.form = new FormGroup({
      date: new FormControl(''),
      time: new FormControl(''),
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
          const fullDate = dateToSet.setHours(+splitTime[0], +splitTime[1]);

          this.control.setValue(new Date(fullDate));
        }
      } else {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);

        this.form.get('time').setValue('00:00');
        this.control.setValue(new Date(newDate));
      }
    } else {
      this.control.setValue('');
    }
  }
}
