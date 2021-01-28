import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { TableColumnType } from '../../models/types/TableColumnType';
import { TableDataType } from '../../models/types/TableDataType';
import { TableDisplayOutputType } from '../../models/types/TableDisplayType';
import { TableSortType } from '../../models/types/TableSortType';
import { PaginationType } from '../../models/types/PaginationType';
import * as fromRoot from '../../store/root.reducer';
import { ConverterService } from '../../services/converter/converter.service';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ServerFilterRequest } from '../../models/types/ServerFilterRequest';
import { dateISOStringRegex } from '../../utils/regexes';

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
  public quickSearchValue: string;
  private quickSearchModelChanged: Subject<string> = new Subject<string>();
  private quickSearch$: Subscription;
  public createAdvancedSearchForm: () => FormGroup;
  public advancedSearchForm: FormGroup;

  /* Request settings */
  public createServerRequestFilter?: () => ServerFilterRequest | undefined;
  public onTableRequest: (request: GetRouteParamsType) => any;

  constructor(
    protected store: Store<fromRoot.State>,
    @Inject(LOCALE_ID) protected locale: string,
    protected converter: ConverterService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
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

    this.initQuickSearch();

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

      if (hasFilter === false && params.search) {
        this.quickSearchValue = params.search;
      }

      this.sendRequest();
    });
  }

  ngOnDestroy(): void {
    if (this.isFetching$) {
      this.isFetching$.unsubscribe();
    }
    if (this.pagination$) {
      this.pagination$.unsubscribe();
    }
    if (this.quickSearch$) {
      this.quickSearch$.unsubscribe();
    }
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

  private initQuickSearch(): void {
    this.quickSearch$ = this.quickSearchModelChanged
      .pipe(
        tap((text) => {
          this.quickSearchValue = text;
        }),
        debounceTime(500)
      )
      .subscribe((text) => {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            sortingField: this.tableSorting
              ? this.tableSorting.field
              : undefined,
            sortingType: this.tableSorting ? this.tableSorting.type : undefined,
            page: this.tablePagination ? this.tablePagination.page : undefined,
            search: this.quickSearchValue,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  protected quickSearchInputChanges(): void {
    this.quickSearchModelChanged.next(this.quickSearchValue);
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
        .subscribe((next) => {
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
    this.quickSearchValue = undefined;
    this.displayedColumns = this.columnsCanBeDisplayed;
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

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { display: isEqual ? undefined : event.join(';') },
      queryParamsHandling: 'merge',
    });
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
    this.tablePagination.page = newPage;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  public onTableItemClick(index: number): void {}

  public sendRequest(): void {
    let filter;
    if (this.currentForm === 'advanced' && this.advancedSearchForm) {
      filter =
        this.createServerRequestFilter !== undefined
          ? this.createServerRequestFilter()
          : undefined;
    }

    if (this.onTableRequest) {
      this.onTableRequest({
        pagination:
          this.tablePagination && this.tablePagination.page
            ? {
                page: this.tablePagination.page,
              }
            : undefined,
        sorting: this.tableSorting,
        search: this.quickSearchValue || undefined,
        filter,
      });
    }
  }

  public resetRequest(): void {
    this.setInitialRequestSettings();
  }
}
