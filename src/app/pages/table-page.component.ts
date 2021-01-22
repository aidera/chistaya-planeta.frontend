import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { TableColumnType } from '../models/types/TableColumnType';
import { TableDataType } from '../models/types/TableDataType';
import { TableDisplayOutputType } from '../models/types/TableDisplayType';
import { TableSortType } from '../models/types/TableSortType';
import { PaginationType } from '../models/types/PaginationType';
import * as fromRoot from '../store/root.reducer';
import { ConverterService } from '../services/converter.service';
import { GetRouteParamsType } from '../models/types/GetRouteParamsType';
import { ServerFilterRequest } from '../models/types/ServerFilterRequest';

@Component({
  template: '',
})
export class TablePageComponent implements OnInit, OnDestroy {
  protected isFetching$: Subscription;
  public isFetching: boolean;
  protected pagination$: Subscription;

  /* Table settings */
  public tableColumns: TableColumnType[];
  public tableData: TableDataType[];
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
    protected converter: ConverterService
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

    if (this.onTableRequest) {
      this.onTableRequest({});
    }

    this.initQuickSearch();
    this.initAdvancedSearchForm();

    this.setInitialRequestSettings();
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

  highlightSearchedValue(rawString: string, searchValue: string): string {
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

  initQuickSearch(): void {
    this.quickSearch$ = this.quickSearchModelChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.sendRequest();
      });
  }

  quickSearchInputChanges(): void {
    this.quickSearchModelChanged.next(this.quickSearchValue);
  }

  initAdvancedSearchForm(): void {
    if (this.advancedSearchForm) {
      this.advancedSearchForm.reset();
    }
    this.advancedSearchForm = this.createAdvancedSearchForm();
    this.advancedSearchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => {
        this.sendRequest();
      });
  }

  setInitialRequestSettings(): void {
    this.tablePagination = { ...this.tablePagination, page: 1 };
    this.tableSorting = undefined;
    this.quickSearchValue = undefined;
    this.initAdvancedSearchForm();
  }

  setCurrentForm(value: 'quick' | 'advanced'): void {
    this.setInitialRequestSettings();
    this.currentForm = value;
  }

  onTableDisplay(event: TableDisplayOutputType[]): void {
    this.displayedColumns = event;
  }

  onTableSort(event: TableSortType): void {
    this.tableSorting = event;
    this.sendRequest();
  }

  onTablePaginate(newPage: number): void {
    this.tablePagination.page = newPage;
    this.sendRequest();
  }

  onTableItemClick(index: number): void {
    console.log(index);
  }

  sendRequest(): void {
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

  resetRequest(): void {
    this.setInitialRequestSettings();
    this.sendRequest();
  }
}
