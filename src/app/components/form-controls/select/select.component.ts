import { Component, Input } from '@angular/core';

import { FormControlComponent } from '../form-control.component';
import { OptionType } from '../../../models/types/OptionType';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends FormControlComponent {
  @Input() options: OptionType[];
  @Input() isMultiple?: boolean;
  @Input() shouldMultipleBeActiveAlLeast?: 1;
}
