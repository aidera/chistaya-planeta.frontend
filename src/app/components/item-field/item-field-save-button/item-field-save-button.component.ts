import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-field-save-button',
  templateUrl: './item-field-save-button.component.html',
  styleUrls: ['./item-field-save-button.component.scss'],
})
export class ItemFieldSaveButtonComponent {
  @Input() isUpdating: boolean;
  @Input() disable: boolean;

  @Output() update = new EventEmitter();
}
