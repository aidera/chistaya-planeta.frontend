import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as EmployeesActions from '../../../../store/employees/employees.actions';
import * as EmployeesSelectors from '../../../../store/employees/employees.selectors';
import { ICar } from '../../../../models/Car';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import EmployeeStatus from '../../../../models/enums/EmployeeStatus';
import EmployeeRole from '../../../../models/enums/EmployeeRole';
import CarStatus from '../../../../models/enums/CarStatus';
import SimpleStatus from '../../../../models/enums/SimpleStatus';
import { ItemPageComponent } from '../../item-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import employeeRoleOptions from '../../../../data/employeeRoleOptions';
import employeeStatusOptions from '../../../../data/employeeStatusOptions';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  public item: IEmployee;

  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];

  public employeeRoleOptions = employeeRoleOptions.filter(
    (el) => el.value !== EmployeeRole.head + ''
  );
  public employeeStatusOptions = employeeStatusOptions;

  public simpleStatus = SimpleStatus;
  public carStatus = CarStatus;
  public employeeStatus = EmployeeStatus;
  public employeeRole = EmployeeRole;

  public alreadyExistEmailId: string;
  public alreadyExistPhoneId: string;

  ngOnInit(): void {
    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        patronymic: new FormControl(''),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        locality: new FormControl('', Validators.required),
        division: new FormControl('', Validators.required),
        cars: new FormControl([]),
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
                  if (this.item?._id !== response.id) {
                    this.form.get('email').markAsTouched();
                    this.form.get('email').setErrors({ alreadyExists: true });
                    this.alreadyExistEmailId = response.id;
                  } else {
                    this.alreadyExistEmailId = '';
                  }
                } else {
                  this.alreadyExistEmailId = '';
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
                  if (this.item?._id !== response.id) {
                    this.form.get('phone').markAsTouched();
                    this.form.get('phone').setErrors({ alreadyExists: true });
                    this.alreadyExistPhoneId = response.id;
                  } else {
                    this.alreadyExistPhoneId = '';
                  }
                } else {
                  this.alreadyExistPhoneId = '';
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
        EmployeesActions.getEmployeeRequest({ id: this.itemId, withLoading })
      );
    };

    this.updateItemRequest = () => {
      this.store.dispatch(
        EmployeesActions.updateEmployeeRequest({
          id: this.item._id,
          status:
            this.activeField === 'status'
              ? +this.form.get('status').value
              : undefined,
          role:
            this.activeField === 'role'
              ? +this.form.get('role').value
              : undefined,
          name:
            this.activeField === 'name'
              ? this.form.get('name').value
              : undefined,
          surname:
            this.activeField === 'surname'
              ? this.form.get('surname').value
              : undefined,
          patronymic:
            this.activeField === 'patronymic'
              ? this.form.get('patronymic').value
              : undefined,
          email:
            this.activeField === 'email'
              ? this.form.get('email').value
              : undefined,
          phone:
            this.activeField === 'phone'
              ? '+7' + this.form.get('phone').value
              : undefined,
          locality:
            this.activeField === 'locality'
              ? this.form.get('locality').value
              : undefined,
          division:
            this.activeField === 'division'
              ? this.form.get('division').value
              : undefined,
          cars:
            this.activeField === 'cars'
              ? this.form.get('cars').value
              : undefined,
        })
      );
    };

    this.removeItemRequest = () => {
      this.store.dispatch(
        EmployeesActions.removeEmployeeRequest({ id: this.item._id })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */

    this.item$ = this.store
      .select(EmployeesSelectors.selectEmployee)
      .subscribe((employee) => {
        this.item = employee;

        this.initForm();

        switch (employee?.status) {
          case EmployeeStatus.active:
            this.statusColor = 'green';
            this.statusString = employeeStatusOptions.find(
              (el) => el.value === EmployeeStatus.active + ''
            ).text;
            break;
          case EmployeeStatus.vacation:
            this.statusColor = 'yellow';
            this.statusString = employeeStatusOptions.find(
              (el) => el.value === EmployeeStatus.vacation + ''
            ).text;
            break;
          case EmployeeStatus.fired:
            this.statusColor = 'red';
            this.statusString = employeeStatusOptions.find(
              (el) => el.value === EmployeeStatus.fired + ''
            ).text;
            break;
        }

        if (this.form && employee) {
          this.form.setValue({
            status: String(employee.status) || '',
            role: String(employee.role) || '',
            name: employee.name || '',
            surname: employee.surname || '',
            patronymic: employee.patronymic || '',
            email: employee.email || '',
            phone: employee.phone.substr(2) || '',
            locality: (employee.locality as ILocality)?._id || '',
            division: (employee.division as IDivision)?._id || '',
            cars: (employee.cars as ICar[])?.map((el) => el._id) || [],
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
            if (value === null) {
              this.options.initLocalitiesOptions();
            }
          });

        /* Divisions */
        this.divisionsOptions$?.unsubscribe();
        this.divisionsOptions$ = this.options
          .getDivisionsOptions({
            statuses: [SimpleStatus.active],
            localitiesIds: (employee?.locality as ILocality)?._id
              ? [(employee?.locality as ILocality)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.divisionsOptions = value;
            if (value === null) {
              this.options.initDivisionsOptions();
            }
          });

        /* Cars */
        this.carsOptions$?.unsubscribe();
        this.carsOptions$ = this.options
          .getCarsOptions({
            statuses: [CarStatus.active, CarStatus.temporaryUnavailable],
            divisionsIds: (employee?.division as IDivision)?._id
              ? [(employee?.division as IDivision)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.carsOptions = value;
            if (value === null) {
              this.options.initCarsOptions();
            }
          });
      });

    this.getItemError$ = this.store
      .select(EmployeesSelectors.selectGetEmployeeError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(EmployeesSelectors.selectGetEmployeeIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(EmployeesSelectors.selectUpdateEmployeeIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(EmployeesSelectors.selectUpdateEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(EmployeesActions.refreshUpdateEmployeeSucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(EmployeesSelectors.selectUpdateEmployeeError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            if (error.description?.includes('email')) {
              this.form.get('email').setErrors({ alreadyExists: true });
              this.alreadyExistEmailId = error.foundedItem._id;
            }
            if (error.description?.includes('phone')) {
              this.form.get('phone').setErrors({ alreadyExists: true });
              this.alreadyExistPhoneId = error.foundedItem._id;
            }
          } else if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.updateSnackbar = this.snackBar.open(
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
                'Ошибка подразделения. Возможно, оно былы удалёно',
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

        this.store.dispatch(EmployeesActions.refreshUpdateEmployeeFailure());
      });

    this.itemIsRemoving$ = this.store
      .select(EmployeesSelectors.selectRemoveEmployeeIsFetching)
      .subscribe((status) => {
        this.itemIsRemoving = status;
      });

    this.itemIsRemoveSucceed$ = this.store
      .select(EmployeesSelectors.selectRemoveEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(EmployeesActions.refreshRemoveEmployeeSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeItemError$ = this.store
      .select(EmployeesSelectors.selectRemoveEmployeeError)
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

        this.store.dispatch(EmployeesActions.refreshRemoveEmployeeFailure());
      });

    this.socket.get()?.on('employees', (data) => {
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

    this.socket.get()?.off('employees');

    this.localitiesOptions$?.unsubscribe?.();
    this.divisionsOptions$?.unsubscribe?.();
    this.carsOptions$?.unsubscribe?.();

    this.options.destroyLocalitiesOptions();
    this.options.destroyDivisionsOptions();
    this.options.destroyCarsOptions();
  }

  public getCarRoleText(): string {
    return (
      employeeRoleOptions.find(
        (el) => el.value === (this.item?.role || '') + ''
      )?.text || ''
    );
  }

  public getCarsValuesArray(employees: (ICar | string)[]): string[] {
    return (
      (employees as ICar[])?.map((el) => {
        return el._id;
      }) || []
    );
  }
}
