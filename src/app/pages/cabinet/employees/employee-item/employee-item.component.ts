import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as AppSelectors from '../../../../store/app/app.selectors';
import * as AppActions from '../../../../store/app/app.actions';
import * as EmployeeActions from '../../../../store/employee/employee.actions';
import * as EmployeeSelectors from '../../../../store/employee/employee.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { ICar, ICarLessInfo } from '../../../../models/Car';
import { OptionType } from '../../../../models/types/OptionType';
import { IDivision, IDivisionLessInfo } from '../../../../models/Division';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { ILocality } from '../../../../models/Locality';
import { responseCodes } from '../../../../data/responseCodes';
import { ModalAction } from '../../../../components/modal/modal.component';
import EmployeeStatus from '../../../../models/enums/EmployeeStatus';
import employeeRoleOptions from '../../../../data/employeeRoleOptions';
import EmployeeRole from '../../../../models/enums/EmployeeRole';
import employeeStatusOptions from '../../../../data/employeeStatusOptions';
import { IEmployee } from '../../../../models/Employee';
import CarStatus from '../../../../models/enums/CarStatus';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  private employeeId: string;
  private employee$: Subscription;
  public employee: IEmployee | null;
  private getEmployeeError$: Subscription;
  public getEmployeeError: string | null;
  protected isRemoving$: Subscription;
  public isRemoving = false;
  protected isRemoveSucceed$: Subscription;
  protected removeError$: Subscription;
  public removeError: string | null;

  private localities$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];
  public divisionsOptions: OptionType[];
  private cars$: Subscription;
  public cars: ICarLessInfo[];
  public carsOptions: OptionType[];

  public isRemoveModalOpen = false;
  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  public simpleStatus = SimpleStatus;
  public carStatus = CarStatus;
  public employeeStatus = EmployeeStatus;
  public employeeRole = EmployeeRole;
  public employeeRoleOptions = employeeRoleOptions.filter(
    (el) => el.value !== EmployeeRole.head + ''
  );
  public employeeStatusOptions = employeeStatusOptions;

  public employeeStatusString = 'Статус';
  public alreadyExistId;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.setActiveField('');
      this.employeeId = paramMap.get('id');
      this.getItemRequest();
    });

    this.socket.get()?.on('employees', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest();
      }
      if (data.action === 'update' && data.id) {
        if (this.employee && this.employee._id === data.id) {
          this.getItemRequest();
        }
      }
    });

    this.employee$ = this.store
      .select(EmployeeSelectors.selectEmployee)
      .subscribe((employee) => {
        this.employee = employee;

        this.initForm();

        this.employeeStatusString =
          employee && employee.status === EmployeeStatus.fired
            ? 'Статус: <span class="red-text">' +
              employeeStatusOptions.find(
                (el) => el.value === EmployeeStatus.fired + ''
              ).text +
              '</span>'
            : employee && employee.status === EmployeeStatus.vacation
            ? 'Статус: <span class="yellow-text">' +
              employeeStatusOptions.find(
                (el) => el.value === EmployeeStatus.vacation + ''
              ).text +
              '</span>'
            : employee && employee.status === EmployeeStatus.active
            ? 'Статус: <span class="green-text">' +
              employeeStatusOptions.find(
                (el) => el.value === EmployeeStatus.active + ''
              ).text +
              '</span>'
            : ' Статус';

        this.divisionsOptions = [];
        this.divisions?.forEach((el) => {
          if (el.locality === (employee?.locality as ILocality)?._id) {
            this.divisionsOptions.push({
              value: el._id,
              text: el.name,
            });
          }
        });

        this.carsOptions = [];
        this.cars?.forEach((el) => {
          if (el.divisions.includes((employee?.division as IDivision)?._id)) {
            this.carsOptions.push({
              value: el._id,
              text: el.licensePlate,
            });
          }
        });

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
      });

    this.getEmployeeError$ = this.store
      .select(EmployeeSelectors.selectGetEmployeeError)
      .subscribe((error) => {
        if (error?.code) {
          this.getEmployeeError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getEmployeeError = null;
        }
      });

    this.isFetching$ = this.store
      .select(EmployeeSelectors.selectGetEmployeeIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.isUpdating$ = this.store
      .select(EmployeeSelectors.selectUpdateEmployeeIsFetching)
      .subscribe((status) => {
        this.isUpdating = status;
      });

    this.isUpdateSucceed$ = this.store
      .select(EmployeeSelectors.selectUpdateEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(EmployeeActions.refreshUpdateEmployeeSucceed());
        }
      });

    this.updateError$ = this.store
      .select(EmployeeSelectors.selectUpdateEmployeeError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            if (error.description?.includes('email')) {
              this.form.get('email').setErrors({ alreadyExists: true });
            }
            if (error.description?.includes('phone')) {
              this.form.get('phone').setErrors({ alreadyExists: true });
            }
            this.alreadyExistId = error.foundedItem._id;
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

    this.isRemoving$ = this.store
      .select(EmployeeSelectors.selectRemoveEmployeeIsFetching)
      .subscribe((status) => {
        this.isRemoving = status;
      });

    this.isRemoveSucceed$ = this.store
      .select(EmployeeSelectors.selectRemoveEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(EmployeeActions.refreshRemoveEmployeeSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeError$ = this.store
      .select(EmployeeSelectors.selectRemoveEmployeeError)
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

    this.localities$ = this.store
      .select(AppSelectors.selectLocalitiesOptionsToSelect)
      .subscribe((localitiesOptions) => {
        this.localitiesOptions = localitiesOptions;
      });

    if (this.localitiesOptions === null) {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    }

    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });

    this.divisions$ = this.store
      .select(AppSelectors.selectDivisionsToSelect)
      .subscribe((divisions) => {
        this.divisions = divisions;
        if (this.employee) {
          this.divisionsOptions = [];

          this.divisions.forEach((el) => {
            if (el.locality === (this.employee.locality as ILocality)?._id) {
              this.divisionsOptions.push({
                value: el._id,
                text: el.name,
              });
            }
          });
        } else {
          this.divisionsOptions = [];
        }
      });

    if (this.divisions === null) {
      this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    }

    this.socket.get()?.on('divisions', (_) => {
      this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    });

    this.cars$ = this.store
      .select(AppSelectors.selectCarsToSelect)
      .subscribe((cars) => {
        this.cars = cars;
        this.carsOptions = [];
        this.cars?.forEach((el) => {
          if (
            el.divisions.includes((this.employee?.division as IDivision)?._id)
          ) {
            this.carsOptions.push({
              value: el._id,
              text: el.licensePlate,
            });
          }
        });
      });

    if (this.cars === null) {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    }

    this.socket.get()?.on('cars', (_) => {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    });
  }

  ngOnDestroy(): void {
    this.employee$?.unsubscribe?.();
    this.getEmployeeError$?.unsubscribe?.();
    this.isRemoving$?.unsubscribe?.();
    this.isRemoveSucceed$?.unsubscribe?.();
    this.removeError$?.unsubscribe?.();
    this.localities$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
    this.cars$?.unsubscribe?.();
  }

  private initForm(): void {
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
  }

  public getItemRequest(): void {
    this.store.dispatch(
      EmployeeActions.getEmployeeRequest({ id: this.employeeId })
    );
  }

  public update(): void {
    if (
      this.activeField &&
      !this.isUpdating &&
      this.form.get(this.activeField).valid
    ) {
      this.store.dispatch(
        EmployeeActions.updateEmployeeRequest({
          id: this.employee._id,
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
      this.store.dispatch(
        EmployeeActions.removeEmployeeRequest({ id: this.employee._id })
      );
    }
  }

  public getAllEmployeeRoleText(): string {
    return employeeRoleOptions.find(
      (el) => el.value === this.employee.role + ''
    ).text;
  }
}
