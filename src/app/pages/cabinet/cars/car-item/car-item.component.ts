import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import * as CarSelectors from '../../../../store/car/car.selectors';
import * as CarActions from '../../../../store/car/car.actions';
import { ItemPageComponent } from '../../item-page.component';
import { ModalAction } from '../../../../components/modal/modal.component';
import { responseCodes } from '../../../../data/responseCodes';
import { ICar } from '../../../../models/Car';
import CarStatus from '../../../../models/enums/CarStatus';
import carTypeOptions from '../../../../data/carTypeOptions';
import carStatusOptions from '../../../../data/carStatusOptions';

@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.scss'],
})
export class CarItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  private carId: string;
  private car$: Subscription;
  public car: ICar | null;
  private getCarError$: Subscription;
  public getCarError: string | null;
  protected isRemoving$: Subscription;
  public isRemoving = false;
  protected isRemoveSucceed$: Subscription;
  protected removeError$: Subscription;
  public removeError: string | null;

  public isRemoveModalOpen = false;
  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  public carStatus = CarStatus;
  public carTypeOptions = carTypeOptions;
  public carStatusOptions = carStatusOptions;

  carStatusString = 'Статус';

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id') as string;
    this.getItemRequest();

    this.socket.get()?.on('cars', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest();
      }
      if (data.action === 'update' && data.id) {
        if (this.car && this.car._id === data.id) {
          this.getItemRequest();
        }
      }
    });

    this.car$ = this.store.select(CarSelectors.selectCar).subscribe((car) => {
      this.car = car;

      this.initForm();

      this.carStatusString =
        car && car.status === CarStatus.unavailable
          ? 'Статус: <span class="red-text">' +
            carStatusOptions[CarStatus.unavailable].text +
            '</span>'
          : car && car.status === CarStatus.temporaryUnavailable
          ? 'Статус: <span class="yellow-text">' +
            carStatusOptions[CarStatus.temporaryUnavailable].text +
            '</span>'
          : car && car.status === CarStatus.active
          ? 'Статус: <span class="green-text">' +
            carStatusOptions[CarStatus.active].text +
            '</span>'
          : ' Статус';

      if (this.form) {
        this.form.setValue({
          status: String(car?.status) || '',
          type: String(car?.type) || '',
          licensePlate: car?.licensePlate || '',
          weight: car?.weight || '',
          isCorporate: car?.isCorporate ? '1' : '0',
          drivers: car?.drivers || '',
        });
      }
    });

    this.getCarError$ = this.store
      .select(CarSelectors.selectGetCarError)
      .subscribe((error) => {
        if (error?.code) {
          this.getCarError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getCarError = null;
        }
      });

    this.isFetching$ = this.store
      .select(CarSelectors.selectGetCarIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.isUpdating$ = this.store
      .select(CarSelectors.selectUpdateCarIsFetching)
      .subscribe((status) => {
        this.isUpdating = status;
      });

    this.isUpdateSucceed$ = this.store
      .select(CarSelectors.selectUpdateCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(CarActions.refreshUpdateCarSucceed());
        }
      });

    this.updateError$ = this.store
      .select(CarSelectors.selectUpdateCarError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.form.get('name').markAsTouched();
          if (error.foundedItem._id === this.car._id) {
            this.form.get('name').setErrors({ sameName: true });
          } else {
            this.form.get('name').setErrors({ alreadyExists: true });
          }
        } else if (error) {
          this.updateSnackbar = this.snackBar.open(
            'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.isRemoving$ = this.store
      .select(CarSelectors.selectRemoveCarIsFetching)
      .subscribe((status) => {
        this.isRemoving = status;
      });

    this.isRemoveSucceed$ = this.store
      .select(CarSelectors.selectRemoveCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(CarActions.refreshRemoveCarSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeError$ = this.store
      .select(CarSelectors.selectRemoveCarError)
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
      });
  }

  ngOnDestroy(): void {
    this.car$?.unsubscribe?.();
    this.getCarError$?.unsubscribe?.();
    this.isRemoving$?.unsubscribe?.();
    this.isRemoveSucceed$?.unsubscribe?.();
    this.removeError$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form = new FormGroup({
      status: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      licensePlate: new FormControl('', Validators.required),
      weight: new FormControl(''),
      isCorporate: new FormControl('', Validators.required),
      drivers: new FormControl(''),
    });
  }

  public getItemRequest(): void {
    this.store.dispatch(CarActions.getCarRequest({ id: this.carId }));
  }

  public update(): void {
    if (this.activeField && !this.isUpdating && this.form.valid) {
      this.store.dispatch(
        CarActions.updateCarRequest({
          id: this.car._id,
          weight: +this.form.get('weight').value,
          licensePlate: this.form.get('licensePlate').value,
          isCorporate: this.form.get('isCorporate').value === '1',
          drivers: this.form.get('drivers').value || [],
          status: +this.form.get('status').value,
          carType: +this.form.get('type').value,
        })
      );
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
      this.store.dispatch(CarActions.removeCarRequest({ id: this.car._id }));
    }
  }
}
