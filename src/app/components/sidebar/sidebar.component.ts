import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import { menuLinksMain, menuLinksSecondary } from '../../data/menuLinks';
import { IEmployee } from '../../models/Employee';
import { IClient } from '../../models/Client';
import { UserType } from '../../models/enums/UserType';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  protected user$: Subscription;
  protected userType$: Subscription;
  public user: IEmployee | IClient;
  public userType: UserType;

  public menuLinksMain = menuLinksMain;
  public menuLinksSecondary = menuLinksSecondary;

  public userTypeEnum = UserType;

  constructor(protected store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.user$ = this.store
      .select(UsersSelectors.selectUser)
      .subscribe((user) => {
        this.user = user;
      });
    this.userType$ = this.store
      .select(UsersSelectors.selectUserType)
      .subscribe((type) => {
        this.userType = type;
      });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe?.();
    this.userType$?.unsubscribe?.();
  }
}
