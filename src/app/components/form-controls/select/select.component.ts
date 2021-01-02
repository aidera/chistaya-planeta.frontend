import { Component, Input, OnInit } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';
import { OptionType } from '../../../models/OptionType';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent
  extends AbstractFormControlComponent
  implements OnInit {
  @Input() options: OptionType[];
  @Input() value: string | string[];
  @Input() isMultiple?: boolean;

  ngOnInit(): void {}
}
