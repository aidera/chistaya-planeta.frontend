import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

import * as CarsSelectors from '../../../../store/cars/cars.selectors';
import * as CarsActions from '../../../../store/cars/cars.actions';
import { ICar } from '../../../../models/Car';
import { ILocality } from '../../../../models/Locality';
import { IDivision } from '../../../../models/Division';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import CarStatus from '../../../../models/enums/CarStatus';
import SimpleStatus from '../../../../models/enums/SimpleStatus';
import EmployeeRole from '../../../../models/enums/EmployeeRole';
import { ItemPageComponent } from '../../item-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import { carTypeOptions, carTypeStrings } from '../../../../data/carTypeData';
import {
  carStatusColors,
  carStatusOptions,
  carStatusStrings,
} from '../../../../data/carStatusData';
import EmployeeStatus from '../../../../models/enums/EmployeeStatus';

@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.scss'],
})
export class CarItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  public item: ICar;

  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public employeesOptions$: Subscription;
  public employeesOptions: OptionType[] = [];

  public carStatus = CarStatus;
  public simpleStatus = SimpleStatus;
  public employeeRole = EmployeeRole;
  public carStatusOptions = carStatusOptions;
  public carStatusStrings = carStatusStrings;
  public carStatusColors = carStatusColors;
  public carTypeOptions = carTypeOptions;
  public carTypeStrings = carTypeStrings;

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initEmployeesOptions();

    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        licensePlate: new FormControl('', Validators.required),
        weight: new FormControl('', Validators.min(0.00000001)),
        isCorporate: new FormControl('', Validators.required),
        locality: new FormControl('', Validators.required),
        divisions: new FormControl([], Validators.required),
        drivers: new FormControl([]),
      });

      this.form.get('weight').markAsTouched();
      this.form.get('weight').updateValueAndValidity();

      this.form
        .get('licensePlate')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.carsApi
              .checkLicensePlate(this.form.get('licensePlate').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('licensePlate').markAsTouched();
                  this.form
                    .get('licensePlate')
                    .setErrors({ alreadyExists: true });
                  this.alreadyExistId = response.id;
                } else {
                  this.alreadyExistId = '';
                }
              });
          }
        });
    };

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        CarsActions.getCarRequest({ id: this.itemId, withLoading })
      );
    };

    this.updateItemRequest = () => {
      this.store.dispatch(
        CarsActions.updateCarRequest({
          id: this.item._id,
          weight:
            this.activeField === 'weight'
              ? +this.form.get('weight').value
              : undefined,
          licensePlate:
            this.activeField === 'licensePlate'
              ? this.form.get('licensePlate').value
              : undefined,
          isCorporate:
            this.activeField === 'isCorporate'
              ? this.form.get('isCorporate').value === '1'
              : undefined,
          drivers:
            this.activeField === 'drivers'
              ? this.form.get('drivers').value || []
              : undefined,
          status:
            this.activeField === 'status'
              ? +this.form.get('status').value
              : undefined,
          carType:
            this.activeField === 'type'
              ? +this.form.get('type').value
              : undefined,
          locality:
            this.activeField === 'locality'
              ? this.form.get('locality').value
              : undefined,
          divisions:
            this.activeField === 'divisions'
              ? this.form.get('divisions').value || []
              : undefined,
        })
      );
    };

    this.removeItemRequest = () => {
      this.store.dispatch(CarsActions.removeCarRequest({ id: this.item._id }));
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */
    this.item$ = this.store.select(CarsSelectors.selectCar).subscribe((car) => {
      this.item = car;

      this.initForm();

      if (this.form) {
        this.form.setValue({
          status: String(car?.status) || '',
          type: String(car?.type) || '',
          licensePlate: car?.licensePlate || '',
          weight: car?.weight || '',
          isCorporate: car?.isCorporate ? '1' : '0',
          drivers: (car?.drivers as IEmployee[])?.map((el) => el._id) || [],
          locality: (car?.locality as ILocality)?._id || '',
          divisions: (car?.divisions as IDivision[])?.map((el) => el._id) || [],
        });
      }

      /* ----------------------------------- */
      /* Options requests in item connection */
      /* ----------------------------------- */

      /* Localities */
      this.localitiesOptions$?.unsubscribe();
      this.localitiesOptions$ = this.options
        .getLocalitiesOptions({ statuses: [SimpleStatus.active] })
        .subscribe((value) => {
          this.localitiesOptions = value;
        });

      /* Divisions */
      this.divisionsOptions$?.unsubscribe();
      this.divisionsOptions$ = this.options
        .getDivisionsOptions({
          statuses: [SimpleStatus.active],
          localitiesIds: (car?.locality as ILocality)?._id
            ? [(car?.locality as ILocality)?._id]
            : undefined,
        })
        .subscribe((value) => {
          this.divisionsOptions = value;
        });

      /* Employees */
      this.employeesOptions$?.unsubscribe();
      this.employeesOptions$ = this.options
        .getEmployeesOptions({
          statuses: [EmployeeStatus.active, EmployeeStatus.vacation],
          roles: [EmployeeRole.driver],
          divisionsIds: Array.isArray(car?.divisions)
            ? (car.divisions as IDivision[]).map((el) => el._id)
            : undefined,
        })
        .subscribe((value) => {
          this.employeesOptions = value;
        });
    });

    this.getItemError$ = this.store
      .select(CarsSelectors.selectGetCarError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(CarsSelectors.selectGetCarIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(CarsSelectors.selectUpdateCarIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(CarsSelectors.selectUpdateCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(CarsActions.refreshUpdateCarSucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(CarsSelectors.selectUpdateCarError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.updateSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
            if (error.description.includes('division')) {
              this.updateSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно было удалёно',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else {
            this.updateSnackbar = this.snackBar.open(
              'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(CarsActions.refreshUpdateCarFailure());
      });

    this.itemIsRemoving$ = this.store
      .select(CarsSelectors.selectRemoveCarIsFetching)
      .subscribe((status) => {
        this.itemIsRemoving = status;
      });

    this.itemIsRemoveSucceed$ = this.store
      .select(CarsSelectors.selectRemoveCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(CarsActions.refreshRemoveCarSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeItemError$ = this.store
      .select(CarsSelectors.selectRemoveCarError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.isRemoveModalOpen = false;
        } else if (error) {
          this.removeSnackbar = this.snackBar.open(
            'Ошибка при удалении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(CarsActions.refreshRemoveCarFailure());
      });

    this.socket.get()?.on('cars', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.item?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('cars');

    this.localitiesOptions$?.unsubscribe?.();
    this.divisionsOptions$?.unsubscribe?.();
    this.employeesOptions$?.unsubscribe?.();

    this.options.destroyLocalitiesOptions();
    this.options.destroyDivisionsOptions();
    this.options.destroyEmployeesOptions();
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
}
