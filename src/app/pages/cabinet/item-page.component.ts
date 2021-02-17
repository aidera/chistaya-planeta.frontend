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
import { ILocality } from '../../models/Locality';
import { IDivision } from '../../models/Division';
import { ICar } from '../../models/Car';
import { IEmployee } from '../../models/Employee';
import { ModalAction } from '../../components/modal/modal.component';
import { TextColor } from '../../models/types/TextColor';
import { ItemFieldListElement } from '../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import SimpleStatus from '../../models/enums/SimpleStatus';
import CarStatus from '../../models/enums/CarStatus';
import EmployeeStatus from '../../models/enums/EmployeeStatus';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ConverterService } from '../../services/converter/converter.service';
import { LocalitiesApiService } from '../../services/api/localities-api.service';
import { DivisionsApiService } from '../../services/api/divisions-api.service';
import { CarsApiService } from '../../services/api/cars-api.service';
import { EmployeesApiService } from '../../services/api/employees-api.service';
import { OptionsService } from '../../services/options/options.service';

@Component({
  template: '',
})
export class ItemPageComponent implements OnInit, OnDestroy {
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

  public isRemoveModalOpen = false;

  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  public statusString: string;
  public statusColor: TextColor;

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
    protected employeesApi: EmployeesApiService,
    public options: OptionsService
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
          linkArray: ['../../', 'cars', el._id],
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
