import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import { ModalAction } from '../../components/modal/modal.component';
import { IClient } from '../../models/Client';
import { IEmployee } from '../../models/Employee';
import { UserType } from '../../models/enums/UserType';
import { EmployeeRole } from '../../models/enums/EmployeeRole';

@Component({
  template: '',
})
export class ItemPageComponent implements OnInit, OnDestroy {
  /* ------------- */
  /* User settings */
  /* --------------*/
  protected user$: Subscription;
  public userEmployee: IEmployee;
  public userClient: IClient;
  public userType: UserType;
  public userInitCallback: () => void;

  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public itemId: string;
  protected item$: Subscription;
  public item: any;
  protected getItemError$: Subscription;
  public getItemError: string | null;
  protected itemIsFetching$: Subscription;
  public itemIsFetching = true;
  protected itemIsUpdating$: Subscription;
  public itemIsUpdating = false;
  protected itemIsUpdateSucceed$: Subscription;
  protected updateItemError$: Subscription;
  public updateItemError: string | null;
  protected itemIsRemoving$: Subscription;
  public itemIsRemoving = false;
  protected itemIsRemoveSucceed$: Subscription;
  protected removeItemError$: Subscription;
  public removeItemError: string | null;

  /* ------------- */
  /* Form settings */
  /* ------------- */
  public form: FormGroup;
  protected initForm: () => void;
  public activeField: string | null = null;

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  public getItemRequest: (withLoading: boolean) => void;
  public updateItemRequest: () => void;
  public removeItemRequest: () => void;

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  protected createRequest: () => void;

  /* ------------------ */
  /* Interface settings */
  /* ------------------ */
  public isRemoveModalOpen = false;
  protected removeResultSnackbar: MatSnackBarRef<TextOnlySnackBar>;
  protected updateResultSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public userTypeEnum = UserType;
  public employeeRole = EmployeeRole;

  constructor(
    protected store: Store<fromRoot.State>,
    protected router: Router,
    protected route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$ = this.store
      .select(UsersSelectors.selectUserType)
      .pipe(
        switchMap((userType) => {
          this.userType = userType;
          return this.store.select(UsersSelectors.selectUser);
        })
      )
      .subscribe((user) => {
        if (this.userType === UserType.employee) {
          this.userEmployee = user as IEmployee;
        }
        if (this.userType === UserType.client) {
          this.userClient = user as IClient;
        }
        this.userInitCallback?.();
      });

    /* --------------------------- */
    /* Url query params activation */
    /* --------------------------- */
    this.route.paramMap.subscribe((paramMap) => {
      this.setActiveField('');
      this.itemId = paramMap.get('id');
      this.getItemRequest?.(true);
    });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe?.();
    this.item$?.unsubscribe?.();
    this.getItemError$?.unsubscribe?.();
    this.itemIsFetching$?.unsubscribe?.();
    this.itemIsUpdating$?.unsubscribe?.();
    this.itemIsUpdateSucceed$?.unsubscribe?.();
    this.updateItemError$?.unsubscribe?.();
    this.itemIsRemoving$?.unsubscribe?.();
    this.itemIsRemoveSucceed$?.unsubscribe?.();
    this.removeItemError$?.unsubscribe?.();
  }

  public setActiveField(fieldName: string): void {
    this.activeField = fieldName;
  }

  public removeActiveField(fieldName: string, controlValue): void {
    if (this.activeField === fieldName) {
      this.activeField = null;

      this.form?.get(fieldName)?.setValue(controlValue);
    }
  }

  public update(): void {
    if (
      this.activeField &&
      !this.itemIsUpdating &&
      this.form.get(this.activeField).valid
    ) {
      this.updateItemRequest?.();
    }
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
    if (action === 'reject') {
      this.removeItemRequest?.();
    }
  }
}
