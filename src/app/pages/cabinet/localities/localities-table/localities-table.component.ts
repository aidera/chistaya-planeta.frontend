import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import * as LocalitiesActions from '../../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../../store/locality/locality.selectors';
import { IDivision } from '../../../../models/Division';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { TablePageComponent } from '../../table-page.component';
import { ILocality } from '../../../../models/Locality';
import { ICar } from 'src/app/models/Car';

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
        name: new FormControl(''),
        status: new FormControl(['true', 'false']),
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
            return {
              id: this.highlightSearchedValue(
                locality._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status:
                locality.status === SimpleStatus.active
                  ? '<p class="green-text">Активный</p>'
                  : '<p class="red-text">Не активный</p>',
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
