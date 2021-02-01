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
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { ModalAction } from '../../components/modal/modal.component';
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
  protected isRemoving$: Subscription;
  public isRemoving = false;
  protected isRemoveSucceed$: Subscription;
  protected removeError$: Subscription;
  public removeError: string | null;
  protected getItemError$: Subscription;
  public getItemError: string | null;

  public simpleStatus = SimpleStatus;
  public form: FormGroup;
  public activeField: string | null = null;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;
  public isRemoveModalOpen = false;
  public removeModalResolveButton = 'Оставить в архиве';
  public removeModalRejectButton = 'Удалить';
  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;

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
    this.isRemoving$?.unsubscribe?.();
    this.isRemoveSucceed$?.unsubscribe?.();
    this.removeError$?.unsubscribe?.();
    this.getItemError$?.unsubscribe?.();
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

  public onRemoveModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isRemoveModalOpen = false;
        break;
      case 'resolve':
        this.isRemoveModalOpen = false;
        break;
    }
  }

  public enable(): void {
    console.log('enable');
  }

  public disable(): void {
    console.log('disable');
  }

  public update(): void {
    console.log('update');
  }

  public remove(): void {
    console.log('remove');
  }
}
