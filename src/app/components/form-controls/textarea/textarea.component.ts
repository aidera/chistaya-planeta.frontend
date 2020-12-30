import { Component } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent extends AbstractFormControlComponent {}
