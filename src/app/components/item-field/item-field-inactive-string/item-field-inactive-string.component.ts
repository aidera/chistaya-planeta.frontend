import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextColor } from '../../../models/types/TextColor';

@Component({
  selector: 'app-item-field-inactive-string',
  templateUrl: './item-field-inactive-string.component.html',
  styleUrls: ['./item-field-inactive-string.component.scss'],
})
export class ItemFieldInactiveStringComponent {
  @Input() label: string;
  @Input() content: string;
  @Input() color: TextColor;
  @Input() linkArray: string[];
  @Input() isFetching: boolean;
  @Input() useEditButton = false;

  @Output() editClick = new EventEmitter();
}
