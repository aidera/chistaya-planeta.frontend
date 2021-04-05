import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import { IEmployee } from '../../models/Employee';
import { IClient } from '../../models/Client';
import { UserType } from '../../models/enums/UserType';

@Component({
  template: '',
})
export class ItemAddPageComponent implements OnInit, OnDestroy {
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
  protected isFetching$: Subscription;
  public isFetching = false;
  protected serverError$: Subscription;
  public serverError: string;
  protected addingSucceed$: Subscription;

  /* ------------- */
  /* Form settings */
  /* ------------- */
  public form: FormGroup;
  protected initForm: () => void;

  /* ------------------------- */
  /* Url query params settings */
  /* ------------------------- */
  public isQueryLocalityId = false;
  public queryLocalityId: string;
  public isQueryDivisionId = false;
  public queryDivisionId: string;

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  protected createRequest: () => void;

  /* ------------------ */
  /* Interface settings */
  /* ------------------ */
  protected addResultSnackbar: MatSnackBarRef<TextOnlySnackBar>;

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
    this.route.queryParams.subscribe((params) => {
      if (params.locality && params.division) {
        this.isQueryLocalityId = true;
        this.queryLocalityId = params.locality;
        this.isQueryDivisionId = true;
        this.queryDivisionId = params.division;
      } else if (params.locality) {
        this.isQueryLocalityId = true;
        this.queryLocalityId = params.locality;
      }
    });

    this.initForm?.();
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe?.();
    this.isFetching$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
    this.addingSucceed$?.unsubscribe?.();
  }

  public scrollToInvalidField(): void {
    /* Use fields ID's to scroll */
    /* Fields ID's should be equal it's form control name */
    let hasOneElementToScroll = false;

    Object.keys(this.form?.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control.errors && !hasOneElementToScroll) {
        hasOneElementToScroll = true;

        const fieldId = document.getElementById(field);
        if (fieldId) {
          const fieldOffset = fieldId.getBoundingClientRect().top;

          window.scrollTo({
            top: fieldOffset + window.pageYOffset - window.innerHeight / 2,
            behavior: 'smooth',
          });
        }
      }
    });
  }

  public sendForm(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.form?.valid) {
      this.createRequest();
    } else {
      this.scrollToInvalidField();
    }
  }
}
