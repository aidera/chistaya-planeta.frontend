import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextColor } from '../../../models/types/TextColor';

@Component({
  selector: 'app-item-field-inactive-status',
  templateUrl: './item-field-inactive-status.component.html',
  styleUrls: ['./item-field-inactive-status.component.scss'],
})
export class ItemFieldInactiveStatusComponent {
  @Input() content: string;
  @Input() isFetching: boolean;
  @Input() color: TextColor;
  @Input() useEditButton = false;

  @Output() editClick = new EventEmitter();
}
