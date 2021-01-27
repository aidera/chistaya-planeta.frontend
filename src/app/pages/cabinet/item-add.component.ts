import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import * as fromRoot from '../../store/root.reducer';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class ItemAddComponent implements OnDestroy {
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
    protected location: Location,
    protected snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    if (this.isFetching$) {
      this.isFetching$.unsubscribe();
    }
    if (this.serverError$) {
      this.serverError$.unsubscribe();
    }
    if (this.addingSucceed$) {
      this.addingSucceed$.unsubscribe();
    }
  }

  protected setActiveForm(formNumber: number): void {
    this.activeForm = formNumber;
  }

  public goToPreviousPage(): void {
    this.location.back();
  }
}
