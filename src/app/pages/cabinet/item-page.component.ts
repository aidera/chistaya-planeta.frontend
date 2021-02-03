import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import * as fromRoot from '../../store/root.reducer';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';

@Component({
  template: '',
})
export class ItemPageComponent implements OnDestroy {
  protected isFetching$: Subscription;
  public isFetching = true;
  protected isUpdating$: Subscription;
  public isUpdating = false;
  protected isUpdateSucceed$: Subscription;
  protected updateError$: Subscription;
  public updateError: string | null;

  public form: FormGroup;
  public activeField: string | null = null;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    private routingState: RoutingStateService,
    protected socket: SocketIoService
  ) {}

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.isUpdating$?.unsubscribe?.();
    this.isUpdateSucceed$?.unsubscribe?.();
    this.updateError$?.unsubscribe?.();
  }

  public setActiveField(fieldName: string): void {
    this.activeField = fieldName;
  }

  public removeActiveField(fieldName: string, controlValue): void {
    if (this.activeField === fieldName) {
      this.activeField = null;

      this.form?.get(fieldName).setValue(controlValue);
    }
  }

  public goToPreviousPage(): void {
    this.routingState.goToPreviousPage(this.route);
  }
}
