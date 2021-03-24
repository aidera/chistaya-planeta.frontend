import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

import * as ClientsActions from '../../../../store/clients/clients.actions';
import * as ClientsSelectors from '../../../../store/clients/clients.selectors';
import { TablePageComponent } from '../../table-page.component';
import {
  clientStatusColors,
  clientStatusOptions,
  clientStatusStrings,
} from '../../../../data/clientStatusData';
import { IClient } from '../../../../models/Client';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss'],
})
export class ClientsTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  private clients$: Subscription;
  private clients: IClient[];

  public clientStatusOptions = clientStatusOptions;

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
        key: 'email',
        title: 'Email',
        isSorting: true,
      },
      {
        key: 'phone',
        title: 'Телефон',
        isSorting: true,
      },
      {
        key: 'blockReason',
        title: 'Причина блокировки',
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
        status: new FormControl([]),
        name: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        blockReason: new FormControl(''),
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
        status:
          this.advancedSearchForm.get('status').value.length <= 0 ||
          this.advancedSearchForm.get('status').value[0] === ''
            ? undefined
            : this.converter.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value
              ),
        email:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('email').value
          ) || undefined,
        phone:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('phone').value
          ) || undefined,
        blockReason:
          this.converter.clearServerRequestString(
            this.advancedSearchForm.get('blockReason').value
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
        ClientsActions.getClientsRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('clients', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.clients && this.clients.length > 0) {
          const isExist = this.clients.find((client) => {
            return client._id === data.id;
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

    this.clients$ = this.store
      .select(ClientsSelectors.selectClients)
      .subscribe((clients) => {
        this.clients = clients;
        if (clients) {
          this.tableData = clients.map((client) => {
            return {
              id: this.highlightSearchedValue(
                client._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${clientStatusColors[client.status]}-text">${
                clientStatusStrings[client.status]
              }</p>`,
              name: this.highlightSearchedValue(
                client.name,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              email: this.highlightSearchedValue(
                client.email,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              phone: this.quickSearchForm?.get('search').value
                ? this.highlightSearchedValue(
                    client.phone,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : this.converter.beautifyPhoneNumber(client.phone),
              blockReason: this.highlightSearchedValue(
                client.blockReason || '',
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              createdAt: formatDate(
                client.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                client.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(ClientsSelectors.selectGetClientsIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(ClientsSelectors.selectGetClientsError)
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
      .select(ClientsSelectors.selectGetClientsPagination)
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

    this.clients$?.unsubscribe?.();
    this.socket.get()?.off('clients');
  }

  public onTableItemClick(index: number): void {
    const currentItemId = this.clients?.[index]?._id;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
