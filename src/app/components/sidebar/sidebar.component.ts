import { Component, Input } from '@angular/core';

import { menuLinksMain } from '../../data/menuLinks_main';
import { menuLinksSecondary } from '../../data/menuLinks_secondary';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() public isEmployee: boolean;

  public menuLinksMain = menuLinksMain;
  public menuLinksSecondary = menuLinksSecondary;
}
