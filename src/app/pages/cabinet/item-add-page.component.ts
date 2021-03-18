import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

import * as fromRoot from '../../store/root.reducer';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ConverterService } from '../../services/converter/converter.service';
import { LocalitiesApiService } from '../../services/api/localities-api.service';
import { DivisionsApiService } from '../../services/api/divisions-api.service';
import { CarsApiService } from '../../services/api/cars-api.service';
import { EmployeesApiService } from '../../services/api/employees-api.service';
import { OptionsService } from '../../services/options/options.service';
import { IEmployee } from '../../models/Employee';
import IClient from '../../models/Client';
import { UserType } from '../../models/enums/UserType';
import * as UsersSelectors from '../../store/users/users.selectors';
import { switchMap } from 'rxjs/operators';

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
  //
  protected addSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  /* ------------- */
  /* Form settings */
  /* ------------- */
  public form: FormGroup;
  protected initForm: () => void;
  public alreadyExistId: string;

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

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    protected socket: SocketIoService,
    protected converter: ConverterService,
    protected localitiesApi: LocalitiesApiService,
    protected divisionsApi: DivisionsApiService,
    protected carsApi: CarsApiService,
    protected employeesApi: EmployeesApiService,
    protected options: OptionsService
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
