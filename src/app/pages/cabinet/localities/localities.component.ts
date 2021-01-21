import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { debounceTime } from 'rxjs/operators';

import * as fromRoot from '../../../store/root.reducer';
import * as LocalitiesActions from '../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../store/locality/locality.selectors';
import { ILocality } from '../../../models/Locality';
import { TableDisplayOutputType } from '../../../models/types/TableDisplayType';
import { TableSortType } from '../../../models/types/TableSortType';
import { PaginationType } from '../../../models/types/PaginationType';
import { TableColumnType } from '../../../models/types/TableColumnType';
import { TableDataType } from '../../../models/types/TableDataType';
import { IDivision } from '../../../models/Division';
import { highlightSearchedValue } from '../../../utils/highlightSearchedValue';
import { clearSearchRequestRegex } from '../../../utils/regexes';
import { SimpleStatus } from '../../../models/enums/SimpleStatus';
import { ConverterService } from '../../../services/converter.service';

@Component({
  selector: 'app-localities',
  templateUrl: './localities.component.html',
  styleUrls: ['./localities.component.scss'],
})
export class LocalitiesComponent implements OnInit, OnDestroy {
  /* NgRx data */
  private localities$: Subscription;
  private localities: ILocality[];
  private isFetching$: Subscription;
  public isFetching: boolean;
  private pagination$: Subscription;

  /* Table settings */
  public tableColumns: TableColumnType[];
  public tableData: TableDataType[];
  public columnsCanBeDisplayed: TableDisplayOutputType[] = [
    'id',
    'status',
    'name',
    'divisions',
    'createdAt',
    'updatedAt',
  ];
  public displayedColumns: TableDisplayOutputType[];
  public tableSorting: TableSortType;
  public tablePagination: PaginationType;

  /* Form settings */
  public currentForm: 'quick' | 'advanced' = 'quick';
  public quickSearchValue: string;
  private quickSearchModelChanged: Subject<string> = new Subject<string>();
  private quickSearch$: Subscription;
  public advancedSearchForm: FormGroup;

  constructor(
    private store: Store<fromRoot.State>,
    @Inject(LOCALE_ID) private locale: string,
    private converter: ConverterService
  ) {}

  ngOnInit(): void {
    this.sendGetLocalitiesRequest();

    this.localities$ = this.store
      .select(LocalitiesSelectors.selectLocalities)
      .subscribe((localities) => {
        this.localities = localities;
        this.makeTableData();
      });

    this.localities$ = this.store
      .select(LocalitiesSelectors.selectLocalities)
      .subscribe((localities) => {
        this.localities = localities;
        this.makeTableData();
      });

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectGetLocalitiesIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.pagination$ = this.store
      .select(LocalitiesSelectors.selectGetLocalitiesPagination)
      .subscribe((pagination) => {
        this.tablePagination = pagination;
      });

    this.initQuickSearch();
    this.initAdvancedSearchForm();

    this.setInitialRequestSettings();
    this.makeTableColumns();
    this.makeTableData();
  }

  ngOnDestroy(): void {
    if (this.localities$) {
      this.localities$.unsubscribe();
    }
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

  initQuickSearch(): void {
    this.quickSearch$ = this.quickSearchModelChanged
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.sendGetLocalitiesRequest();
      });
  }

  quickSearchInputChanges(): void {
    this.quickSearchModelChanged.next(this.quickSearchValue);
  }

  initAdvancedSearchForm(): void {
    this.advancedSearchForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      status: new FormControl(['true', 'false']),
      createdAtFrom: new FormControl(''),
      createdAtTo: new FormControl(''),
      updatedAtFrom: new FormControl(''),
      updatedAtTo: new FormControl(''),
    });

    this.advancedSearchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => {
        this.sendGetLocalitiesRequest();
      });
  }

  makeTableColumns(): void {
    this.tableColumns = [
      {
        key: 'id',
        title: 'Идентификатор',
      },
      {
        key: 'status',
        title: 'Статус',
      },
      {
        key: 'name',
        title: 'Название',
      },
      {
        key: 'divisions',
        title: 'Подразделения',
      },
      {
        key: 'createdAt',
        title: 'Дата создания',
      },
      {
        key: 'updatedAt',
        title: 'Дата изменения',
      },
    ];
  }

  makeTableData(): void {
    this.tableData = this.localities.map((locality) => {
      return {
        id: highlightSearchedValue(locality._id, this.quickSearchValue),
        status:
          locality.status === SimpleStatus.active
            ? '<p class="green-text">Активный</p>'
            : '<p class="red-text">Не активный</p>',
        name: highlightSearchedValue(locality.name, this.quickSearchValue),
        divisions: locality.divisions
          .map((division: IDivision, i) => {
            return i === 0 ? division.name : ' ' + division.name;
          })
          .toString(),
        createdAt: formatDate(
          locality.createdAt,
          'dd.MM.yyyy - hh:mm',
          this.locale
        ),
        updatedAt: formatDate(
          locality.updatedAt,
          'dd.MM.yyyy - hh:mm',
          this.locale
        ),
      };
    });
  }

  setInitialRequestSettings(): void {
    this.tablePagination = { ...this.tablePagination, page: 1 };
    this.tableSorting = undefined;
    this.quickSearchValue = undefined;
    this.advancedSearchForm.reset();
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
    this.sendGetLocalitiesRequest();
  }

  onTablePaginate(newPage: number): void {
    this.tablePagination.page = newPage;
    this.sendGetLocalitiesRequest();
  }

  onTableItemClick(index: number): void {
    console.log(index);
  }

  sendGetLocalitiesRequest(): void {
    let filter;
    if (this.currentForm === 'advanced') {
      filter = {
        name:
          this.advancedSearchForm
            .get('name')
            .value.replace(clearSearchRequestRegex, '') || undefined,
        status: this.converter.getArrayOrUndefined(
          this.advancedSearchForm.get('status').value,
          1,
          this.converter.convertArrayOfStringedBooleanToRealBoolean
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
    }

    this.store.dispatch(
      LocalitiesActions.getLocalitiesRequest({
        pagination:
          this.tablePagination && this.tablePagination.page
            ? {
                page: this.tablePagination.page,
              }
            : undefined,
        sorting: this.tableSorting,
        search: this.quickSearchValue || undefined,
        filter,
      })
    );
  }

  resetRequest(): void {
    this.setInitialRequestSettings();
    this.sendGetLocalitiesRequest();
  }
}
