import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as LocalitiesActions from '../../../../store/localities/localities.actions';
import * as LocalitiesSelectors from '../../../../store/localities/localities.selectors';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { ICar } from 'src/app/models/Car';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { TablePageComponent } from '../../table-page.component';
import simpleStatusOptions from '../../../../data/simpleStatusOptions';

@Component({
  selector: 'app-localities-table',
  templateUrl: './localities-table.component.html',
  styleUrls: ['./localities-table.component.scss'],
})
export class LocalitiesTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private localities$: Subscription;
  private localities: ILocality[];

  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];
  public employeesOptions$: Subscription;
  public employeesOptions: OptionType[] = [];

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
        key: 'divisions',
        title: 'Подразделения',
        isSorting: false,
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
        divisions: new FormControl([]),
        cars: new FormControl([]),
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
    this.options.initDivisionsOptions();
    this.options.initCarsOptions();
    this.options.initEmployeesOptions();

    this.afterAdvancedSearchFormInit = () => {
      /* ---------------- */
      /* Options requests */
      /* ---------------- */

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

      /* Cars */
      this.carsOptions$?.unsubscribe();
      this.carsOptions$ = this.options.getCarsOptions({}).subscribe((value) => {
        this.carsOptions = value;
      });

      this.advancedSearchForm
        ?.get('divisions')
        .valueChanges.subscribe((fieldValues) => {
          this.advancedSearchForm.get('employees').setValue([]);

          /* Employees */
          this.employeesOptions$?.unsubscribe();
          this.employeesOptions$ = this.options
            .getEmployeesOptions({ divisionsIds: fieldValues })
            .subscribe((value) => {
              this.employeesOptions = value;
            });

          /* Cars */
          this.carsOptions$?.unsubscribe();
          this.carsOptions$ = this.options
            .getCarsOptions({ divisionsIds: fieldValues })
            .subscribe((value) => {
              this.carsOptions = value;
            });
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
        LocalitiesActions.getLocalitiesRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('localities', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.localities && this.localities.length > 0) {
          const isExist = this.localities.find((locality) => {
            return locality._id === data.id;
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

    this.localities$ = this.store
      .select(LocalitiesSelectors.selectLocalities)
      .subscribe((localities) => {
        this.localities = localities;
        if (localities) {
          this.tableData = localities.map((locality) => {
            let statusText = '';
            switch (locality.status) {
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
                locality._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: statusText,
              name: this.highlightSearchedValue(
                locality.name,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              divisions: locality.divisions
                .map((division: IDivision, i) => {
                  return i === 0 ? division.name : ' ' + division.name;
                })
                .toString(),
              cars: locality.cars
                .map((car: ICar, i) => {
                  return i === 0 ? car.licensePlate : ' ' + car.licensePlate;
                })
                .toString(),
              employees: locality.employees
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
                locality.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                locality.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectGetLocalitiesIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(LocalitiesSelectors.selectGetLocalitiesError)
      .subscribe((error) => {
        if (error) {
          this.getItemsSnackbar = this.snackBar.open(
            'Ошибка при запросе населённых пунктов. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(LocalitiesSelectors.selectGetLocalitiesPagination)
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

    this.localities$?.unsubscribe?.();
    this.socket.get()?.off('localities');

    this.options.destroyDivisionsOptions();
    this.options.destroyCarsOptions();
    this.options.destroyEmployeesOptions();
  }

  public onTableItemClick(index: number): void {
    const currentItemId =
      this.localities && this.localities[index] && this.localities[index]._id
        ? this.localities[index]._id
        : undefined;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
