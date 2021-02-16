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
import * as AppSelectors from '../../store/app/app.selectors';
import * as AppActions from '../../store/app/app.actions';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ConverterService } from '../../services/converter/converter.service';
import { LocalityService } from '../../services/api/locality.service';
import { DivisionService } from '../../services/api/division.service';
import { CarService } from '../../services/api/car.service';
import { EmployeeService } from '../../services/api/employee.service';
import { ILocalityLessInfo } from '../../models/Locality';
import { OptionType } from '../../models/types/OptionType';
import { IDivisionLessInfo } from '../../models/Division';
import { ICarLessInfo } from '../../models/Car';
import { IEmployeeLessInfo } from '../../models/Employee';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import CarStatus from '../../models/enums/CarStatus';
import EmployeeStatus from '../../models/enums/EmployeeStatus';

@Component({
  template: '',
})
export class ItemAddPageComponent implements OnInit, OnDestroy {
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
  /* Options settings */
  /* ---------------- */
  protected useLocalitiesOptions = true;
  private localitiesToSelect$: Subscription;
  public localitiesToSelect: ILocalityLessInfo[];
  protected localitiesToSelectCallback: (
    localitiesToSelect: ILocalityLessInfo[]
  ) => void;
  public localitiesOptions: OptionType[] = [];
  //
  protected useDivisionsOptions = true;
  private divisionsToSelect$: Subscription;
  public divisionsToSelect: IDivisionLessInfo[];
  protected divisionsToSelectCallback: (
    divisionsToSelect: IDivisionLessInfo[]
  ) => void;
  public divisionsOptions: OptionType[] = [];
  //
  protected useCarsOptions = true;
  private carsToSelect$: Subscription;
  public carsToSelect: ICarLessInfo[];
  protected carsToSelectCallback: (carsToSelect: ICarLessInfo[]) => void;
  public carsOptions: OptionType[] = [];
  //
  protected useEmployeesOptions = true;
  private employeesToSelect$: Subscription;
  public employeesToSelect: IEmployeeLessInfo[];
  protected employeesToSelectCallback: (
    employeesToSelect: IEmployeeLessInfo[]
  ) => void;
  public employeesOptions: OptionType[] = [];

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  protected createRequest: () => void;

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    protected routingState: RoutingStateService,
    protected socket: SocketIoService,
    protected converter: ConverterService,
    protected localityApi: LocalityService,
    protected divisionApi: DivisionService,
    protected carApi: CarService,
    protected employeeApi: EmployeeService
  ) {}

  ngOnInit(): void {
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

    /* ---------------- */
    /* Options requests */
    /* ---------------- */

    /* Localities */
    if (this.useLocalitiesOptions) {
      this.localitiesToSelect$ = this.store
        .select(AppSelectors.selectLocalitiesToSelect)
        .subscribe((localitiesToSelect) => {
          this.localitiesToSelect = localitiesToSelect;
          if (localitiesToSelect) {
            this.localitiesToSelect = localitiesToSelect?.filter(
              (el) => el.status !== SimpleStatus.inactive
            );
          }
          this.localitiesOptions = [];
          this.localitiesToSelect?.forEach((el) => {
            if (el.status !== SimpleStatus.inactive) {
              this.localitiesOptions.push({ text: el.name, value: el._id });
            }
          });
          this.localitiesToSelectCallback?.(localitiesToSelect);
        });

      if (this.localitiesToSelect === null) {
        this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
      }

      this.socket.get()?.on('localities', (_) => {
        this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
      });
    }

    /* Divisions */
    if (this.useDivisionsOptions) {
      this.divisionsToSelect$ = this.store
        .select(AppSelectors.selectDivisionsToSelect)
        .subscribe((divisionsToSelect) => {
          this.divisionsToSelect = divisionsToSelect;
          if (divisionsToSelect) {
            this.divisionsToSelect = divisionsToSelect.filter(
              (el) => el.status !== SimpleStatus.inactive
            );
          }
          this.updateDivisionsOptions();
          this.divisionsToSelectCallback?.(divisionsToSelect);
        });

      if (this.divisionsToSelect === null) {
        this.store.dispatch(AppActions.getDivisionsToSelectRequest());
      }

      this.socket.get()?.on('divisions', (_) => {
        this.store.dispatch(AppActions.getDivisionsToSelectRequest());
      });
    }

    /* Cars */
    if (this.useCarsOptions) {
      this.carsToSelect$ = this.store
        .select(AppSelectors.selectCarsToSelect)
        .subscribe((carsToSelect) => {
          this.carsToSelect = carsToSelect;
          if (carsToSelect) {
            this.carsToSelect = carsToSelect.filter(
              (el) => el.status !== CarStatus.unavailable
            );
          }
          this.updateCarsOptions();
          this.carsToSelectCallback?.(carsToSelect);
        });

      if (this.carsToSelect === null) {
        this.store.dispatch(AppActions.getCarsToSelectRequest());
      }

      this.socket.get()?.on('cars', (_) => {
        this.store.dispatch(AppActions.getCarsToSelectRequest());
      });
    }

    /* Employees */
    if (this.useEmployeesOptions) {
      this.employeesToSelect$ = this.store
        .select(AppSelectors.selectEmployeesToSelect)
        .subscribe((employeesToSelect) => {
          this.employeesToSelect = employeesToSelect;
          if (employeesToSelect) {
            this.employeesToSelect = employeesToSelect.filter(
              (el) => el.status !== EmployeeStatus.fired
            );
          }
          this.updateEmployeesOptions();
          this.employeesToSelectCallback?.(employeesToSelect);
        });

      if (this.employeesToSelect === null) {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      }

      this.socket.get()?.on('employees', (_) => {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      });
    }

    /* Listening for localities form field value change to update divisions, cars and employees */
    this.form?.get('locality')?.valueChanges.subscribe((_) => {
      this.updateDivisionsOptions();
      this.updateDivisionsValue();
    });

    /* Listening for divisions form field value change to update cars and employees */
    this.form?.get('division')?.valueChanges.subscribe((_) => {
      this.updateCarsOptions();
      this.updateCarsValue();
      this.updateEmployeesOptions();
      this.updateEmployeesValue();
    });
    this.form?.get('divisions')?.valueChanges.subscribe((_) => {
      this.updateCarsOptions();
      this.updateCarsValue();
      this.updateEmployeesOptions();
      this.updateEmployeesValue();
    });
  }

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.serverError$?.unsubscribe?.();
    this.addingSucceed$?.unsubscribe?.();

    this.localitiesToSelect$?.unsubscribe?.();
    this.divisionsToSelect$?.unsubscribe?.();
    this.carsToSelect$?.unsubscribe?.();
    this.employeesToSelect$?.unsubscribe?.();

    this.socket?.get()?.off('localities');
    this.socket?.get()?.off('divisions');
    this.socket?.get()?.off('cars');
    this.socket?.get()?.off('employees');
  }

  protected updateDivisionsOptions(): void {
    const localityValue = this.form?.get('locality')?.value;

    this.divisionsOptions = [];
    this.divisionsToSelect?.forEach((el) => {
      if (localityValue) {
        if (localityValue === el.locality) {
          this.divisionsOptions.push({ text: el.name, value: el._id });
        }
      } else {
        this.divisionsOptions.push({ text: el.name, value: el._id });
      }
    });
  }

  protected updateDivisionsValue(): void {
    if (this.form?.get('division')) {
      if (this.divisionsOptions.length === 1) {
        this.form.get('division').setValue(this.divisionsOptions[0].value);
      } else {
        this.form.get('division').setValue('');
      }
    }

    if (this.form?.get('divisions')) {
      const localityValue = this.form?.get('locality')?.value;
      if (localityValue) {
        this.divisionsOptions = [];
        this.divisionsToSelect?.forEach((el) => {
          if (el.locality === localityValue) {
            this.divisionsOptions.push({
              value: el._id,
              text: el.name,
            });
          }
        });

        if (this.divisionsOptions.length === 1) {
          this.form.get('divisions').setValue([this.divisionsOptions[0].value]);
        } else {
          this.form.get('divisions').setValue([]);
        }
      } else {
        this.form.get('divisions').setValue([]);
      }
    }
  }

  protected updateCarsOptions(): void {
    const divisionsValue = this.form?.get('divisions')?.value;
    const divisionValue = this.form?.get('division')?.value;

    this.carsOptions = [];

    if (divisionValue) {
      this.carsToSelect?.forEach((el) => {
        if (el.divisions.includes(divisionValue)) {
          this.carsOptions.push({ text: el.licensePlate, value: el._id });
        }
      });
    }
    if (divisionsValue) {
      this.carsToSelect?.forEach((el) => {
        if (divisionsValue.length > 0) {
          if (divisionsValue.some((ai) => el.divisions.includes(ai))) {
            this.carsOptions.push({ text: el.licensePlate, value: el._id });
          }
        }
      });
    }
  }

  protected updateCarsValue(): void {
    this.form?.get('cars')?.setValue([]);
  }

  protected updateEmployeesOptions(): void {
    const divisionsValue = this.form?.get('divisions')?.value || [];

    this.employeesOptions = [];

    this.employeesToSelect?.forEach((el) => {
      if (divisionsValue.length > 0) {
        if (divisionsValue.includes(el.division)) {
          this.employeesOptions.push({
            text: this.converter.getUserInitials(
              el.name,
              el.surname,
              el.patronymic
            ),
            value: el._id,
          });
        }
      } else {
        this.employeesOptions.push({
          text: this.converter.getUserInitials(
            el.name,
            el.surname,
            el.patronymic
          ),
          value: el._id,
        });
      }
    });
  }

  protected updateEmployeesValue(): void {
    this.form?.get('employees')?.setValue([]);
  }

  public goToPreviousPage(): void {
    this.routingState.goToPreviousPage(this.route);
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
