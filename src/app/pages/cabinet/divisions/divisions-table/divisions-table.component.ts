import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TablePageComponent } from '../../table-page.component';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as DivisionsActions from '../../../../store/divisions/divisions.actions';
import * as DivisionsSelectors from '../../../../store/divisions/divisions.selectors';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { ICar } from '../../../../models/Car';
import { IEmployee } from '../../../../models/Employee';
import simpleStatusOptions from 'src/app/data/simpleStatusOptions';

@Component({
  selector: 'app-divisions-table',
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss'],
})
export class DivisionsTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private divisions$: Subscription;
  private divisions: IDivision[];

  public simpleStatusOptions = simpleStatusOptions;

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
        key: 'name',
        title: 'Название',
        isSorting: true,
      },
      {
        key: 'street',
        title: 'Адрес',
        isSorting: true,
      },
      {
        key: 'house',
        title: 'Дом',
        isSorting: true,
      },
      {
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: true,
      },
      {
        key: 'cars',
        title: 'Автомобили',
        isSorting: false,
      },
      {
        key: 'employees',
        title: 'Сотрудники',
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
        name: new FormControl(''),
        street: new FormControl(''),
        house: new FormControl(''),
        localities: new FormControl([]),
        cars: new FormControl([]),
        employees: new FormControl([]),
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
        name:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('name').value
          ) || undefined,
        status:
          this.advancedSearchForm.get('status').value.length <= 0 ||
          this.advancedSearchForm.get('status').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value
              ),
        street:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('street').value
          ) || undefined,
        house:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('house').value
          ) || undefined,
        localities:
          this.advancedSearchForm.get('localities').value.length <= 0 ||
          this.advancedSearchForm.get('localities').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('localities').value
              ),
        cars:
          this.advancedSearchForm.get('cars').value.length <= 0 ||
          this.advancedSearchForm.get('cars').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('cars').value
              ),
        employees:
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
        DivisionsActions.getDivisionsRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('divisions', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.divisions && this.divisions.length > 0) {
          const isExist = this.divisions.find((division) => {
            return division._id === data.id;
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

    this.divisions$ = this.store
      .select(DivisionsSelectors.selectDivisions)
      .subscribe((divisions) => {
        this.divisions = divisions;
        if (divisions) {
          this.tableData = divisions.map((division) => {
            let statusText = '';
            switch (division.status) {
              case SimpleStatus.active:
                statusText = `<p class="green-text">${
                  this.simpleStatusOptions.find(
                    (el) => el.value === SimpleStatus.active + ''
                  ).text
                }</p>`;
                break;
              case SimpleStatus.inactive:
                statusText = `<p class="red-text">${
                  this.simpleStatusOptions.find(
                    (el) => el.value === SimpleStatus.inactive + ''
                  ).text
                }</p>`;
                break;
            }

            return {
              id: this.highlightSearchedValue(
                division._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: statusText,
              name: this.highlightSearchedValue(
                division.name,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              locality:
                this.highlightSearchedValue(
                  (division.locality as ILocality)?.name,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
              street:
                this.highlightSearchedValue(
                  division.street,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
              house:
                this.highlightSearchedValue(
                  division.house,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
              cars: division.cars
                .map((car: ICar, i) => {
                  return i === 0 ? car.licensePlate : ' ' + car.licensePlate;
                })
                .toString(),
              employees: division.employees
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
                division.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                division.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(DivisionsSelectors.selectGetDivisionsIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(DivisionsSelectors.selectGetDivisionsError)
      .subscribe((error) => {
        if (error) {
          this.getItemsSnackbar = this.snackBar.open(
            'Ошибка при запросе подразделений. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(DivisionsSelectors.selectGetDivisionsPagination)
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
    this.divisions$?.unsubscribe?.();
  }

  public onTableItemClick(index: number): void {
    const currentItemId = this.divisions?.[index]?._id;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
