import { Component, Input } from '@angular/core';

import { menuLinksMain, menuLinksSecondary } from '../../data/menuLinks';

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
