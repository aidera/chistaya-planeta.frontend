import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import * as fromRoot from '../../store/root.reducer';
import * as AppSelectors from '../../store/app/app.selectors';
import * as AppActions from '../../store/app/app.actions';
import { PaginationType } from '../../models/types/PaginationType';
import { ConverterService } from '../../services/converter/converter.service';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ServerFilterRequest } from '../../models/types/ServerFilterRequest';
import { dateISOStringRegex } from '../../utils/regexes';
import {
  TableColumnType,
  TableDataType,
  TableDisplayOutputType,
  TableSortType,
} from '../../components/table/table.component';
import { removeURLParameter } from '../../utils/removeUrlParameter';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { OptionType } from '../../models/types/OptionType';
import { IDivisionLessInfo } from '../../models/Division';
import { ICarLessInfo } from '../../models/Car';
import { ILocalityLessInfo } from '../../models/Locality';
import { IEmployeeLessInfo } from '../../models/Employee';

@Component({
  template: '',
})
export class TablePageComponent implements OnInit, OnDestroy {
  /* ------------------- */
  /* Main items settings */
  /* ------------------- */
  protected isFetching$: Subscription;
  public isFetching: boolean;
  protected getItemsError$: Subscription;
  public getItemsError: string | null;
  protected pagination$: Subscription;

  /* -------------- */
  /* Table settings */
  /* -------------- */
  public tableColumns: TableColumnType[];
  public tableData: TableDataType[] | null = null;
  public columnsCanBeDisplayed: TableDisplayOutputType[];
  public displayedColumns: TableDisplayOutputType[];
  public tableSorting: TableSortType;
  public tablePagination: PaginationType;

  /* ------------- */
  /* Form settings */
  /* ------------- */
  public currentForm: 'quick' | 'advanced' = 'quick';
  public createAdvancedSearchForm: () => FormGroup;
  public quickSearchForm: FormGroup;
  public advancedSearchForm: FormGroup;

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  protected useLocalitiesOptions = true;
  private localitiesToSelect$: Subscription;
  public localitiesToSelect: ILocalityLessInfo[];
  protected localitiesToSelectCallback: (
    localitiesToSelect: ILocalityLessInfo[]
  ) => void;
  public localitiesOptions: OptionType[] = [];
  //
  protected useDivisionsOptions = true;
  private divisionsToSelect$: Subscription;
  public divisionsToSelect: IDivisionLessInfo[];
  protected divisionsToSelectCallback: (
    divisionsToSelect: IDivisionLessInfo[]
  ) => void;
  public divisionsOptions: OptionType[] = [];
  //
  protected useCarsOptions = true;
  private carsToSelect$: Subscription;
  public carsToSelect: ICarLessInfo[];
  protected carsToSelectCallback: (carsToSelect: ICarLessInfo[]) => void;
  public carsOptions: OptionType[] = [];
  //
  protected useEmployeesOptions = true;
  private employeesToSelect$: Subscription;
  public employeesToSelect: IEmployeeLessInfo[];
  protected employeesToSelectCallback: (
    employeesToSelect: IEmployeeLessInfo[]
  ) => void;
  public employeesOptions: OptionType[] = [];

  /* ---------------- */
  /* Request settings */
  /* ---------------- */
  public createServerRequestFilter?: () => ServerFilterRequest | undefined;
  public onTableRequest: (
    request: GetRouteParamsType,
    withLoading: boolean
  ) => any;
  protected getItemsSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    protected store: Store<fromRoot.State>,
    @Inject(LOCALE_ID) protected locale: string,
    protected converter: ConverterService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected socket: SocketIoService,
    protected snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    /* ---------------------------------- */
    /* Execute errors for required params */
    /* ---------------------------------- */

    if (this.tableColumns === undefined) {
      throw new Error(
        'You should define tableColumns as a TableColumnType[] in your class'
      );
    }

