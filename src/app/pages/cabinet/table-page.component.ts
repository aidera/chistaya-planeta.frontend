import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { PaginationType } from '../../models/types/PaginationType';
import * as fromRoot from '../../store/root.reducer';
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

@Component({
  template: '',
})
export class TablePageComponent implements OnInit, OnDestroy {
  protected isFetching$: Subscription;
  public isFetching: boolean;
  protected pagination$: Subscription;

  /* Table settings */
  public tableColumns: TableColumnType[];
  public tableData: TableDataType[] | null = null;
  public columnsCanBeDisplayed: TableDisplayOutputType[];
  public displayedColumns: TableDisplayOutputType[];
  public tableSorting: TableSortType;
  public tablePagination: PaginationType;

  /* Form settings */
  public currentForm: 'quick' | 'advanced' = 'quick';
  public createAdvancedSearchForm: () => FormGroup;
  public quickSearchForm: FormGroup;
  public advancedSearchForm: FormGroup;

  /* Request settings */
  public createServerRequestFilter?: () => ServerFilterRequest | undefined;
  public onTableRequest: (
    request: GetRouteParamsType,
    withLoading: boolean
  ) => any;

  constructor(
    protected store: Store<fromRoot.State>,
    @Inject(LOCALE_ID) protected locale: string,
    protected converter: ConverterService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected socket: SocketIoService
  ) {}

  ngOnInit(): void {
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

    this.initQuickSearchForm();
    this.setInitialRequestSettings();

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.display) {
        this.displayedColumns = params.display.split(';');
      }

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

      if (params.page) {
        const paramsPage = params.page;
        if (this.tablePagination) {
          this.tablePagination = {
            ...this.tablePagination,
            page: !isNaN(+paramsPage) ? +paramsPage : 1,
          };
        }
      }

      let hasFilter = false;

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
  }

  ngOnDestroy(): void {
    this.isFetching$?.unsubscribe?.();
    this.pagination$?.unsubscribe?.();
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
        const split = clearObjectValue.split(clearQuickSearchValue);
        const objectValuePart = rawString.substr(
          indexFrom,
          clearQuickSearchValue.length
        );
        return split[0] + '<strong>' + objectValuePart + '</strong>' + split[1];
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
