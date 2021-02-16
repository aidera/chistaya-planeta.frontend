import { Component, OnDestroy, OnInit } from '@angular/core';
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
import * as AppSelectors from '../../store/app/app.selectors';
import * as AppActions from '../../store/app/app.actions';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ConverterService } from '../../services/converter/converter.service';
import { ILocality, ILocalityLessInfo } from '../../models/Locality';
import { OptionType } from '../../models/types/OptionType';
import { IDivision, IDivisionLessInfo } from '../../models/Division';
import { ICar, ICarLessInfo } from '../../models/Car';
import { IEmployee, IEmployeeLessInfo } from '../../models/Employee';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import CarStatus from '../../models/enums/CarStatus';
import EmployeeStatus from '../../models/enums/EmployeeStatus';
import { ModalAction } from '../../components/modal/modal.component';
import { LocalitiesApiService } from '../../services/api/localities-api.service';
import { DivisionsApiService } from '../../services/api/divisions-api.service';
import { CarsApiService } from '../../services/api/cars-api.service';
import { EmployeesApiService } from '../../services/api/employees-api.service';
import { TextColor } from '../../models/types/TextColor';
import { ItemFieldListElement } from '../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import EmployeeRole from '../../models/enums/EmployeeRole';

@Component({
  template: '',
})
export class ItemPageComponent implements OnInit, OnDestroy {
  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public itemId: string;
  //
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
  //
  public isRemoveModalOpen = false;
  //
  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;
  //
  public statusString: string;
  public statusColor: TextColor;
  //
  public alreadyExistId: string;

