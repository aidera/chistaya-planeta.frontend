import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as CarActions from '../../../../store/car/car.actions';
import * as CarSelectors from '../../../../store/car/car.selectors';
import { ItemAddPageComponent } from '../../item-add-page.component';
import carTypeOptions from '../../../../data/carTypeOptions';
import EmployeeRole from '../../../../models/enums/EmployeeRole';
import { debounceTime, take } from 'rxjs/operators';
import { responseCodes } from '../../../../data/responseCodes';

@Component({
  selector: 'app-car-item-add',
  templateUrl: './car-item-add.component.html',
  styleUrls: ['./car-item-add.component.scss'],
})
export class CarItemAddComponent
  extends ItemAddPageComponent
  implements OnInit {
  public carTypeOptions = carTypeOptions;

  ngOnInit(): void {
    /* ------------------------ */
    /* --- Options settings --- */
    /* ------------------------ */
    this.useLocalitiesOptions = true;
    this.useDivisionsOptions = true;
    this.useCarsOptions = false;
    this.useEmployeesOptions = true;
    this.employeesToSelectCallback = (_) => {
      if (this.employeesToSelect) {
        this.employeesToSelect = this.employeesToSelect.filter(
          (employee) => employee.role === EmployeeRole.driver
        );
      }
    };

    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        type: new FormControl('', Validators.required),
        licensePlate: new FormControl('', Validators.required),
        weight: new FormControl('', Validators.min(0.00000001)),
        isCorporate: new FormControl('', Validators.required),
        drivers: new FormControl(''),
        locality: new FormControl(
          this.queryLocalityId || '',
          Validators.required
        ),
        divisions: new FormControl(
          this.queryDivisionId ? [this.queryDivisionId] : [],
          Validators.required
        ),
        employees: new FormControl([]),
      });

      this.form
        .get('licensePlate')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.carApi
              .checkLicensePlate(this.form.get('licensePlate').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('licensePlate').markAsTouched();
                  this.form
                    .get('licensePlate')
                    .setErrors({ alreadyExists: true });
                  this.alreadyExistId = response.id;
                }
              });
          }
        });
    };

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
            this.form.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.addSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
            if (error.description.includes('division')) {
              this.addSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно было удалёно',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
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

        this.store.dispatch(CarActions.refreshAddCarFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      this.store.dispatch(
        CarActions.addCarRequest({
          carType: +this.form.get('type').value,
          isCorporate: this.form.get('isCorporate').value === '1',
          licensePlate: this.form.get('licensePlate').value,
          weight: +this.form.get('weight').value,
          locality: this.form.get('locality').value,
          divisions: this.form.get('divisions').value,
          drivers: this.form.get('employees').value || [],
        })
      );
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }
}
