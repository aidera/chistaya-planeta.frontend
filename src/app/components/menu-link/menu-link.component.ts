import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuLink } from '../../models/types/MenuLink';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/root.reducer';
import * as AppSelectors from '../../store/app/app.selectors';
import * as AppActions from '../../store/app/app.actions';

@Component({
  selector: 'app-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.scss'],
})
export class MenuLinkComponent implements OnInit, OnDestroy {
  @Input() menuLink: MenuLink;
  @Input() isEmployee: boolean;

  public isFullscreenMenuOpen = false;
  public isFullscreenMenuOpen$: Subscription;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isFullscreenMenuOpen$ = this.store
      .select(AppSelectors.selectIsFullScreenMenuOpen)
      .subscribe((status) => {
        this.isFullscreenMenuOpen = status;
      });
  }

  ngOnDestroy(): void {
    if (this.isFullscreenMenuOpen$) {
      this.isFullscreenMenuOpen$.unsubscribe();
    }
  }

  closeFullscreenMenu(): void {
    this.store.dispatch(AppActions.setIsFullscreenMenuOpen({ isOpen: false }));
  }
}
