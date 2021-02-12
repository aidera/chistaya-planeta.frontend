import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as AppSelectors from '../../../../store/app/app.selectors';
import * as AppActions from '../../../../store/app/app.actions';
import * as CarActions from '../../../../store/car/car.actions';
import * as CarSelectors from '../../../../store/car/car.selectors';
import { TablePageComponent } from '../../table-page.component';
import { ICar } from '../../../../models/Car';
import CarStatus from '../../../../models/enums/CarStatus';
import CarType from '../../../../models/enums/CarType';
import { IEmployee } from '../../../../models/Employee';
import carTypeOptions from '../../../../data/carTypeOptions';
import carStatusOptions from '../../../../data/carStatusOptions';
import { ILocality } from '../../../../models/Locality';
import { IDivision, IDivisionLessInfo } from '../../../../models/Division';
import { OptionType } from '../../../../models/types/OptionType';

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
  private localities$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];
  public divisionsOptions: OptionType[];

  public carTypeOptions = carTypeOptions;
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
        status: new FormControl(
          this.converter.getArrayOfStringedEnumKeys(CarStatus)
        ),
        licensePlate: new FormControl(''),
        type: new FormControl(
          this.converter.getArrayOfStringedEnumKeys(CarType)
        ),
        localities: new FormControl([]),
        divisions: new FormControl([]),
        weight: new FormControl(''),
        isCorporate: new FormControl(['true', 'false']),
        drivers: new FormControl(''),
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
        status: this.converter.getArrayOrUndefined<string>(
          this.advancedSearchForm.get('status').value,
          undefined,
          this.converter.convertArrayOfAnyToString
        ),
        licensePlate:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('licensePlate').value
          ) || undefined,
        type: this.converter.getArrayOrUndefined<string>(
          this.advancedSearchForm.get('type').value,
          undefined,
          this.converter.convertArrayOfAnyToString
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
        drivers: this.converter.getArrayOrUndefined<string>(
          this.advancedSearchForm.get('drivers').value
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
        CarActions.getCarsRequest({ params: request, withLoading })
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
      .select(CarSelectors.selectCars)
      .subscribe((cars) => {
        this.cars = cars;
        if (cars) {
          this.tableData = cars.map((car) => {
            return {
              id: this.highlightSearchedValue(
                car._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status:
                car.status === CarStatus.active
                  ? '<p class="green-text">Активный</p>'
                  : car.status === CarStatus.temporaryUnavailable
                  ? '<p class="yellow-text">Временно не активный</p>'
                  : car.status === CarStatus.unavailable
                  ? '<p class="red-text">Не активный</p>'
                  : '-',
              licensePlate: this.highlightSearchedValue(
                car.licensePlate,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              type:
                car.type === CarType.small
                  ? 'Легковой'
                  : car.type === CarType.van
                  ? 'Фургон'
                  : car.type === CarType.tipper
                  ? 'Самосвал'
                  : car.type,
              locality: (car.locality as ILocality)?.name,
              divisions: car.divisions
                .map((division: IDivision, i) => {
                  return i === 0 ? division.name : ' ' + division.name;
                })
                .toString(),
              weight: this.highlightSearchedValue(
                String(car.weight),
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              isCorporate: car.isCorporate ? 'Корпоративный' : 'Частный',
              drivers: car.drivers
                .map((driver: IEmployee, i) => {
                  return i === 0
                    ? driver.surname + ' ' + driver.name
                    : ' ' + driver.surname + ' ' + driver.name;
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
      .select(CarSelectors.selectGetCarsIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(CarSelectors.selectGetCarsError)
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
      .select(CarSelectors.selectGetCarsPagination)
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
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.cars$?.unsubscribe?.();
    this.localities$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
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
