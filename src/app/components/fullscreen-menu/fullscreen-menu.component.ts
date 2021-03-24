import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { menuLinksAll } from '../../data/menuLinks';
import * as fromRoot from '../../store/root.reducer';
import * as AppSelectors from '../../store/app/app.selectors';
import * as UsersSelectors from '../../store/users/users.selectors';
import { IEmployee } from '../../models/Employee';
import { IClient } from '../../models/Client';
import { UserType } from '../../models/enums/UserType';

@Component({
  selector: 'app-fullscreen-menu',
  templateUrl: './fullscreen-menu.component.html',
  styleUrls: ['./fullscreen-menu.component.scss'],
  animations: [
    trigger('fullscreen-menu', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(1.2)' }),
        animate('250ms ease-in-out'),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '250ms ease-in-out',
          style({ opacity: 0, transform: 'scale(1.2)' })
        ),
      ]),
    ]),
  ],
})
export class FullscreenMenuComponent implements OnInit, OnDestroy {
  protected user$: Subscription;
  protected userType$: Subscription;
  public user: IEmployee | IClient;
  public userType: UserType;

  public menuLinks = menuLinksAll;

  public isFullscreenMenuOpen = false;
  public isFullscreenMenuOpen$: Subscription;

  public userTypeEnum = UserType;

  constructor(private store: Store<fromRoot.State>) {}

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

    this.isFullscreenMenuOpen$ = this.store
      .select(AppSelectors.selectIsFullScreenMenuOpen)
      .subscribe((status) => {
        this.isFullscreenMenuOpen = status;
        if (status) {
          document.querySelector('body').style.overflowY = 'hidden';
        } else {
          document.querySelector('body').style.overflowY = 'auto';
        }
      });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe?.();
    this.userType$?.unsubscribe?.();
    this.isFullscreenMenuOpen$?.unsubscribe();
  }
}
