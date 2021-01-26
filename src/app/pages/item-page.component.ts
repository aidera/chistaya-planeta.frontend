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
import { Location } from '@angular/common';

import * as fromRoot from '../store/root.reducer';
import { SimpleStatus } from '../models/enums/SimpleStatus';

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

  public simpleStatus = SimpleStatus;
  public form: FormGroup;
  public activeField: string | null = null;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

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
    if (this.isUpdating$) {
      this.isUpdating$.unsubscribe();
    }
    if (this.isUpdateSucceed$) {
      this.isUpdateSucceed$.unsubscribe();
    }
    if (this.updateError$) {
      this.updateError$.unsubscribe();
    }
  }

  setActiveField(fieldName: string): void {
    this.activeField = fieldName;
  }

  removeActiveField(fieldName: string, controlValue): void {
    if (this.activeField === fieldName) {
      this.activeField = null;

      if (this.form) {
        this.form.get(fieldName).setValue(controlValue);
      }
    }
  }

  goToPreviousPage(): void {
    this.location.back();
  }

  enable(): void {
    console.log('enable');
  }

  disable(): void {
    console.log('disable');
  }

  update(): void {
    console.log('update');
  }

  remove(): void {
    console.log('remove');
  }
}