  /* ------------- */
  /* Form settings */
  /* ------------- */
  public form: FormGroup;
  protected initForm: () => void;
  public activeField: string | null = null;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  public getItemRequest: (withLoading: boolean) => void;
  public updateItemRequest: () => void;
  public removeItemRequest: () => void;

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
    private routingState: RoutingStateService,
    protected socket: SocketIoService,
    protected converter: ConverterService,
    protected localitiesApi: LocalitiesApiService,
    protected divisionsApi: DivisionsApiService,
    protected carsApi: CarsApiService,
    protected employeesApi: EmployeesApiService
  ) {}

  ngOnInit(): void {
    /* --------------------------- */
    /* Url query params activation */
    /* --------------------------- */
    this.route.paramMap.subscribe((paramMap) => {
      this.setActiveField('');
      this.itemId = paramMap.get('id');
      this.getItemRequest?.(true);
    });

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
            this.localitiesOptions.push({ text: el.name, value: el._id });
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
          this.divisionsOptions = [];
          this.divisionsToSelect?.forEach((el) => {
            this.divisionsOptions.push({ text: el.name, value: el._id });
          });

          this.divisionsToSelectCallback?.(this.item?.locality?._id);
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
          // this.updateCarsOptions();
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
          // this.updateEmployeesOptions();
          this.employeesToSelectCallback?.(employeesToSelect);
        });

      if (this.employeesToSelect === null) {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      }

      this.socket.get()?.on('employees', (_) => {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      });
    }
  }

  ngOnDestroy(): void {
    this.item$?.unsubscribe?.();
    this.getItemError$?.unsubscribe?.();
    this.itemIsFetching$?.unsubscribe?.();
    this.itemIsUpdating$?.unsubscribe?.();
    this.itemIsUpdateSucceed$?.unsubscribe?.();
    this.updateItemError$?.unsubscribe?.();
    this.itemIsRemoving$?.unsubscribe?.();
    this.itemIsRemoveSucceed$?.unsubscribe?.();
    this.removeItemError$?.unsubscribe?.();

    this.localitiesToSelect$?.unsubscribe?.();
    this.divisionsToSelect$?.unsubscribe?.();
    this.carsToSelect$?.unsubscribe?.();
    this.employeesToSelect$?.unsubscribe?.();

    this.socket?.get()?.off('localities');
    this.socket?.get()?.off('divisions');
    this.socket?.get()?.off('cars');
    this.socket?.get()?.off('employees');
  }

  public updateDivisionsOptions(localityId: string): void {
    this.divisionsOptions = [];
    this.divisionsToSelect?.forEach((el) => {
      if (el.locality === localityId) {
        this.divisionsOptions.push({
          text: el.name,
          value: el._id,
        });
      }
    });
  }

  public updateEmployeesOptions(
    divisionIds: string[],
    role?: EmployeeRole
  ): void {
    this.employeesOptions = [];
    this.employeesToSelect?.forEach((el) => {
      if (divisionIds.includes(el.division)) {
        if (role) {
          if (role === el.role) {
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
      }
    });
  }

  public updateCarsOptions(divisionIds: string[]): void {
    this.carsOptions = [];
    this.carsToSelect?.forEach((el) => {
      if (divisionIds.some((ai) => el.divisions.includes(ai))) {
        this.carsOptions.push({
          text: el.licensePlate,
          value: el._id,
        });
      }
    });
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

  public update(): void {
    if (
      this.activeField &&
      !this.itemIsUpdating &&
      this.form.get(this.activeField).valid
    ) {
      this.updateItemRequest?.();
    }
  }

  public getDivisionsValuesArray(divisions: (IDivision | string)[]): string[] {
    return (
      (divisions as IDivision[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getEmployeesValuesArray(employees: (IEmployee | string)[]): string[] {
    return (
      (employees as IEmployee[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getCarsValuesArray(employees: (ICar | string)[]): string[] {
    return (
      (employees as ICar[])?.map((el) => {
        return el._id;
      }) || []
    );
  }

  public getItemLocalitiesFieldListElements(
    localities: (ILocality | string)[]
  ): ItemFieldListElement[] {
    return (
      (localities as ILocality[])?.map((el) => {
        return {
          text: el.name,
          color: el.status === SimpleStatus.active ? 'green' : 'red',
          linkArray: ['../../', 'localities', el._id],
        };
      }) || []
    );
  }

  public getItemDivisionsFieldListElements(
    divisions: (IDivision | string)[]
  ): ItemFieldListElement[] {
    return (
      (divisions as IDivision[])?.map((el) => {
        return {
          text: el.name,
          color: el.status === SimpleStatus.active ? 'green' : 'red',
          linkArray: ['../../', 'divisions', el._id],
        };
      }) || []
    );
  }

  public getItemCarsFieldListElements(
    cars: (ICar | string)[]
  ): ItemFieldListElement[] {
    return (
      (cars as ICar[])?.map((el) => {
        let carStatusColor = 'green' as TextColor;
        switch (el.status) {
          case CarStatus.active:
            carStatusColor = 'green';
            break;
          case CarStatus.temporaryUnavailable:
            carStatusColor = 'yellow';
            break;
          case CarStatus.unavailable:
            carStatusColor = 'red';
            break;
        }

        return {
          text: el.licensePlate,
          color: carStatusColor,
          linkArray: ['../../', 'divisions', el._id],
        };
      }) || []
    );
  }

  public getItemEmployeesFieldListElements(
    employees: (IEmployee | string)[]
  ): ItemFieldListElement[] {
    return (
      (employees as IEmployee[])?.map((el) => {
        let carStatusColor = 'green' as 'green' | 'yellow' | 'red';
        switch (el.status) {
          case EmployeeStatus.active:
            carStatusColor = 'green';
            break;
          case EmployeeStatus.vacation:
            carStatusColor = 'yellow';
            break;
          case EmployeeStatus.fired:
            carStatusColor = 'red';
            break;
        }

        return {
          text: this.converter.getUserInitials(
            el.name,
            el.surname,
            el.patronymic
          ),
          color: carStatusColor,
          linkArray: ['../../', 'employees', el._id],
        };
      }) || []
    );
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