    if (this.createAdvancedSearchForm === undefined) {
      throw new Error(
        'You should define createAdvancedSearchForm as a function that returns FormGroup in your class'
      );
    }

    if (this.displayedColumns === undefined) {
      throw new Error(
        'You should define displayedColumns as a TableDisplayOutputType[] in your class'
      );
    }

    if (this.columnsCanBeDisplayed === undefined) {
      throw new Error(
        'You should define columnsCanBeDisplayed as a TableDisplayOutputType[] in your class'
      );
    }

    /* ------------------------------ */
    /* Initializing forms and request */
    /* ------------------------------ */

    this.setInitialRequestSettings();

    /* ------------------------------------------------------ */
    /* Getting search, sorting, filters, pages and displaying */
    /* ------------------------------------------------------ */

    this.activatedRoute.queryParams.subscribe((params) => {
      /* Display */
      if (params.display) {
        this.displayedColumns = params.display.split(';');
      }

      /* Sorting */
      if (params.sortingField) {
        if (
          params.sortingType &&
          (params.sortingType === 'asc' || params.sortingType === 'desc')
        ) {
          this.tableSorting = {
            field: params.sortingField,
            type: params.sortingType,
          };
        } else {
          this.tableSorting = { field: params.sortingField, type: 'asc' };
        }
      }

      /* Page */
      if (params.page) {
        const paramsPage = params.page;
        if (this.tablePagination) {
          this.tablePagination = {
            ...this.tablePagination,
            page: !isNaN(+paramsPage) ? +paramsPage : 1,
          };
        }
      } else {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            sortingField: params.sortingField || undefined,
            sortingType: params.sortingType || undefined,
            page: 1,
            search: params.search || undefined,
          },
          queryParamsHandling: 'merge',
        });
        return;
      }

      /* Filters */

      let hasFilter = false;

      // Getting filters from url
      Object.keys(params).forEach((key) => {
        if (key.includes('filter__')) {
          hasFilter = true;
          this.currentForm = 'advanced';

          const fieldName = key.substr(8);
          const fieldValue = params[key].toString();

          if (
            this.advancedSearchForm &&
            this.advancedSearchForm.get(fieldName)
          ) {
            if (fieldValue.includes(';')) {
              const split = fieldValue.split(';');
              this.advancedSearchForm.get(fieldName).setValue(split);
            } else if (dateISOStringRegex.test(fieldValue)) {
              this.advancedSearchForm
                .get(fieldName)
                .setValue(new Date(fieldValue));
            } else {
              if (Array.isArray(this.advancedSearchForm.get(fieldName).value)) {
                this.advancedSearchForm.get(fieldName).setValue([fieldValue]);
              } else {
                this.advancedSearchForm.get(fieldName).setValue(fieldValue);
              }
            }
          }
        }
      });

      if (hasFilter === false && params.search && params.search !== '') {
        this.quickSearchForm.get('search').setValue(params.search);
      }

      this.sendRequest(true);
    });

    /* ---------------- */
    /* Options requests */
    /* ---------------- */

    /* Localities */
    if (this.useLocalitiesOptions) {
      this.localitiesToSelect$ = this.store
        .select(AppSelectors.selectLocalitiesToSelect)
        .subscribe((localitiesToSelect) => {
          this.localitiesToSelect = localitiesToSelect;
          this.localitiesOptions = [];
          localitiesToSelect?.forEach((el) => {
            this.localitiesOptions.push({ text: el.name, value: el._id });
          });
          this.localitiesToSelectCallback?.(localitiesToSelect);
        });

      if (this.localitiesToSelect === null) {
        this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
      }

      this.socket.get()?.on('localities', (_) => {
        this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
      });
    }

    /* Divisions */
    if (this.useDivisionsOptions) {
      this.divisionsToSelect$ = this.store
        .select(AppSelectors.selectDivisionsToSelect)
        .subscribe((divisionsToSelect) => {
          this.divisionsToSelect = divisionsToSelect;
          this.divisionsOptions = [];
          this.updateDivisionsOptions();
          this.divisionsToSelectCallback?.(divisionsToSelect);
        });

      if (this.divisionsToSelect === null) {
        this.store.dispatch(AppActions.getDivisionsToSelectRequest());
      }

      this.socket.get()?.on('divisions', (_) => {
        this.store.dispatch(AppActions.getDivisionsToSelectRequest());
      });
    }

    /* Cars */
    if (this.useCarsOptions) {
      this.carsToSelect$ = this.store
        .select(AppSelectors.selectCarsToSelect)
        .subscribe((carsToSelect) => {
          this.carsToSelect = carsToSelect;
          this.updateCarsOptions();
          this.carsToSelectCallback?.(carsToSelect);
        });

      if (this.carsToSelect === null) {
        this.store.dispatch(AppActions.getCarsToSelectRequest());
      }

      this.socket.get()?.on('cars', (_) => {
        this.store.dispatch(AppActions.getCarsToSelectRequest());
      });
    }

    /* Employees */
    if (this.useEmployeesOptions) {
      this.employeesToSelect$ = this.store
        .select(AppSelectors.selectEmployeesToSelect)
        .subscribe((employeesToSelect) => {
          this.employeesToSelect = employeesToSelect;
          this.updateEmployeesOptions();
          this.employeesToSelectCallback?.(employeesToSelect);
        });

      if (this.employeesToSelect === null) {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      }

      this.socket.get()?.on('employees', (_) => {
        this.store.dispatch(AppActions.getEmployeesToSelectRequest());
      });
    }

    /* Listening for localities form field value change to update divisions, cars and employees */
    this.advancedSearchForm?.get('localities')?.valueChanges.subscribe((_) => {
      this.updateDivisionsOptions();
      this.updateDivisionsValue();
      if (
        this.advancedSearchForm &&
        !this.advancedSearchForm.get('divisions')
      ) {
        this.updateCarsOptions();
        this.updateCarsValue();
        this.updateEmployeesOptions();
        this.updateEmployeesValue();
      }
    });

    /* Listening for divisions form field value change to update cars and employees */
    this.advancedSearchForm?.get('divisions')?.valueChanges.subscribe((_) => {
      this.updateCarsOptions();
      this.updateCarsValue();
      this.updateEmployeesOptions();
      this.updateEmployeesValue();
    });
  }

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.getItemsError$?.unsubscribe?.();
    this.pagination$?.unsubscribe?.();
    this.localitiesToSelect$?.unsubscribe?.();
    this.divisionsToSelect$?.unsubscribe?.();
    this.carsToSelect$?.unsubscribe?.();
    this.employeesToSelect$?.unsubscribe?.();

    this.socket?.get()?.off('localities');
    this.socket?.get()?.off('divisions');
    this.socket?.get()?.off('cars');
    this.socket?.get()?.off('employees');
  }

  protected updateDivisionsOptions(): void {
    const localitiesValue = this.advancedSearchForm?.get('localities')?.value;

    this.divisionsOptions = [];
    this.divisionsToSelect?.forEach((el) => {
      if (localitiesValue?.length > 0) {
        if (localitiesValue.includes(el.locality)) {
          this.divisionsOptions.push({ text: el.name, value: el._id });
        }
      } else {
        this.divisionsOptions.push({ text: el.name, value: el._id });
      }
    });
  }

  protected updateDivisionsValue(): void {
    const newDivisionsArray = [];

    this.advancedSearchForm.get('divisions')?.value.forEach((el) => {
      const hasThisOption = this.divisionsOptions.find(
        (option) => option.value === el
      );
      if (hasThisOption) {
        newDivisionsArray.push(el);
      }
    });
    this.advancedSearchForm.get('divisions')?.setValue(newDivisionsArray);
  }

  protected updateCarsOptions(): void {
    const localitiesValue =
      this.advancedSearchForm?.get('localities')?.value || [];
    const divisionsValue =
      this.advancedSearchForm?.get('divisions')?.value || [];

    this.carsOptions = [];

    this.carsToSelect?.forEach((el) => {
      if (localitiesValue.length > 0 && !(divisionsValue.length > 0)) {
        if (localitiesValue.includes(el.locality)) {
          this.carsOptions.push({ text: el.licensePlate, value: el._id });
        }
      } else if (divisionsValue.length > 0) {
        if (divisionsValue.some((ai) => el.divisions.includes(ai))) {
          this.carsOptions.push({ text: el.licensePlate, value: el._id });
        }
      } else {
        this.carsOptions.push({ text: el.licensePlate, value: el._id });
      }
    });
  }

  protected updateCarsValue(): void {
    const newCarsArray = [];

    this.advancedSearchForm?.get('cars')?.value.forEach((el) => {
      const hasThisOption = this.carsOptions.find(
        (option) => option.value === el
      );
      if (hasThisOption) {
        newCarsArray.push(el);
      }
    });

    this.advancedSearchForm?.get('cars')?.setValue(newCarsArray);
  }

  protected updateEmployeesOptions(): void {
    const localitiesValue =
      this.advancedSearchForm?.get('localities')?.value || [];
    const divisionsValue =
      this.advancedSearchForm?.get('divisions')?.value || [];

    this.employeesOptions = [];

    this.employeesToSelect?.forEach((el) => {
      if (localitiesValue.length > 0 && !(divisionsValue.length > 0)) {
        if (localitiesValue.includes(el.locality)) {
          this.employeesOptions.push({
            text: this.converter.getUserInitials(
              el.name,
              el.surname,
              el.patronymic
            ),
            value: el._id,
          });
        }
      } else if (divisionsValue.length > 0) {
        if (divisionsValue.includes(el.division)) {
          this.employeesOptions.push({
            text: this.converter.getUserInitials(
              el.name,
              el.surname,
              el.patronymic
            ),
            value: el._id,
          });
        }
      } else {
        this.employeesOptions.push({
          text: this.converter.getUserInitials(
            el.name,
            el.surname,
            el.patronymic
          ),
          value: el._id,
        });
      }
    });
  }

  protected updateEmployeesValue(): void {
    const newEmployeesArray = [];

    this.advancedSearchForm?.get('employees')?.value.forEach((el) => {
      const hasThisOption = this.employeesOptions.find(
        (option) => option.value === el
      );
      if (hasThisOption) {
        newEmployeesArray.push(el);
      }
    });

    this.advancedSearchForm?.get('employees')?.setValue(newEmployeesArray);
  }

  protected highlightSearchedValue(
    rawString: string,
    searchValue: string
  ): string {
    if (searchValue) {
      const clearQuickSearchValue = this.converter
        .clearServerRequestString(searchValue)
        .toLowerCase();
      const clearObjectValue = rawString.toLowerCase();
      const indexFrom = clearObjectValue.indexOf(clearQuickSearchValue);
      if (indexFrom >= 0) {
        const firstPart = rawString.substr(0, indexFrom);
        const objectValuePart = rawString.substr(
          indexFrom,
          clearQuickSearchValue.length
        );
        const lastPart = rawString.substr(indexFrom + objectValuePart.length);
        return (
          firstPart + '<strong>' + objectValuePart + '</strong>' + lastPart
        );
      }
    }
    return rawString;
  }

  private initQuickSearchForm(): void {
    this.quickSearchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.quickSearchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((formValues) => {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            sortingField: this.tableSorting
              ? this.tableSorting.field
              : undefined,
            sortingType: this.tableSorting ? this.tableSorting.type : undefined,
            page: this.tablePagination ? this.tablePagination.page : undefined,
            search: formValues.search ? formValues.search : undefined,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  private initAdvancedSearchForm(): void {
    if (this.advancedSearchForm) {
      const defaultValuesForm = this.createAdvancedSearchForm();
      Object.keys(this.advancedSearchForm.controls).forEach((key) => {
        this.advancedSearchForm
          .get(key)
          .setValue(defaultValuesForm.get(key).value);
      });
    } else {
      this.advancedSearchForm = this.createAdvancedSearchForm();

      // Setting filter values to url
      this.advancedSearchForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((_) => {
          const values = {};
          Object.keys(this.advancedSearchForm.controls).forEach((field) => {
            const fieldValue = this.advancedSearchForm.get(field).value;
            if (fieldValue) {
              const defaultValue = this.createAdvancedSearchForm().get(field)
                .value;
              if (JSON.stringify(defaultValue) !== JSON.stringify(fieldValue)) {
                if (Array.isArray(fieldValue)) {
                  values['filter__' + field] = fieldValue.join(';');
                } else if (fieldValue.getMonth) {
                  values['filter__' + field] = fieldValue.toISOString();
                } else {
                  values['filter__' + field] = fieldValue;
                }
              }
            }
          });

          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              display:
                this.displayedColumns &&
                JSON.stringify(this.displayedColumns) !==
                  JSON.stringify(this.columnsCanBeDisplayed)
                  ? this.displayedColumns.join(';')
                  : undefined,
              sortingField: this.tableSorting
                ? this.tableSorting.field
                : undefined,
              sortingType: this.tableSorting
                ? this.tableSorting.type
                : undefined,
              page: this.tablePagination
                ? this.tablePagination.page
                : undefined,
              ...values,
            },
          });
        });
    }
  }

  private setInitialRequestSettings(): void {
    this.tablePagination = { ...this.tablePagination, page: 1 };
    this.tableSorting = undefined;
    this.displayedColumns = this.columnsCanBeDisplayed;
    this.initQuickSearchForm();
    this.initAdvancedSearchForm();
  }

  public setCurrentForm(value: 'quick' | 'advanced'): void {
    this.setInitialRequestSettings();
    this.currentForm = value;
  }

  public onTableDisplay(event: TableDisplayOutputType[]): void {
    this.displayedColumns = event;

    const isEqual =
      JSON.stringify(event) === JSON.stringify(this.columnsCanBeDisplayed);

    const url = this.router.url;
    const clearUrl = removeURLParameter(url, 'display');
    let newUrl = clearUrl;

    if (clearUrl.includes('?')) {
      if (!isEqual) {
        newUrl = clearUrl + '&display=' + event.join(';');
      }
    } else {
      if (!isEqual) {
        newUrl = clearUrl + '?display=' + event.join(';');
      }
    }

    /* I used location here to not refresh request on display change */
    this.location.go(newUrl);
  }

  public onTableSort(event: TableSortType): void {
    this.tableSorting = event;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        sortingField: this.tableSorting.field,
        sortingType: this.tableSorting.type,
      },
      queryParamsHandling: 'merge',
    });
  }

  public onTablePaginate(newPage: number): void {
    this.tablePagination = { ...this.tablePagination, page: newPage };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: this.tablePagination.page },
      queryParamsHandling: 'merge',
    });
  }

  public onTableItemClick(index: number): void {}

  public sendRequest(withLoading: boolean): void {
    let filter;
    if (this.currentForm === 'advanced' && this.advancedSearchForm) {
      filter =
        this.createServerRequestFilter !== undefined
          ? this.createServerRequestFilter()
          : undefined;
    }

    if (this.onTableRequest) {
      this.onTableRequest(
        {
          pagination:
            this.tablePagination && this.tablePagination.page
              ? {
                  page: this.tablePagination.page,
                }
              : undefined,
          sorting: this.tableSorting,
          search: this.quickSearchForm.get('search').value || undefined,
          filter,
        },
        withLoading
      );
    }
  }

  public resetRequest(): void {
    this.setInitialRequestSettings();
  }
}
