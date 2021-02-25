import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as CarsActions from '../../../../store/cars/cars.actions';
import * as CarsSelectors from '../../../../store/cars/cars.selectors';
import { ICar } from '../../../../models/Car';
import { ILocality } from '../../../../models/Locality';
import { IDivision } from '../../../../models/Division';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import { carTypeOptions, carTypeStrings } from '../../../../data/carTypeData';
import {
  carStatusOptions,
  carStatusColors,
  carStatusStrings,
} from '../../../../data/carStatusData';
import { TablePageComponent } from '../../table-page.component';
import EmployeeRole from '../../../../models/enums/EmployeeRole';

@Component({
  selector: 'app-cars-table',
  templateUrl: './cars-table.component.html',
  styleUrls: ['./cars-table.component.scss'],
})
export class CarsTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private cars$: Subscription;
  private cars: ICar[];

  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public employeesOptions$: Subscription;
  public employeesOptions: OptionType[] = [];

  public carTypeOptions = carTypeOptions;
  public carTypeStrings = carTypeStrings;
  public carStatusOptions = carStatusOptions;

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
        key: 'licensePlate',
        title: 'Номер',
        isSorting: true,
      },
      {
        key: 'type',
        title: 'Тип',
        isSorting: true,
      },
      {
        key: 'weight',
        title: 'Вес, т',
        isSorting: true,
      },
      {
        key: 'isCorporate',
        title: 'Приндлежность',
        isSorting: true,
      },
      {
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: true,
      },
      {
        key: 'divisions',
        title: 'Подразделения',
        isSorting: false,
      },
      {
        key: 'drivers',
        title: 'Водители',
        isSorting: false,
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
        licensePlate: new FormControl(''),
        type: new FormControl([]),
        weight: new FormControl(''),
        isCorporate: new FormControl([]),
        localities: new FormControl([]),
        divisions: new FormControl([]),
        employees: new FormControl([]),
        createdAtFrom: new FormControl(''),
        createdAtTo: new FormControl(''),
        updatedAtFrom: new FormControl(''),
        updatedAtTo: new FormControl(''),
      });
    };

    /* --------------------- */
    /* --- Options init --- */
    /* --------------------- */
    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initEmployeesOptions();

    this.afterAdvancedSearchFormInit = () => {
      /* ---------------- */
      /* Options requests */
      /* ---------------- */

      /* Localities */
      this.localitiesOptions$?.unsubscribe();
      this.localitiesOptions$ = this.options
        .getLocalitiesOptions({})
        .subscribe((value) => {
          this.localitiesOptions = value;
        });

      /* Divisions */
      this.divisionsOptions$?.unsubscribe();
      this.divisionsOptions$ = this.options
        .getDivisionsOptions({})
        .subscribe((value) => {
          this.divisionsOptions = value;
        });

      /* Employees */
      this.employeesOptions$?.unsubscribe();
      this.employeesOptions$ = this.options
        .getEmployeesOptions({})
        .subscribe((value) => {
          this.employeesOptions = value;
        });

      this.advancedSearchForm
        ?.get('localities')
        .valueChanges.subscribe((fieldValues) => {
          this.advancedSearchForm.get('divisions').setValue([]);
          this.advancedSearchForm.get('employees').setValue([]);

          /* Divisions */
          this.divisionsOptions$?.unsubscribe();
          this.divisionsOptions$ = this.options
            .getDivisionsOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.divisionsOptions = value;
            });

          /* Employees */
          this.employeesOptions$?.unsubscribe();
          this.employeesOptions$ = this.options
            .getEmployeesOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.driver],
            })
            .subscribe((value) => {
              this.employeesOptions = value;
            });
        });

      this.advancedSearchForm
        ?.get('divisions')
        .valueChanges.subscribe((fieldValues) => {
          this.advancedSearchForm.get('employees').setValue([]);

          /* Employees */
          this.employeesOptions$?.unsubscribe();
          this.employeesOptions$ = this.options
            .getEmployeesOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.driver],
            })
            .subscribe((value) => {
              this.employeesOptions = value;
              if (value === null) {
                this.options.initEmployeesOptions();
              }
            });
        });
    };

    /* ----------------------- */
    /* --- Request actions --- */
    /* ----------------------- */

    this.createServerRequestFilter = () => {
      return {
        status:
          this.advancedSearchForm.get('status').value.length <= 0 ||
          this.advancedSearchForm.get('status').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value
              ),
        licensePlate:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('licensePlate').value
          ) || undefined,
        type:
          this.advancedSearchForm.get('type').value.length <= 0 ||
          this.advancedSearchForm.get('type').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('type').value
              ),
        weight: this.converter.getArrayOrUndefined<number | null>(
          this.advancedSearchForm.get('weight').value,
          2,
          this.converter.convertArrayOfStringsToNullOrString
        ),
        isCorporate: this.converter.getArrayOrUndefined<boolean>(
          this.advancedSearchForm.get('isCorporate').value,
          1,
          this.converter.convertArrayOfStringedBooleanToRealBoolean
        ),
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
        drivers:
          this.advancedSearchForm.get('employees').value.length <= 0 ||
          this.advancedSearchForm.get('employees').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('employees').value
              ),
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
        CarsActions.getCarsRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('cars', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.cars && this.cars.length > 0) {
          const isExist = this.cars.find((car) => {
            return car._id === data.id;
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

    this.cars$ = this.store
      .select(CarsSelectors.selectCars)
      .subscribe((cars) => {
        this.cars = cars;
        if (cars) {
          this.tableData = cars.map((car) => {
            const isCorporateText = car.isCorporate
              ? 'Корпоративный'
              : 'Частный';

            return {
              id: this.highlightSearchedValue(
                car._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${carStatusColors[car.status]}-text">${
                carStatusStrings[car.status]
              }</p>`,
              licensePlate: this.highlightSearchedValue(
                car.licensePlate,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              type: carTypeStrings[car.type],
              weight: this.highlightSearchedValue(
                String(car.weight),
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              isCorporate: isCorporateText,
              locality: (car.locality as ILocality)?.name,
              divisions: car.divisions
                .map((division: IDivision, i) => {
                  return i === 0 ? division.name : ' ' + division.name;
                })
                .toString(),
              drivers: car.drivers
                .map((employee: IEmployee, i) => {
                  return i === 0
                    ? this.converter.getUserInitials(
                        employee.name,
                        employee.surname,
                        employee.patronymic
                      )
                    : ' ' +
                        this.converter.getUserInitials(
                          employee.name,
                          employee.surname,
                          employee.patronymic
                        );
                })
                .toString(),
              createdAt: formatDate(
                car.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                car.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(CarsSelectors.selectGetCarsIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(CarsSelectors.selectGetCarsError)
      .subscribe((error) => {
        if (error) {
          this.getItemsSnackbar = this.snackBar.open(
            'Ошибка при запросе автомобилей. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(CarsSelectors.selectGetCarsPagination)
      .subscribe((pagination) => {
        this.tablePagination = pagination;
      });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.cars$?.unsubscribe?.();
    this.socket.get()?.off('cars');

    this.options.destroyLocalitiesOptions();
    this.options.destroyDivisionsOptions();
    this.options.destroyEmployeesOptions();
  }

  public onTableItemClick(index: number): void {
    const currentItemId =
      this.cars && this.cars[index] && this.cars[index]._id
        ? this.cars[index]._id
        : undefined;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
