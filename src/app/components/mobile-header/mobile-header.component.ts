import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/root.reducer';
import * as AppActions from '../../store/app/app.actions';
import * as AppSelectors from '../../store/app/app.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
  @Input() useBacklink: boolean;
  public isFullscreenMenuOpen = false;
  public isFullscreenMenuOpen$: Subscription;

  constructor(
    private location: Location,
    private store: Store<fromRoot.State>
  ) {}

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

  toggleFullscreenMenu(): void {
    this.store.dispatch(
      AppActions.setIsFullscreenMenuOpen({
        isOpen: !this.isFullscreenMenuOpen,
      })
    );
  }

  goToPreviousPage(): void {
    this.location.back();
  }
}
