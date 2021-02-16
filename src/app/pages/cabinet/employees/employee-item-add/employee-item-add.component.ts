import { Component, OnInit } from '@angular/core';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as EmployeesSelectors from '../../../../store/employees/employees.selectors';
import * as EmployeesActions from '../../../../store/employees/employees.actions';
import { responseCodes } from '../../../../data/responseCodes';
import EmployeeRole from '../../../../models/enums/EmployeeRole';
import employeeRoleOptions from '../../../../data/employeeRoleOptions';
import { debounceTime, take } from 'rxjs/operators';

@Component({
  selector: 'app-employee-item-add',
  templateUrl: './employee-item-add.component.html',
  styleUrls: ['./employee-item-add.component.scss'],
})
export class EmployeeItemAddComponent
  extends ItemAddPageComponent
  implements OnInit {
  public employeeRole = EmployeeRole;
  public employeeRoleOptions = employeeRoleOptions.filter(
    (el) => el.value !== EmployeeRole.head + ''
  );

  public alreadyExistId2: string;

  ngOnInit(): void {
    /* ------------------------ */
    /* --- Options settings --- */
    /* ------------------------ */
    this.useLocalitiesOptions = true;
    this.useDivisionsOptions = true;
    this.useCarsOptions = true;
    this.useEmployeesOptions = false;

    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        role: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        patronymic: new FormControl(''),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        locality: new FormControl(
          this.queryLocalityId || '',
          Validators.required
        ),
        division: new FormControl(
          this.queryDivisionId || '',
          Validators.required
        ),
        cars: new FormControl(''),
      });

      this.form
        .get('email')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.employeesApi
              .checkEmail(this.form.get('email').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('email').markAsTouched();
                  this.form.get('email').setErrors({ alreadyExists: true });
                  this.alreadyExistId = response.id;
                }
              });
          }
        });

      this.form
        .get('phone')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.employeesApi
              .checkPhone('+7' + this.form.get('phone').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('phone').markAsTouched();
                  this.form.get('phone').setErrors({ alreadyExists: true });
                  this.alreadyExistId2 = response.id;
                }
              });
          }
        });
    };

    this.isFetching$ = this.store
      .select(EmployeesSelectors.selectAddEmployeeIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(EmployeesSelectors.selectAddEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(EmployeesActions.refreshAddEmployeeSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(EmployeesSelectors.selectAddEmployeeError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            if (error.description?.includes('email')) {
              this.form.get('email').setErrors({ alreadyExists: true });
              this.alreadyExistId = error.foundedItem._id;
            }
            if (error.description?.includes('phone')) {
              this.form.get('phone').setErrors({ alreadyExists: true });
              this.alreadyExistId2 = error.foundedItem._id;
            }
          } else if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.addSnackbar = this.snackBar.open(
                'Некорректный email',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
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

        this.store.dispatch(EmployeesActions.refreshAddEmployeeFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      this.store.dispatch(
        EmployeesActions.addEmployeeRequest({
          role: +this.form.get('role').value,
          name: this.form.get('name').value,
          surname: this.form.get('surname').value,
          patronymic: this.form.get('patronymic').value,
          email: this.form.get('email').value,
          phone: '+7' + this.form.get('phone').value,
          locality: this.form.get('locality').value,
          division: this.form.get('division').value,
          cars:
            +this.form.get('role').value === EmployeeRole.driver
              ? this.form.get('cars').value
              : [],
        })
      );
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }
}
