import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as LocalitiesActions from '../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../store/locality/locality.selectors';
import { IDivision } from '../../../models/Division';
import { SimpleStatus } from '../../../models/enums/SimpleStatus';
import { TablePageComponent } from '../../table-page.component';

@Component({
  selector: 'app-localities',
  templateUrl: './localities.component.html',
  styleUrls: ['./localities.component.scss'],
})
export class LocalitiesComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private localities$: Subscription;

  ngOnInit(): void {
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

    this.createAdvancedSearchForm = () => {
      return new FormGroup({
        id: new FormControl(''),
        name: new FormControl(''),
        status: new FormControl(['true', 'false']),
        createdAtFrom: new FormControl(''),
        createdAtTo: new FormControl(''),
        updatedAtFrom: new FormControl(''),
        updatedAtTo: new FormControl(''),
      });
    };

    this.createServerRequestFilter = () => {
      return {
        name:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('name').value
          ) || undefined,
        status: this.converter.getArrayOrUndefined<boolean>(
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
    };

    this.onTableRequest = (request) => {
      this.store.dispatch(LocalitiesActions.getLocalitiesRequest(request));
    };

    this.localities$ = this.store
      .select(LocalitiesSelectors.selectLocalities)
      .subscribe((localities) => {
        this.tableData = localities.map((locality) => {
          return {
            id: this.highlightSearchedValue(
              locality._id,
              this.quickSearchValue
            ),
            status:
              locality.status === SimpleStatus.active
                ? '<p class="green-text">Активный</p>'
                : '<p class="red-text">Не активный</p>',
            name: this.highlightSearchedValue(
              locality.name,
              this.quickSearchValue
            ),
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

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.localities$) {
      this.localities$.unsubscribe();
    }
  }
}
