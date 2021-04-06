import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as OrdersActions from '../../../../store/orders/orders.actions';
import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import { PhonePipe } from '../../../../pipes/phone.pipe';
import { TablePageComponent } from '../../table-page.component';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import { ILocality } from '../../../../models/Locality';
import { IDivision } from '../../../../models/Division';
import { ICar } from '../../../../models/Car';
import {
  orderStatusColors,
  orderStatusOptions,
  orderStatusStrings,
} from '../../../../data/orderStatusData';
import {
  orderTypeOptions,
  orderTypeStrings,
} from '../../../../data/orderTypeData';
import {
  deliveryTypeOptions,
  deliveryTypeStrings,
} from '../../../../data/deliveryTypeData';
import { IOrder } from '../../../../models/Order';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { paymentMethodOffersOptions } from 'src/app/data/paymentMethodData';
import { IClient } from '../../../../models/Client';
import { GettersService } from '../../../../services/getters/getters.service';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  providers: [PhonePipe],
})
export class OrdersTableComponent
  extends TablePageComponent
  implements OnInit, OnDestroy {
  /* ------------------- */
  /* Main items settings */
  /* ------------------- */
  public items: IOrder[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];
  public clientManagersOptions$: Subscription;
  public clientManagersOptions: OptionType[] = [];
  public receivingManagersOptions$: Subscription;
  public receivingManagersOptions: OptionType[] = [];
  public driversOptions$: Subscription;
  public driversOptions: OptionType[] = [];

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderStatusOptions = orderStatusOptions;
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

    title.setTitle('Заявки - Чистая планета');
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
        key: 'type',
        title: 'Тип',
        isSorting: true,
      },
      {
        key: 'deadline',
        title: 'Желаемая дата вывоза',
        isSorting: true,
      },

      {
        key: 'locality',
        title: 'Населённый пункт',
        isSorting: true,
      },
      {
        key: 'division',
        title: 'Подразделение',
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
        key: 'weighedPaymentAmount',
        title: 'Итоговая стоимость',
        isSorting: true,
      },

      {
        key: 'customerComment',
        title: 'Комментарий клиента',
        isSorting: true,
      },
      {
        key: 'companyComment',
        title: 'Комментарий компании',
        isSorting: true,
      },
      {
        key: 'customerCancellationReason',
        title: 'Причина отмены клиентом',
        isSorting: true,
      },
      {
        key: 'companyCancellationReason',
        title: 'Причина отмены сотрудником',
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
      {
        key: 'statusDateAccepted',
        title: 'Дата обработки',
        isSorting: true,
      },
      {
        key: 'statusDateDelivered',
        title: 'Дата доставки',
        isSorting: true,
      },
      {
        key: 'statusDateWeighed',
        title: 'Дата взвешивания',
        isSorting: true,
      },
      {
        key: 'statusDateCompleted',
        title: 'Дата завершения',
        isSorting: true,
      },
      {
        key: 'statusDateRefused',
        title: 'Дата отмены/отказа',
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
              column !== 'deadline' &&
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
              column !== 'performersClientManager' &&
              column !== 'performersReceivingManager' &&
              column !== 'performersDriver' &&
              column !== 'performersCar' &&
              column !== 'performersCar' &&
              column !== 'customerComment' &&
              column !== 'companyComment' &&
              column !== 'customerCancellationReason' &&
              column !== 'companyCancellationReason' &&
              column !== 'updatedAt' &&
              column !== 'statusDateAccepted' &&
              column !== 'statusDateDelivered' &&
              column !== 'statusDateWeighed' &&
              column !== 'statusDateRefused'
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
        deadlineFrom: new FormControl(''),
        deadlineTo: new FormControl(''),

        scheduledOrder: new FormControl(''),
        client: new FormControl(''),

        localities: new FormControl([]),
        divisions: new FormControl([]),

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

        weighedPaymentAmount: new FormControl([]),

        performersClientManagers: new FormControl([]),
        performersReceivingManagers: new FormControl([]),
        performersDrivers: new FormControl([]),
        performersCars: new FormControl([]),

        customerComment: new FormControl(''),
        companyComment: new FormControl(''),
        customerCancellationReason: new FormControl(''),
        companyCancellationReason: new FormControl(''),

        createdAtFrom: new FormControl(''),
        createdAtTo: new FormControl(''),
        updatedAtFrom: new FormControl(''),
        updatedAtTo: new FormControl(''),
        statusDateAcceptedFrom: new FormControl(''),
        statusDateAcceptedTo: new FormControl(''),
        statusDateDeliveredFrom: new FormControl(''),
        statusDateDeliveredTo: new FormControl(''),
        statusDateWeighedFrom: new FormControl(''),
        statusDateWeighedTo: new FormControl(''),
        statusDateCompletedFrom: new FormControl(''),
        statusDateCompletedTo: new FormControl(''),
        statusDateRefusedFrom: new FormControl(''),
        statusDateRefusedTo: new FormControl(''),
      });
    };

    /* --------------------- */
    /* --- Options init --- */
    /* --------------------- */
    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initCarsOptions();
    this.options.initEmployeesOptions();

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

      /* Divisions */
      this.divisionsOptions$?.unsubscribe();
      this.divisionsOptions$ = this.options
        .getDivisionsOptions({
          localitiesIds:
            this.userEmployee &&
            this.userEmployee.role !== EmployeeRole.admin &&
            this.userEmployee.role !== EmployeeRole.head
              ? [(this.userEmployee.locality as ILocality)._id]
              : undefined,
        })
        .subscribe((value) => {
          this.divisionsOptions = value;
        });

      /* Cars */
      this.carsOptions$?.unsubscribe();
      this.carsOptions$ = this.options
        .getCarsOptions({
          localitiesIds:
            this.userEmployee &&
            this.userEmployee.role !== EmployeeRole.admin &&
            this.userEmployee.role !== EmployeeRole.head
              ? [(this.userEmployee.locality as ILocality)._id]
              : undefined,
        })
        .subscribe((value) => {
          this.carsOptions = value;
        });

      /* Client Managers */
      this.clientManagersOptions$?.unsubscribe();
      this.clientManagersOptions$ = this.options
        .getEmployeesOptions({
          roles: [EmployeeRole.clientManager],
          localitiesIds:
            this.userEmployee &&
            this.userEmployee.role !== EmployeeRole.admin &&
            this.userEmployee.role !== EmployeeRole.head
              ? [(this.userEmployee.locality as ILocality)._id]
              : undefined,
        })
        .subscribe((value) => {
          this.clientManagersOptions = value;
        });

      /* Receiving Managers */
      this.receivingManagersOptions$?.unsubscribe();
      this.receivingManagersOptions$ = this.options
        .getEmployeesOptions({
          roles: [EmployeeRole.receivingManager],
          localitiesIds:
            this.userEmployee &&
            this.userEmployee.role !== EmployeeRole.admin &&
            this.userEmployee.role !== EmployeeRole.head
              ? [(this.userEmployee.locality as ILocality)._id]
              : undefined,
        })
        .subscribe((value) => {
          this.receivingManagersOptions = value;
        });

      /* Drivers */
      this.driversOptions$?.unsubscribe();
      this.driversOptions$ = this.options
        .getEmployeesOptions({
          roles: [EmployeeRole.driver],
          localitiesIds:
            this.userEmployee &&
            this.userEmployee.role !== EmployeeRole.admin &&
            this.userEmployee.role !== EmployeeRole.head
              ? [(this.userEmployee.locality as ILocality)._id]
              : undefined,
        })
        .subscribe((value) => {
          this.driversOptions = value;
        });

      this.advancedSearchForm
        ?.get('localities')
        .valueChanges.subscribe((fieldValues) => {
          this.advancedSearchForm.get('divisions').setValue([]);
          this.advancedSearchForm.get('performersClientManagers').setValue([]);
          this.advancedSearchForm
            .get('performersReceivingManagers')
            .setValue([]);
          this.advancedSearchForm.get('performersDrivers').setValue([]);
          this.advancedSearchForm.get('performersCars').setValue([]);

          /* Divisions */
          this.divisionsOptions$?.unsubscribe();
          this.divisionsOptions$ = this.options
            .getDivisionsOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.divisionsOptions = value;
            });

          /* Cars */
          this.carsOptions$?.unsubscribe();
          this.carsOptions$ = this.options
            .getCarsOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.carsOptions = value;
            });

          /* Client Managers */
          this.clientManagersOptions$?.unsubscribe();
          this.clientManagersOptions$ = this.options
            .getEmployeesOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.clientManager],
            })
            .subscribe((value) => {
              this.clientManagersOptions = value;
            });

          /* Receiving Managers */
          this.receivingManagersOptions$?.unsubscribe();
          this.receivingManagersOptions$ = this.options
            .getEmployeesOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.receivingManager],
            })
            .subscribe((value) => {
              this.receivingManagersOptions = value;
            });

          /* Drivers */
          this.driversOptions$?.unsubscribe();
          this.driversOptions$ = this.options
            .getEmployeesOptions({
              localitiesIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.driver],
            })
            .subscribe((value) => {
              this.driversOptions = value;
            });
        });

      this.advancedSearchForm
        ?.get('divisions')
        .valueChanges.subscribe((fieldValues) => {
          this.advancedSearchForm.get('performersClientManagers').setValue([]);
          this.advancedSearchForm
            .get('performersReceivingManagers')
            .setValue([]);
          this.advancedSearchForm.get('performersDrivers').setValue([]);
          this.advancedSearchForm.get('performersCars').setValue([]);

          /* Cars */
          this.carsOptions$?.unsubscribe();
          this.carsOptions$ = this.options
            .getCarsOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
            })
            .subscribe((value) => {
              this.carsOptions = value;
            });

          /* Client Managers */
          this.clientManagersOptions$?.unsubscribe();
          this.clientManagersOptions$ = this.options
            .getEmployeesOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.clientManager],
            })
            .subscribe((value) => {
              this.clientManagersOptions = value;
            });

          /* Receiving Managers */
          this.receivingManagersOptions$?.unsubscribe();
          this.receivingManagersOptions$ = this.options
            .getEmployeesOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.receivingManager],
            })
            .subscribe((value) => {
              this.receivingManagersOptions = value;
            });

          /* Drivers */
          this.driversOptions$?.unsubscribe();
          this.driversOptions$ = this.options
            .getEmployeesOptions({
              divisionsIds: fieldValues.length > 0 ? fieldValues : undefined,
              roles: [EmployeeRole.driver],
            })
            .subscribe((value) => {
              this.driversOptions = value;
            });
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
        deadline: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('deadlineFrom').value,
          this.advancedSearchForm.get('deadlineTo').value
        ),

        scheduledOrder:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('scheduledOrder').value
          ) || undefined,
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

        weighedPaymentAmount: this.getters.getArrayOrUndefined<number | null>(
          this.advancedSearchForm.get('weighedPaymentAmount').value,
          2,
          this.getters.getArrayFromStringsToNullOrString
        ),

        customerComment:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerComment').value
          ) || undefined,
        companyComment:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('companyComment').value
          ) || undefined,
        customerCancellationReason:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('customerCancellationReason').value
          ) || undefined,
        companyCancellationReason:
          this.getters.getClearServerRequestString(
            this.advancedSearchForm.get('companyCancellationReason').value
          ) || undefined,

        localities:
          this.advancedSearchForm.get('localities').value.length <= 0 ||
          this.advancedSearchForm.get('localities').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('localities').value
              ),
        divisions:
          this.advancedSearchForm.get('divisions').value.length <= 0 ||
          this.advancedSearchForm.get('divisions').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('divisions').value
              ),

        performersClientManagers:
          this.advancedSearchForm.get('performersClientManagers').value
            .length <= 0 ||
          this.advancedSearchForm.get('performersClientManagers').value[0] ===
            ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('performersClientManagers').value
              ),
        performersReceivingManagers:
          this.advancedSearchForm.get('performersReceivingManagers').value
            .length <= 0 ||
          this.advancedSearchForm.get('performersReceivingManagers')
            .value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('performersReceivingManagers').value
              ),
        performersDrivers:
          this.advancedSearchForm.get('performersDrivers').value.length <= 0 ||
          this.advancedSearchForm.get('performersDrivers').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('performersDrivers').value
              ),
        performersCars:
          this.advancedSearchForm.get('performersCars').value.length <= 0 ||
          this.advancedSearchForm.get('performersCars').value[0] === ''
            ? undefined
            : this.getters.getArrayOrUndefined<string>(
                this.advancedSearchForm.get('performersCars').value
              ),

        createdAt: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('createdAtFrom').value,
          this.advancedSearchForm.get('createdAtTo').value
        ),
        updatedAt: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('updatedAtFrom').value,
          this.advancedSearchForm.get('updatedAtTo').value
        ),
        statusDateAccepted: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('statusDateAcceptedFrom').value,
          this.advancedSearchForm.get('statusDateAcceptedTo').value
        ),
        statusDateDelivered: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('statusDateDeliveredFrom').value,
          this.advancedSearchForm.get('statusDateDeliveredTo').value
        ),
        statusDateWeighed: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('statusDateWeighedFrom').value,
          this.advancedSearchForm.get('statusDateWeighedTo').value
        ),
        statusDateCompleted: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('statusDateCompletedFrom').value,
          this.advancedSearchForm.get('statusDateCompletedTo').value
        ),
        statusDateRefused: this.getters.getServerFromToDateInISOStringArray(
          this.advancedSearchForm.get('statusDateRefusedFrom').value,
          this.advancedSearchForm.get('statusDateRefusedTo').value
        ),
      };
    };

    this.onTableRequest = (request, withLoading) => {
      this.store.dispatch(
        OrdersActions.getOrdersRequest({ params: request, withLoading })
      );
    };

    this.socket.get()?.on('orders', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.sendRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.items && this.items.length > 0) {
          const isExist = this.items.find((order) => {
            return order._id === data.id;
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
      .select(OrdersSelectors.selectOrders)
      .subscribe((orders) => {
        this.items = orders;
        if (orders) {
          this.tableData = orders.map((order) => {
            return {
              id: this.highlightSearchedValue(
                order._id,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              status: `<p class="${orderStatusColors[order.status]}-text">${
                orderStatusStrings[order.status]
              }</p>`,
              type: orderTypeStrings[order.type],
              deadline: order.deadline
                ? formatDate(order.deadline, 'dd.MM.yyyy - HH:mm', this.locale)
                : undefined,

              scheduledOrder: order.scheduledOrder
                ? this.highlightSearchedValue(
                    order.scheduledOrder,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              client: order.client
                ? this.highlightSearchedValue(
                    (order.client as IClient)._id,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              locality: (order.locality as ILocality)?.name || '',
              division: (order.division as IDivision)?.name || '',

              customerOrganizationLegalName: this.highlightSearchedValue(
                order.customer.organizationLegalName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerOrganizationActualName: this.highlightSearchedValue(
                order.customer.organizationLegalName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerContactName: this.highlightSearchedValue(
                order.customer.contactName,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              customerContactPhone: this.quickSearchForm?.get('search').value
                ? this.highlightSearchedValue(
                    order.customer.contactPhone,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : this.getters.getBeautifiedPhoneNumber(
                    order.customer.contactPhone
                  ),

              deliveryType: deliveryTypeStrings[order.delivery._type] || '',
              deliveryCustomerCarNumber: this.highlightSearchedValue(
                order.delivery.customerCarNumber,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),
              deliveryHasAssistant:
                order.delivery.hasAssistant === true
                  ? 'есть'
                  : order.delivery.hasAssistant === false
                  ? 'нет'
                  : '',
              deliveryAddressFromStreet: order.delivery.addressFrom?.street
                ? this.highlightSearchedValue(
                    order.delivery.addressFrom?.street,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              deliveryAddressFromHouse: order.delivery.addressFrom?.house
                ? this.highlightSearchedValue(
                    order.delivery.addressFrom?.house,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              paymentMethod:
                paymentMethodOffersOptions.find(
                  (el) => el.value === order.payment?.method + ''
                )?.text || '',
              paymentMethodData: this.highlightSearchedValue(
                order.payment?.methodData,
                this.quickSearchForm
                  ? this.quickSearchForm.get('search').value
                  : ''
              ),

              performersClientManager: (order.performers
                .clientManager as IEmployee)
                ? order.performers.clientManagerAccepted === true
                  ? `<p class='green-text'>${this.getters.getUserInitials(
                      (order.performers.clientManager as IEmployee).name,
                      (order.performers.clientManager as IEmployee).surname,
                      (order.performers.clientManager as IEmployee).patronymic
                    )}</p>`
                  : `<p class='yellow-text'>${this.getters.getUserInitials(
                      (order.performers.clientManager as IEmployee).name,
                      (order.performers.clientManager as IEmployee).surname,
                      (order.performers.clientManager as IEmployee).patronymic
                    )}</p>`
                : '',
              performersReceivingManager: (order.performers
                .receivingManager as IEmployee)
                ? order.performers.receivingManagerAccepted === true
                  ? `<p class='green-text'>${this.getters.getUserInitials(
                      (order.performers.receivingManager as IEmployee).name,
                      (order.performers.receivingManager as IEmployee).surname,
                      (order.performers.receivingManager as IEmployee)
                        .patronymic
                    )}</p>`
                  : `<p class='yellow-text'>${this.getters.getUserInitials(
                      (order.performers.receivingManager as IEmployee).name,
                      (order.performers.receivingManager as IEmployee).surname,
                      (order.performers.receivingManager as IEmployee)
                        .patronymic
                    )}</p>`
                : '',
              performersDriver: (order.performers.driver as IEmployee)
                ? order.performers.driverAccepted === true
                  ? `<p class='green-text'>${this.getters.getUserInitials(
                      (order.performers.driver as IEmployee).name,
                      (order.performers.driver as IEmployee).surname,
                      (order.performers.driver as IEmployee).patronymic
                    )}</p>`
                  : `<p class='yellow-text'>${this.getters.getUserInitials(
                      (order.performers.driver as IEmployee).name,
                      (order.performers.driver as IEmployee).surname,
                      (order.performers.driver as IEmployee).patronymic
                    )}</p>`
                : '',
              performersCar: (order.performers.car as ICar)?.licensePlate || '',

              weighedPaymentAmount: order.weighed?.paymentAmount
                ? this.highlightSearchedValue(
                    order.weighed.paymentAmount + '',
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              customerComment: order.customerComment
                ? this.highlightSearchedValue(
                    order.customerComment,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              companyComment: order.companyComment
                ? this.highlightSearchedValue(
                    order.companyComment,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              customerCancellationReason: order.customerCancellationReason
                ? this.highlightSearchedValue(
                    order.customerCancellationReason,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',
              companyCancellationReason: order.companyCancellationReason
                ? this.highlightSearchedValue(
                    order.companyCancellationReason,
                    this.quickSearchForm
                      ? this.quickSearchForm.get('search').value
                      : ''
                  )
                : '',

              createdAt: formatDate(
                order.createdAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              updatedAt: formatDate(
                order.updatedAt,
                'dd.MM.yyyy - HH:mm',
                this.locale
              ),
              statusDateAccepted: order.statusDateAccepted
                ? formatDate(
                    order.statusDateAccepted,
                    'dd.MM.yyyy - HH:mm',
                    this.locale
                  )
                : '',
              statusDateDelivered: order.statusDateDelivered
                ? formatDate(
                    order.statusDateDelivered,
                    'dd.MM.yyyy - HH:mm',
                    this.locale
                  )
                : '',
              statusDateWeighed: order.statusDateWeighed
                ? formatDate(
                    order.statusDateWeighed,
                    'dd.MM.yyyy - HH:mm',
                    this.locale
                  )
                : '',
              statusDateCompleted: order.statusDateCompleted
                ? formatDate(
                    order.statusDateCompleted,
                    'dd.MM.yyyy - HH:mm',
                    this.locale
                  )
                : '',
              statusDateRefused: order.statusDateRefused
                ? formatDate(
                    order.statusDateRefused,
                    'dd.MM.yyyy - HH:mm',
                    this.locale
                  )
                : '',
            };
          });
        }
      });

    this.isFetching$ = this.store
      .select(OrdersSelectors.selectGetOrdersIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.getItemsError$ = this.store
      .select(OrdersSelectors.selectGetOrdersError)
      .subscribe((error) => {
        if (error) {
          this.getItemsResultSnackbar = this.snackBar.open(
            'Ошибка при запросе заказов. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.pagination$ = this.store
      .select(OrdersSelectors.selectGetOrdersPagination)
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

    this.socket.get()?.off('orders');

    this.options.destroyLocalitiesOptions();
    this.options.destroyDivisionsOptions();
    this.options.destroyCarsOptions();
    this.options.destroyEmployeesOptions();
  }

  public onTableItemClick(index: number): void {
    const currentItemId =
      this.items && this.items[index] && this.items[index]._id
        ? this.items[index]._id
        : undefined;
    if (currentItemId) {
      this.router.navigate([`./${currentItemId}`], {
        relativeTo: this.route,
      });
    }
  }
}
