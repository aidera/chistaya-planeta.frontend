import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TablePageComponent } from '../../table-page.component';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as AppSelectors from '../../../../store/app/app.selectors';
import * as DivisionActions from '../../../../store/division/division.actions';
import * as DivisionSelectors from '../../../../store/division/division.selectors';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { IDivision } from '../../../../models/Division';
import { ILocality, ILocalityLessInfo } from '../../../../models/Locality';
import { OptionType } from '../../../../models/types/OptionType';

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
  private localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[];

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
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: false,
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
        status: new FormControl(['true', 'false']),
        name: new FormControl(''),
        locality: new FormControl(''),
        street: new FormControl(''),
        house: new FormControl(''),
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
        status: this.converter.getArrayOrUndefined<boolean>(
          this.advancedSearchForm.get('status').value,
          1,
          this.converter.convertArrayOfStringedBooleanToRealBoolean
        ),
        locality:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('locality').value
          ) || undefined,
        street:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('street').value
          ) || undefined,
        house:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('house').value
          ) || undefined,
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
        DivisionActions.getDivisionsRequest({ params: request, withLoading })
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
      .select(DivisionSelectors.selectDivisions)
      .subscribe((divisions) => {
        this.divisions = divisions;
        if (divisions) {
          this.tableData = divisions.map((division) => {
            return {
              id: this.highlightSearchedValue(
                division._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status:
                division.status === SimpleStatus.active
                  ? '<p class="green-text">Активный</p>'
                  : '<p class="red-text">Не активный</p>',
              name: this.highlightSearchedValue(
                division.name,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              locality:
                this.highlightSearchedValue(
                  (division.address?.locality as ILocality)?.name,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
              street:
                this.highlightSearchedValue(
                  division.address?.street,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
              house:
                this.highlightSearchedValue(
                  division.address?.house,
                  this.quickSearchForm
                    ? this.quickSearchForm.get('search').value
                    : ''
                ) || '-',
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
      .select(DivisionSelectors.selectGetDivisionsIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(DivisionSelectors.selectGetDivisionsError)
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
      .select(DivisionSelectors.selectGetDivisionsPagination)
      .subscribe((pagination) => {
        this.tablePagination = pagination;
      });

    this.localitiesOptions$ = this.store
      .select(AppSelectors.selectLocalitiesOptionsToSelect)
      .subscribe((localities) => {
        this.localitiesOptions = localities;
      });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.divisions$?.unsubscribe?.();
    this.localitiesOptions$?.unsubscribe?.();
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
