import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as CarActions from '../../../../store/car/car.actions';
import * as CarSelectors from '../../../../store/car/car.selectors';
import { ItemAddPageComponent } from '../../item-add-page.component';
import CarStatus from '../../../../models/enums/CarStatus';
import carTypeOptions from '../../../../data/carTypeOptions';
import carStatusOptions from '../../../../data/carStatusOptions';

@Component({
  selector: 'app-car-item-add',
  templateUrl: './car-item-add.component.html',
  styleUrls: ['./car-item-add.component.scss'],
})
export class CarItemAddComponent
  extends ItemAddPageComponent
  implements OnInit {
  public form1: FormGroup;

  public alreadyExistId: string;

  public carStatus = CarStatus;
  public carTypeOptions = carTypeOptions;
  public carStatusOptions = carStatusOptions;

  ngOnInit(): void {
    this.initForm();

    this.isFetching$ = this.store
      .select(CarSelectors.selectAddCarIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(CarSelectors.selectAddCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(CarActions.refreshAddCarSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(CarSelectors.selectAddCarError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form1.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else {
            this.addSnackbar = this.snackBar.open(
              'Ошибка при добавлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }
      });
  }

  private initForm(): void {
    this.form1 = new FormGroup({
      type: new FormControl('', Validators.required),
      licensePlate: new FormControl('', Validators.required),
      weight: new FormControl(''),
      isCorporate: new FormControl('', Validators.required),
      drivers: new FormControl(''),
    });
  }

  public sendForm1Main(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1 && this.form1.valid) {
      this.store.dispatch(
        CarActions.addCarRequest({
          carType: +this.form1.get('type').value,
          drivers: this.form1.get('drivers').value || [],
          isCorporate: this.form1.get('isCorporate').value === '1',
          licensePlate: this.form1.get('licensePlate').value,
          weight: +this.form1.get('weight').value,
        })
      );
    }
  }
}
