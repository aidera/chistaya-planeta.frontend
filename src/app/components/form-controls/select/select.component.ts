import { Component, Input } from '@angular/core';

import { AbstractFormControlComponent } from '../abstract-form-control.component';
import { OptionType } from '../../../models/types/OptionType';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends AbstractFormControlComponent {
  @Input() options: OptionType[];
  @Input() isMultiple?: boolean;
  @Input() shouldMultipleBeActiveAlLeast?: 1;
}
