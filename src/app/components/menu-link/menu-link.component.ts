import { Component, Input } from '@angular/core';
import { MenuLink } from '../../models/types/MenuLink';

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
})
export class MenuLinkComponent {
  @Input() menuLink: MenuLink;
}
