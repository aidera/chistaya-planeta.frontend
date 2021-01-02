import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent
  extends AbstractFormControlComponent
  implements OnInit {
  @Input() icon?: string;
  @Input() fieldType?: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() mask?: string;
  @Input() prefix?: string;
  @ViewChild('inputRef') inputRef: ElementRef;

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
