import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as EmployeeActions from '../../../../store/employee/employee.actions';
import * as EmployeeSelectors from '../../../../store/employee/employee.selectors';
import { TablePageComponent } from '../../table-page.component';
import { IEmployee } from '../../../../models/Employee';
import { IDivision, IDivisionLessInfo } from '../../../../models/Division';
import { ICar, ICarLessInfo } from '../../../../models/Car';
import EmployeeStatus from '../../../../models/enums/EmployeeStatus';
import employeeRoleOptions from '../../../../data/employeeRoleOptions';
import { ILocality } from '../../../../models/Locality';
import employeeStatusOptions from '../../../../data/employeeStatusOptions';
import { OptionType } from '../../../../models/types/OptionType';
import * as AppSelectors from '../../../../store/app/app.selectors';
import * as AppActions from '../../../../store/app/app.actions';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
})
export class EmployeesTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private employees$: Subscription;
  private employees: IEmployee[];

  private localities$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];
  public divisionsOptions: OptionType[];
  private cars$: Subscription;
  public cars: ICarLessInfo[];
  public carsOptions: OptionType[];

  public employeeStatusOptions = employeeStatusOptions;
  public employeeRoleOptions = employeeRoleOptions;

  ngOnInit(): void {
    /* ---------------------- */
    /* --- Table settings --- */
    /* ---------------------- */

    this.tableColumns = [
      {
        key: 'id',
        title: 'Идентификатор',
        isSorting: true,
      },
      {
        key: 'status',
        title: 'Статус',
        isSorting: true,
      },
      {
        key: 'role',
        title: 'Роль',
        isSorting: true,
      },
      {
        key: 'name',
        title: 'Имя',
        isSorting: true,
      },
      {
        key: 'surname',
        title: 'Фамилия',
        isSorting: true,
      },
      {
        key: 'patronymic',
        title: 'Отчество',
        isSorting: true,
      },
      {
        key: 'phone',
        title: 'Телефон',
        isSorting: true,
      },
      {
        key: 'email',
        title: 'Email',
        isSorting: true,
      },
      {
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: true,
      },
      {
        key: 'division',
        title: 'Подразделение',
        isSorting: true,
      },
      {
        key: 'cars',
        title: 'Автомобили',
        isSorting: false,
      },
      {
        key: 'dismissalReason',
        title: 'Причина увольнения',
        isSorting: true,
      },
      {
        key: 'createdAt',
        title: 'Дата создания',
        isSorting: true,
      },
      {
        key: 'updatedAt',
        title: 'Дата изменения',
        isSorting: true,
      },
    ];

    this.columnsCanBeDisplayed = this.tableColumns.map((column) => {
      return column.key;
    });

    this.displayedColumns = this.tableColumns.map((column) => {
      return column.key;
    });

    /* ---------------------- */
    /* --- Forms settings --- */
    /* ---------------------- */

    this.createAdvancedSearchForm = () => {
      return new FormGroup({
        id: new FormControl(''),
        status: new FormControl([]),
        role: new FormControl([]),
        name: new FormControl(''),
        surname: new FormControl(''),
        patronymic: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        localities: new FormControl([]),
        divisions: new FormControl([]),
        cars: new FormControl([]),
        dismissalReason: new FormControl(''),
        createdAtFrom: new FormControl(''),
        createdAtTo: new FormControl(''),
        updatedAtFrom: new FormControl(''),
        updatedAtTo: new FormControl(''),
      });
    };

    /* ----------------------- */
    /* --- Request actions --- */
    /* ----------------------- */

    this.createServerRequestFilter = () => {
      return {
        status:
          this.advancedSearchForm.get('status').value.length > 0
            ? this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value,
                undefined,
                this.converter.convertArrayOfAnyToString
              )
            : undefined,
        role:
          this.advancedSearchForm.get('role').value.length > 0
            ? this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('role').value,
                undefined,
                this.converter.convertArrayOfAnyToString
              )
            : undefined,
        name:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('name').value
          ) || undefined,
        surname:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('surname').value
          ) || undefined,
        patronymic:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('patronymic').value
          ) || undefined,
        email:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('email').value
          ) || undefined,
        phone:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('phone').value
          ) || undefined,
        localities:
          this.advancedSearchForm.get('localities').value.length <= 0 ||
          this.advancedSearchForm.get('localities').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('localities').value
              ),
        divisions:
          this.advancedSearchForm.get('divisions').value.length <= 0 ||
          this.advancedSearchForm.get('divisions').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('divisions').value
              ),
        cars:
          this.advancedSearchForm.get('cars').value.length <= 0 ||
          this.advancedSearchForm.get('cars').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('cars').value
              ),
        dismissalReason:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('dismissalReason').value
          ) || undefined,
        createdAt: this.converter.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('createdAtFrom').value,
          this.advancedSearchForm.get('createdAtTo').value
        ),
        updatedAt: this.converter.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('updatedAtFrom').value,
          this.advancedSearchForm.get('updatedAtTo').value
        ),
      };
    };

    this.onTableRequest = (request, withLoading) => {
      this.store.dispatch(
        EmployeeActions.getEmployeesRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('employees', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.employees && this.employees.length > 0) {
          const isExist = this.employees.find((employee) => {
            return employee._id === data.id;
          });
          if (isExist) {
            this.sendRequest(false);
          }
        }
      }
    });

    /* ------------------------ */
    /* --- NgRx connections --- */
    /* ------------------------ */

    this.employees$ = this.store
      .select(EmployeeSelectors.selectEmployees)
      .subscribe((employees) => {
        this.employees = employees;
        if (employees) {
          this.tableData = employees.map((employee) => {
            return {
              id: this.highlightSearchedValue(
                employee._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status:
                employee.status === EmployeeStatus.active
                  ? '<p class="green-text">Активный</p>'
                  : employee.status === EmployeeStatus.vacation
                  ? '<p class="yellow-text">В отпуске</p>'
                  : '<p class="red-text">Не активный</p>',
              role: employeeRoleOptions.find(
                (el) => el.value === employee.role + ''
              ).text,
              name: this.highlightSearchedValue(
                employee.name,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              surname: this.highlightSearchedValue(
                employee.surname,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              patronymic: this.highlightSearchedValue(
                employee.patronymic,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              email: this.highlightSearchedValue(
                employee.email,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              phone: this.highlightSearchedValue(
                employee.phone,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              locality: (employee.locality as ILocality)?.name || '',
              division: (employee.division as IDivision)?.name || '',
              cars: employee.cars
                .map((car: ICar, i) => {
                  return i === 0 ? car.licensePlate : ' ' + car.licensePlate;
                })
                .toString(),
              dismissalReason: employee.dismissalReason || '',
              createdAt: formatDate(
                employee.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                employee.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(EmployeeSelectors.selectGetEmployeesIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(EmployeeSelectors.selectGetEmployeesError)
      .subscribe((error) => {
        if (error) {
          this.getItemsSnackbar = this.snackBar.open(
            'Ошибка при запросе сотрудников. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(EmployeeSelectors.selectGetEmployeesPagination)
      .subscribe((pagination) => {
        this.tablePagination = pagination;
      });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();

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
        this.divisionsOptions = [];
        this.divisions?.forEach((el) => {
          if (this.advancedSearchForm?.get('localities').value?.length > 0) {
            if (
              this.advancedSearchForm
                ?.get('localities')
                .value.includes(el.locality)
            ) {
              this.divisionsOptions.push({ text: el.name, value: el._id });
            }
          } else {
            this.divisionsOptions.push({ text: el.name, value: el._id });
          }
        });
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
          if (this.advancedSearchForm?.get('localities').value?.length > 0) {
            if (this.advancedSearchForm?.get('divisions').value?.length > 0) {
              if (
                this.advancedSearchForm
                  ?.get('divisions')
                  .value.some((ai) => el.divisions.includes(ai))
              ) {
                this.carsOptions.push({ text: el.licensePlate, value: el._id });
              }
            } else {
              if (
                this.advancedSearchForm
                  ?.get('localities')
                  .value.includes(el.locality)
              ) {
                this.carsOptions.push({ text: el.licensePlate, value: el._id });
              }
            }
          } else {
            this.carsOptions.push({ text: el.licensePlate, value: el._id });
          }
        });
      });

    if (this.cars === null) {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    }

    this.socket.get()?.on('cars', (_) => {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    });

    this.advancedSearchForm
      ?.get('localities')
      .valueChanges.subscribe((value) => {
        this.divisionsOptions = [];
        this.divisions?.forEach((el) => {
          if (value?.length > 0) {
            if (value.includes(el.locality)) {
              this.divisionsOptions.push({ text: el.name, value: el._id });
            }
          } else {
            this.divisionsOptions.push({ text: el.name, value: el._id });
          }
        });

        const newDivisionsArray = [];
        this.advancedSearchForm.get('divisions').value.forEach((el) => {
          const hasThisOption = this.divisionsOptions.find(
            (option) => option.value === el
          );
          if (hasThisOption) {
            newDivisionsArray.push(el);
          }
        });
        this.advancedSearchForm.get('divisions').setValue(newDivisionsArray);

        this.carsOptions = [];
        this.cars?.forEach((el) => {
          if (value?.length > 0) {
            if (value.includes(el.locality)) {
              this.carsOptions.push({ text: el.licensePlate, value: el._id });
            }
          } else {
            this.carsOptions.push({ text: el.licensePlate, value: el._id });
          }
        });

        const newCarsArray = [];
        this.advancedSearchForm.get('cars').value.forEach((el) => {
          const hasThisOption = this.carsOptions.find(
            (option) => option.value === el
          );
          if (hasThisOption) {
            newCarsArray.push(el);
          }
        });
        this.advancedSearchForm.get('cars').setValue(newCarsArray);
      });

    this.advancedSearchForm
      ?.get('divisions')
      .valueChanges.subscribe((value) => {
        this.carsOptions = [];
        this.cars?.forEach((el) => {
          if (value?.length > 0) {
            if (value.some((ai) => el.divisions.includes(ai))) {
              this.carsOptions.push({ text: el.licensePlate, value: el._id });
            }
          } else {
            this.carsOptions.push({ text: el.licensePlate, value: el._id });
          }
        });

        const newCarsArray = [];
        this.advancedSearchForm.get('cars').value.forEach((el) => {
          const hasThisOption = this.carsOptions.find(
            (option) => option.value === el
          );
          if (hasThisOption) {
            newCarsArray.push(el);
          }
        });
        this.advancedSearchForm.get('cars').setValue(newCarsArray);
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.employees$?.unsubscribe?.();
    this.localities$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
  }

  public onTableItemClick(index: number): void {
    const currentItemId =
      this.employees && this.employees[index] && this.employees[index]._id
        ? this.employees[index]._id
        : undefined;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
