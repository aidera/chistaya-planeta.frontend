import { Component, OnInit } from '@angular/core';
import { FormControlComponent } from '../form-control.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-from-to-input',
  templateUrl: './number-from-to-input.component.html',
  styleUrls: ['./number-from-to-input.component.scss'],
})
export class NumberFromToInputComponent
  extends FormControlComponent
  implements OnInit {
  public form: FormGroup;

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = new FormGroup({
      number1: new FormControl(this.control.value[0]),
      number2: new FormControl(this.control.value[1]),
    });

    this.form?.valueChanges.subscribe((fieldValues) => {
      if (fieldValues.number1 === '' && fieldValues.number2 === '') {
        this.control.setValue('');
      } else if (fieldValues.number2 === '') {
        this.control.setValue([fieldValues.number1, null]);
      } else if (fieldValues.number1 === '') {
        this.control.setValue([null, fieldValues.number2]);
      } else {
        this.control.setValue([fieldValues.number1, fieldValues.number2]);
      }
    });

    if (this.control.value[0] === '') {
      this.control.setValue([null, this.control.value[1]]);
    }
    if (this.control.value[1] === '') {
      this.control.setValue([this.control.value[0], null]);
    }
  }
}
