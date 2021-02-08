import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as CarActions from '../../../../store/car/car.actions';
import * as CarSelectors from '../../../../store/car/car.selectors';
import { TablePageComponent } from '../../table-page.component';
import { ICar } from '../../../../models/Car';
import CarStatus from '../../../../models/enums/CarStatus';
import CarType from '../../../../models/enums/CarType';
import { IEmployee } from '../../../../models/Employee';
import carTypeOptions from '../../../../data/carTypeOptions';
import carStatusOptions from '../../../../data/carStatusOptions';

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
        key: 'type',
        title: 'Тип',
        isSorting: true,
      },
      {
        key: 'licensePlate',
        title: 'Номер',
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
        type: new FormControl(
          this.converter.getArrayOfStringedEnumKeys(CarType)
        ),
        licensePlate: new FormControl(''),
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
        type: this.converter.getArrayOrUndefined<string>(
          this.advancedSearchForm.get('type').value,
          undefined,
          this.converter.convertArrayOfAnyToString
        ),
        status: this.converter.getArrayOrUndefined<string>(
          this.advancedSearchForm.get('status').value,
          undefined,
          this.converter.convertArrayOfAnyToString
        ),
        licensePlate:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('licensePlate').value
          ) || undefined,
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
          this.advancedSearchForm.get('drivers').value,
          1
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
              type:
                car.type === CarType.small
                  ? 'Легковой'
                  : car.type === CarType.van
                  ? 'Фургон'
                  : car.type === CarType.tipper
                  ? 'Самосвал'
                  : car.type,
              licensePlate: this.highlightSearchedValue(
                car.licensePlate,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
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
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.cars$?.unsubscribe?.();
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
