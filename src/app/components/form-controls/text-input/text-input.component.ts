import { Component, Input, OnInit } from '@angular/core';

import { FormControlComponent } from '../form-control.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent extends FormControlComponent implements OnInit {
  @Input() icon?: string;
  @Input() fieldType?: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() mask?: string;
  @Input() prefix?: string;
  @Input() placeholder?: string;
  @Input() maskDropSpecialCharacters = true;

  type?: 'text' | 'email' | 'password' | 'number';

  ngOnInit(): void {
    this.type = this.fieldType;
  }

  public changePasswordFieldType(): void {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
