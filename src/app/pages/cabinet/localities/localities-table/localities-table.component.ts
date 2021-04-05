import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as LocalitiesActions from '../../../../store/localities/localities.actions';
import * as LocalitiesSelectors from '../../../../store/localities/localities.selectors';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { ICar } from 'src/app/models/Car';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import { TablePageComponent } from '../../table-page.component';
import {
  simpleStatusColors,
  simpleStatusOptions,
  simpleStatusStrings,
} from '../../../../data/simpleStatusData';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { GettersService } from '../../../../services/getters/getters.service';

@Component({
  selector: 'app-localities-table',
  templateUrl: './localities-table.component.html',
  styleUrls: ['./localities-table.component.scss'],
})
export class LocalitiesTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  /* ------------------- */
  /* Main items settings */
  /* ------------------- */
  public items: ILocality[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
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

    title.setTitle('Населённые пункты - Чистая планета');
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
            .getEmployeesOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.employeesOptions = value;
            });

          /* Cars */
          this.carsOptions$?.unsubscribe();
          this.carsOptions$ = this.options
            .getCarsOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
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
        divisions:
          this.advancedSearchForm.get('divisions').value.length <= 0 ||
          this.advancedSearchForm.get('divisions').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('divisions').value
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
        LocalitiesActions.getLocalitiesRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('localities', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.items && this.items.length > 0) {
          const isExist = this.items.find((locality) => {
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

    this.items$ = this.store
      .select(LocalitiesSelectors.selectLocalities)
      .subscribe((localities) => {
        this.items = localities;
        if (localities) {
          this.tableData = localities.map((locality) => {
            return {
              id: this.highlightSearchedValue(
                locality._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${simpleStatusColors[locality.status]}-text">${
                simpleStatusStrings[locality.status]
              }</p>`,
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
          this.getItemsResultSnackbar = this.snackBar.open(
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

    this.socket.get()?.off('localities');

    this.options.destroyDivisionsOptions();
    this.options.destroyCarsOptions();
    this.options.destroyEmployeesOptions();
  }
}
