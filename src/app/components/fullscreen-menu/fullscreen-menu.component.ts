import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { menuLinksAll } from '../../data/menuLinks_all';
import * as fromRoot from '../../store/root.reducer';
import * as AppSelectors from '../../store/app/app.selectors';

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
  @Input() isEmployee: boolean;
  public menuLinks = menuLinksAll;

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
}
