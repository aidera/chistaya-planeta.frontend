import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as ScheduledOrdersActions from '../../../../store/scheduled-orders/scheduled-orders.actions';
import * as ScheduledOrdersSelectors from '../../../../store/scheduled-orders/scheduled-orders.selectors';
import { TablePageComponent } from '../../table-page.component';
import { OptionType } from '../../../../models/types/OptionType';
import { paymentMethodOffersOptions } from '../../../../data/paymentMethodData';
import {
  orderTypeOptions,
  orderTypeStrings,
} from '../../../../data/orderTypeData';
import {
  deliveryTypeOptions,
  deliveryTypeStrings,
} from '../../../../data/deliveryTypeData';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { IClient } from '../../../../models/Client';
import { ILocality } from '../../../../models/Locality';
import { IScheduledOrder } from '../../../../models/ScheduledOrder';
import {
  simpleStatusColors,
  simpleStatusOptions,
  simpleStatusStrings,
} from '../../../../data/simpleStatusData';
import { periodTypeStrings } from '../../../../data/periodTypeData';
import { GettersService } from '../../../../services/getters/getters.service';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';

@Component({
  selector: 'app-scheduled-orders-table',
  templateUrl: './scheduled-orders-table.component.html',
  styleUrls: ['./scheduled-orders-table.component.scss'],
})
export class ScheduledOrdersTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  /* ------------------- */
  /* Main items settings */
  /* ------------------- */
  public items: IScheduledOrder[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];

  /* ----------- */
  /* Static data */
  /* ----------- */
  public simpleStatusOptions = simpleStatusOptions;
  public orderTypeOptions = orderTypeOptions;
  public deliveryTypeOptions = deliveryTypeOptions;
  public paymentMethodOptions = paymentMethodOffersOptions;

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

    title.setTitle('Периодические заявки - Чистая планета');
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
        key: 'periodTypeAmount',
        title: 'Период',
        isSorting: false,
      },
      {
        key: 'startDate',
        title: 'Дата начала',
        isSorting: true,
      },
      {
        key: 'nextUpdate',
        title: 'Дата создания следующей заявки',
        isSorting: true,
      },
      {
        key: 'type',
        title: 'Тип',
        isSorting: true,
      },

      {
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: true,
      },

      {
        key: 'customerOrganizationLegalName',
        title: 'Юридическое название компании',
        isSorting: true,
      },
      {
        key: 'customerOrganizationActualName',
        title: 'Фактическое название компании',
        isSorting: true,
      },
      {
        key: 'customerContactName',
        title: 'Контактное лицо',
        isSorting: true,
      },
      {
        key: 'customerContactPhone',
        title: 'Контактный телефон',
        isSorting: true,
      },

      {
        key: 'deliveryType',
        title: 'Тип доставки',
        isSorting: true,
      },
      {
        key: 'deliveryCustomerCarNumber',
        title: 'Номер автомобиля заказчика',
        isSorting: true,
      },
      {
        key: 'deliveryHasAssistant',
        title: 'Помошник',
        isSorting: true,
      },
      {
        key: 'deliveryAddressFromStreet',
        title: 'Улица для доставки',
        isSorting: true,
      },
      {
        key: 'deliveryAddressFromHouse',
        title: 'Дом для доставки',
        isSorting: true,
      },

      {
        key: 'paymentMethod',
        title: 'Тип оплаты',
        isSorting: true,
      },
      {
        key: 'paymentMethodData',
        title: 'Данные для оплаты',
        isSorting: true,
      },

      {
        key: 'performersClientManager',
        title: 'Менеджер по работе с клиентами',
        isSorting: true,
      },
      {
        key: 'performersReceivingManager',
        title: 'Принимающий менеджер',
        isSorting: true,
      },
      {
        key: 'performersDriver',
        title: 'Водитель',
        isSorting: true,
      },
      {
        key: 'performersCar',
        title: 'Автомобиль',
        isSorting: true,
      },

      {
        key: 'customerComment',
        title: 'Комментарий клиента',
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

    this.userInitCallback = () => {
      if (this.userEmployee) {
        if (
          this.userEmployee.role !== EmployeeRole.admin &&
          this.userEmployee.role !== EmployeeRole.head
        ) {
          this.columnsCanBeDisplayed = this.columnsCanBeDisplayed.filter(
            (column) => {
              return column !== 'locality';
            }
          );
        }
      }
      if (this.userClient) {
        this.columnsCanBeDisplayed = this.columnsCanBeDisplayed.filter(
          (column) => {
            return (
              column !== 'id' &&
              column !== 'customerOrganizationLegalName' &&
              column !== 'customerOrganizationActualName' &&
              column !== 'customerContactName' &&
              column !== 'customerContactPhone' &&
              column !== 'deliveryType' &&
              column !== 'deliveryCustomerCarNumber' &&
              column !== 'deliveryHasAssistant' &&
              column !== 'deliveryAddressFromStreet' &&
              column !== 'deliveryAddressFromHouse' &&
              column !== 'paymentMethod' &&
              column !== 'paymentMethodData' &&
              column !== 'customerComment' &&
              column !== 'updatedAt'
            );
          }
        );
      }
    };

    /* ---------------------- */
    /* --- Forms settings --- */
    /* ---------------------- */

    this.createAdvancedSearchForm = () => {
      return new FormGroup({
        id: new FormControl(''),
        status: new FormControl([]),

        type: new FormControl([]),
        client: new FormControl(''),
        localities: new FormControl([]),

        customerContactName: new FormControl(''),
        customerContactPhone: new FormControl(''),
        customerOrganizationLegalName: new FormControl(''),
        customerOrganizationActualName: new FormControl(''),

        deliveryType: new FormControl([]),
        deliveryCustomerCarNumber: new FormControl(''),
        deliveryHasAssistant: new FormControl([]),
        deliveryAddressFromStreet: new FormControl(''),
        deliveryAddressFromHouse: new FormControl(''),

        paymentMethod: new FormControl([]),
        paymentMethodData: new FormControl(''),

        customerComment: new FormControl(''),

        startDateFrom: new FormControl(''),
        startDateTo: new FormControl(''),
        nextUpdateFrom: new FormControl(''),
        nextUpdateTo: new FormControl(''),
        createdAtFrom: new FormControl(''),
        createdAtTo: new FormControl(''),
        updatedAtFrom: new FormControl(''),
        updatedAtTo: new FormControl(''),
      });
    };

    /* --------------------- */
    /* --- Options init --- */
    /* --------------------- */
    this.options.initLocalitiesOptions();

    this.afterAdvancedSearchFormInit = () => {
      /* ---------------- */
      /* Options requests */
      /* ---------------- */

      /* Localities */
      this.localitiesOptions$?.unsubscribe();
      this.localitiesOptions$ = this.options
        .getLocalitiesOptions({})
        .subscribe((value) => {
          this.localitiesOptions = value;
        });
    };

    /* ----------------------- */
    /* --- Request actions --- */
    /* ----------------------- */

    this.createServerRequestFilter = () => {
      return {
        status:
          this.advancedSearchForm.get('status').value.length > 0
            ? this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('status').value,
                undefined,
                this.getters.getArrayFromAnyToString
              )
            : undefined,
        type:
          this.advancedSearchForm.get('type').value.length > 0
            ? this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('type').value,
                undefined,
                this.getters.getArrayFromAnyToString
              )
            : undefined,

        client:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('client').value
          ) || undefined,

        customerOrganizationLegalName:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerOrganizationLegalName').value
          ) || undefined,
        customerOrganizationActualName:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerOrganizationActualName').value
          ) || undefined,
        customerContactName:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerContactName').value
          ) || undefined,
        customerContactPhone:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerContactPhone').value
          ) || undefined,

        deliveryType:
          this.advancedSearchForm.get('deliveryType').value.length > 0
            ? this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('deliveryType').value,
                undefined,
                this.getters.getArrayFromAnyToString
              )
            : undefined,
        deliveryCustomerCarNumber:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('deliveryCustomerCarNumber').value
          ) || undefined,
        deliveryHasAssistant: this.getters.getArrayOrUndefined<boolean>(
          this.advancedSearchForm.get('deliveryHasAssistant').value,
          1,
          this.getters.getArrayFromStringedBooleanToRealBoolean
        ),
        deliveryAddressFromStreet:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('deliveryAddressFromStreet').value
          ) || undefined,
        deliveryAddressFromHouse:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('deliveryAddressFromHouse').value
          ) || undefined,

        paymentMethod:
          this.advancedSearchForm.get('paymentMethod').value.length > 0
            ? this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('paymentMethod').value,
                undefined,
                this.getters.getArrayFromAnyToString
              )
            : undefined,
        paymentMethodData:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('paymentMethodData').value
          ) || undefined,

        customerComment:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerComment').value
          ) || undefined,

        localities:
          this.advancedSearchForm.get('localities').value.length <= 0 ||
          this.advancedSearchForm.get('localities').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('localities').value
              ),

        startDate: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('startDateFrom').value,
          this.advancedSearchForm.get('startDateTo').value
        ),
        nextUpdate: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('nextUpdateFrom').value,
          this.advancedSearchForm.get('nextUpdateTo').value
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
        ScheduledOrdersActions.getScheduledOrdersRequest({
          params: request,
          withLoading,
        })
      );
    };

    this.socket.get()?.on('scheduledOrders', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.items && this.items.length > 0) {
          const isExist = this.items.find((item) => {
            return item._id === data.id;
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
      .select(ScheduledOrdersSelectors.selectScheduledOrders)
      .subscribe((scheduledOrders) => {
        this.items = scheduledOrders;
        if (scheduledOrders) {
          this.tableData = scheduledOrders.map((scheduledOrder) => {
            return {
              id: this.highlightSearchedValue(
                scheduledOrder._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${
                simpleStatusColors[scheduledOrder.status]
              }-text">${simpleStatusStrings[scheduledOrder.status]}</p>`,

              periodTypeAmount:
                'раз в ' +
                scheduledOrder.periodAmount +
                ' ' +
                periodTypeStrings[scheduledOrder.periodType],

              startDate: formatDate(
                scheduledOrder.startDate,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              nextUpdate: formatDate(
                scheduledOrder.nextUpdate,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),

              type: orderTypeStrings[scheduledOrder.type],

              client: scheduledOrder.client
                ? this.highlightSearchedValue(
                    (scheduledOrder.client as IClient)._id,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              locality: (scheduledOrder.locality as ILocality)?.name || '',

              customerOrganizationLegalName: this.highlightSearchedValue(
                scheduledOrder.customer.organizationLegalName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerOrganizationActualName: this.highlightSearchedValue(
                scheduledOrder.customer.organizationLegalName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerContactName: this.highlightSearchedValue(
                scheduledOrder.customer.contactName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerContactPhone: this.quickSearchForm?.get('search').value
                ? this.highlightSearchedValue(
                    scheduledOrder.customer.contactPhone,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : this.getters.getBeautifiedPhoneNumber(
                    scheduledOrder.customer.contactPhone
                  ),

              deliveryType:
                deliveryTypeStrings[scheduledOrder.delivery._type] || '',
              deliveryCustomerCarNumber: this.highlightSearchedValue(
                scheduledOrder.delivery.customerCarNumber,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              deliveryHasAssistant:
                scheduledOrder.delivery.hasAssistant === true
                  ? 'есть'
                  : scheduledOrder.delivery.hasAssistant === false
                  ? 'нет'
                  : '',
              deliveryAddressFromStreet: scheduledOrder.delivery.addressFrom
                ?.street
                ? this.highlightSearchedValue(
                    scheduledOrder.delivery.addressFrom?.street,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              deliveryAddressFromHouse: scheduledOrder.delivery.addressFrom
                ?.house
                ? this.highlightSearchedValue(
                    scheduledOrder.delivery.addressFrom?.house,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              paymentMethod:
                paymentMethodOffersOptions.find(
                  (el) => el.value === scheduledOrder.payment?.method + ''
                )?.text || '',
              paymentMethodData: this.highlightSearchedValue(
                scheduledOrder.payment?.methodData,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),

              customerComment: scheduledOrder.customerComment
                ? this.highlightSearchedValue(
                    scheduledOrder.customerComment,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              createdAt: formatDate(
                scheduledOrder.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                scheduledOrder.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(ScheduledOrdersSelectors.selectGetScheduledOrdersIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(ScheduledOrdersSelectors.selectGetScheduledOrdersError)
      .subscribe((error) => {
        if (error) {
          this.getItemsResultSnackbar = this.snackBar.open(
            'Ошибка при запросе периодических заказов. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(ScheduledOrdersSelectors.selectGetScheduledOrdersPagination)
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

    this.socket.get()?.off('scheduledOrders');

    this.options.destroyLocalitiesOptions();
  }
}
