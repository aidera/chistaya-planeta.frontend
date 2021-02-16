import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextColor } from '../../../models/types/TextColor';

export type ItemFieldListElement = {
  linkArray: string[];
  color: TextColor;
  text: string;
};

@Component({
  selector: 'app-item-field-inactive-list',
  templateUrl: './item-field-inactive-list.component.html',
  styleUrls: ['./item-field-inactive-list.component.scss'],
})
export class ItemFieldInactiveListComponent {
  @Input() label: string;
  @Input() list: ItemFieldListElement[];
  @Input() hint?: string;
  @Input() moreLinkArray: string[];
  @Input() moreLinkQueryParams: { [key: string]: string };
  @Input() isFetching: boolean;

  @Input() useAddButton = false;
  @Input() addLinkArray: string[];
  @Input() addLinkQueryParams: { [key: string]: string };

  @Input() useEditButton = false;

  @Output() editClick = new EventEmitter();
}
