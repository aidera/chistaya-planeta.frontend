import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TablePageComponent } from '../../table-page.component';
import { Subscription } from 'rxjs';
import { formatDate, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as DivisionsActions from '../../../../store/divisions/divisions.actions';
import * as DivisionsSelectors from '../../../../store/divisions/divisions.selectors';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { ICar } from '../../../../models/Car';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import {
  simpleStatusColors,
  simpleStatusOptions,
  simpleStatusStrings,
} from '../../../../data/simpleStatusData';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { GettersService } from '../../../../services/getters/getters.service';

@Component({
  selector: 'app-divisions-table',
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss'],
})
export class DivisionsTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  /* ------------------- */
  /* Main items settings */
  /* ------------------- */
  public items: IDivision[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];
  public employeesOptions$: Subscription;
  public employeesOptions: OptionType[] = [];

  /* ----------- */
  /* Static data */
  /* ----------- */
  public simpleStatusOptions = simpleStatusOptions;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected getters: GettersService,
    protected location: Location,
    @Inject(LOCALE_ID) protected locale: string,
    protected snackBar: MatSnackBar,
    protected options: OptionsService,
    protected socket: SocketIoService,
    /* this */
    private title: Title
  ) {
    super(store, router, route, getters, location);

    title.setTitle('Подразделения - Чистая планета');
  }

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

    /* --------------------- */
    /* --- Options init --- */
    /* --------------------- */
    this.options.initLocalitiesOptions();
    this.options.initCarsOptions();
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

      /* Cars */
      this.carsOptions$?.unsubscribe();
      this.carsOptions$ = this.options.getCarsOptions({}).subscribe((value) => {
        this.carsOptions = value;
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
          this.advancedSearchForm.get('cars').setValue([]);
          this.advancedSearchForm.get('employees').setValue([]);

          /* Cars */
          this.carsOptions$?.unsubscribe();
          this.carsOptions$ = this.options
            .getCarsOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.carsOptions = value;
            });

          /* Employees */
          this.employeesOptions$?.unsubscribe();
          this.employeesOptions$ = this.options
            .getEmployeesOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.employeesOptions = value;
            });
        });
    };

    /* ----------------------- */
    /* --- Request actions --- */
    /* ----------------------- */

    this.createServerRequestFilter = () => {
      return {
        name:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('name').value
          ) || undefined,
        status:
          this.advancedSearchForm.get('status').value.length <= 0 ||
          this.advancedSearchForm.get('status').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value
              ),
        street:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('street').value
          ) || undefined,
        house:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('house').value
          ) || undefined,
        localities:
          this.advancedSearchForm.get('localities').value.length <= 0 ||
          this.advancedSearchForm.get('localities').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('localities').value
              ),
        cars:
          this.advancedSearchForm.get('cars').value.length <= 0 ||
          this.advancedSearchForm.get('cars').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('cars').value
              ),
        employees:
          this.advancedSearchForm.get('employees').value.length <= 0 ||
          this.advancedSearchForm.get('employees').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('employees').value
              ),
        createdAt: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('createdAtFrom').value,
          this.advancedSearchForm.get('createdAtTo').value
        ),
        updatedAt: this.getters.getServerFromToDateInISOStringArray(
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
        if (this.items && this.items.length > 0) {
          const isExist = this.items.find((division) => {
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

    this.items$ = this.store
      .select(DivisionsSelectors.selectDivisions)
      .subscribe((divisions) => {
        this.items = divisions;
        if (divisions) {
          this.tableData = divisions.map((division) => {
            return {
              id: this.highlightSearchedValue(
                division._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${simpleStatusColors[division.status]}-text">${
                simpleStatusStrings[division.status]
              }</p>`,
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
                    ? this.getters.getUserInitials(
                        employee.name,
                        employee.surname,
                        employee.patronymic
                      )
                    : ' ' +
                        this.getters.getUserInitials(
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
          this.getItemsResultSnackbar = this.snackBar.open(
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

    this.socket.get()?.off('divisions');

    this.options.destroyLocalitiesOptions();
    this.options.destroyCarsOptions();
    this.options.destroyEmployeesOptions();
  }
}
