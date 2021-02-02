import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../store/root.reducer';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';

@Component({
  template: '',
})
export class ItemAddPageComponent implements OnDestroy {
  protected isFetching$: Subscription;
  public isFetching = false;
  protected serverError$: Subscription;
  public serverError: string;
  protected addingSucceed$: Subscription;

  protected addSnackbar: MatSnackBarRef<TextOnlySnackBar>;
  public activeForm = 1;

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    private routingState: RoutingStateService
  ) {}

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
    this.addingSucceed$?.unsubscribe?.();
  }

  protected setActiveForm(formNumber: number): void {
    this.activeForm = formNumber;
    const formToScroll = document.querySelector(`#form${formNumber}`);
    if (formToScroll) {
      const formOffset = formToScroll.getBoundingClientRect().top;
      window.scrollTo({
        top: formOffset + window.pageYOffset - 24,
        behavior: 'smooth',
      });
    }
  }

  public goToPreviousPage(): void {
    this.routingState.goToPreviousPage(this.route);
  }
}
