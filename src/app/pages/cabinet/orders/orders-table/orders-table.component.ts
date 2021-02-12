import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { testOrdersResponse } from '../../../../data/testOrders';
import { ITableOrderData } from '../../../../models/TableOrderData';
import { IOrder } from 'src/app/models/Order';
import DeliveryType, {
  deliveryTypeStrings,
} from '../../../../models/enums/DeliveryType';
import OrderStatus, {
  orderStatusColors,
  orderStatusStrings,
} from '../../../../models/enums/OrderStatus';
import { ILocality } from '../../../../models/Locality';
import OrderType, {
  orderTypeStrings,
} from '../../../../models/enums/OrderType';
import RawType, { rawTypeStrings } from '../../../../models/enums/RawType';
import { rawUnitStrings } from '../../../../models/enums/RawUnit';
import { PhonePipe } from '../../../../pipes/phone.pipe';
import { paymentMethodStrings } from '../../../../models/enums/PaymentMethod';
import { FilterType } from 'src/app/models/enums/FilterType';
import { PaginationType } from '../../../../models/types/PaginationType';
import { FormControl, FormGroup } from '@angular/forms';
import {
  TableColumnType,
  TableDisplayOutputType,
  TableSortType,
} from 'src/app/components/table/table.component';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  providers: [PhonePipe],
})
export class OrdersTableComponent implements OnInit {
  public isEmployee: boolean;

  public currentForm: 'fast' | 'advanced' | 'id' = 'fast';

  // @ts-ignore
  public orders: IOrder[] = testOrdersResponse.orders;
  public tableColumns: TableColumnType[];
  public tableData: ITableOrderData[];

  public columnsCanBeDisplayed: TableDisplayOutputType[] = [
    'id',
    'status',
    'customerContactName',
    'deliveryAddress',
  ];
  public displayedColumns: TableDisplayOutputType[];
  public tableSorting: TableSortType = {
    field: 'status',
    type: 'asc',
  };

  public tableLoading = false;

  public tablePagination: PaginationType = {
    page: 2,
    totalPagesCount: 234,
    totalItemsCount: 2334,
    perPage: 10,
  };

  public fastSearchForm: FormGroup;
  public advancedSearchForm: FormGroup;
  public idSearchForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private phonePipe: PhonePipe,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }

    this.initFastSearchForm();
    this.initAdvancedSearchForm();
    this.initIdSearchForm();

    this.makeTableColumns();
    this.makeTableData();
  }

  initFastSearchForm(): void {
    this.fastSearchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  initAdvancedSearchForm(): void {
    this.fastSearchForm = new FormGroup({
      type: new FormControl(''),
      deliveryType: new FormControl(''),
      deliveryCustomerCarNumber: new FormControl(''),
      deliveryHasAssistant: new FormControl(''),
      locality: new FormControl(''),
      deliveryAddressFromStreet: new FormControl(''),
      deliveryAddressFromHouse: new FormControl(''),
      division: new FormControl(''),
      approximateRawType: new FormControl(''),
      approximateRawAmountUnit: new FormControl(''),
      approximateRawAmountFrom: new FormControl(''),
      approximateRawAmountTo: new FormControl(''),
      customerOrganizationLegalName: new FormControl(''),
      customerOrganizationActualName: new FormControl(''),
      customerContactName: new FormControl(''),
      customerContactPhone: new FormControl(''),
      paymentMethod: new FormControl(''),
      desiredPickupDateFrom: new FormControl(''),
      desiredPickupDateTo: new FormControl(''),
      customerComment: new FormControl(''),
      status: new FormControl(''),
      manager: new FormControl(''),
      driver: new FormControl(''),
      companyCar: new FormControl(''),
      statusDateAcceptedFrom: new FormControl(''),
      statusDateAcceptedTo: new FormControl(''),
      statusDateInTransitFrom: new FormControl(''),
      statusDateInTransitTo: new FormControl(''),
      statusDatePackedFrom: new FormControl(''),
      statusDatePackedTo: new FormControl(''),
      statusDateDeliveredFrom: new FormControl(''),
      statusDateDeliveredTo: new FormControl(''),
      statusDateWeighedFrom: new FormControl(''),
      statusDateWeighedTo: new FormControl(''),
      statusDateCompletedFrom: new FormControl(''),
      statusDateCompletedTo: new FormControl(''),
      customerCancellationReason: new FormControl(''),
      companyCancellationReason: new FormControl(''),
      companyComment: new FormControl(''),
      rawAmount: new FormControl(''),
      paymentAmount: new FormControl(''),
      createdAtFrom: new FormControl(''),
      createdAtTo: new FormControl(''),
      updatedAtFrom: new FormControl(''),
      updatedAtTo: new FormControl(''),
    });
  }

  initIdSearchForm(): void {
    this.idSearchForm = new FormGroup({
      id: new FormControl(''),
      scheduledOrder: new FormControl(''),
      client: new FormControl(''),
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
        key: 'type',
        title: 'Тип заявки',
      },
      {
        key: 'rawType',
        title: 'Тип сырья',
      },
      {
        key: 'rawAmount',
        title: 'Прибл. кол-во сырья',
      },
      {
        key: 'locality',
        title: 'Населённый пункт',
      },
      {
        key: 'division',
        title: 'Подразделение',
      },
      {
        key: 'deliveryType',
        title: 'Тип доставки',
      },
      {
        key: 'deliveryAddress',
        title: 'Адрес доставки',
      },
      {
        key: 'hasAssistant',
        title: 'Помощник',
      },
      {
        key: 'customerCarNumber',
        title: 'Номер авто клиента',
      },
      {
        key: 'customerOrganizationLegalName',
        title: 'Юр. наиманование организации',
      },
      {
        key: 'customerOrganizationActualName',
        title: 'Факт. наиманование организации',
      },
      {
        key: 'customerContactName',
        title: 'Контактное имя',
      },
      {
        key: 'customerContactPhone',
        title: 'Контактный телефон',
      },
      {
        key: 'paymentMethod',
        title: 'Способ оплаты',
      },
      {
        key: 'paymentMethodData',
        title: 'Информация об оплате',
      },
      {
        key: 'manager',
        title: 'Менеджер',
      },
      {
        key: 'driver',
        title: 'Водитель',
      },
      {
        key: 'weigher',
        title: 'Весовщик',
      },
      {
        key: 'desiredPickupDate',
        title: 'Желаемая дата',
      },
      {
        key: 'createdAt',
        title: 'Дата создания заявки',
      },
      {
        key: 'weighedRaw',
        title: 'Взвешенное сырье',
      },
      {
        key: 'weighedRawAMount',
        title: 'Кол-во взвешенного сырья',
      },
      {
        key: 'customerComment',
        title: 'Комментарий заказчика',
      },
      {
        key: 'employeeComment',
        title: 'Комментарий сотрудника',
      },
    ];

    this.displayedColumns = undefined;
  }

  makeTableData(): void {
    this.tableData = this.orders.map((order) => {
      const tableOrder: ITableOrderData = {
        createdAt: formatDate(
          order.createdAt,
          'dd.MM.yyyy - hh:mm',
          this.locale
        ),
        customerCarNumber: order.delivery.customerCarNumber,
        customerComment: order.comment,
        customerContactName: order.customer.contactName,
        customerContactPhone: this.phonePipe.transform(
          order.customer.contactPhone
        ),
        customerOrganizationActualName: order.customer.organizationActualName,
        customerOrganizationLegalName: order.customer.organizationLegalName,
        deliveryAddress:
          'ул.' +
          order.delivery.addressFrom.street +
          ', д.' +
          order.delivery.addressFrom.house,
        deliveryType: deliveryTypeStrings[order.delivery._type].toString(),
        desiredPickupDate: formatDate(
          order.desiredPickupDate,
          'dd.MM.yyyy - hh:mm',
          this.locale
        ),
        division: order.division ? order.division.toString() : '-',
        driver: order.processing.driverAssign
          ? order.processing.driverAssign.toString()
          : '-',
        employeeComment: order.processing.comment,
        hasAssistant:
          order.delivery.hasAssistant === true
            ? 'есть'
            : order.delivery.hasAssistant === false
            ? 'нет'
            : '-',
        id: order._id,
        locality: order.delivery.addressFrom.locality
          ? (order.delivery.addressFrom.locality as ILocality).name
          : '-',
        manager: order.processing.managerAssign
          ? order.processing.managerAssign.toString()
          : '-',
        paymentMethod: paymentMethodStrings[order.payment.method],
        paymentMethodData: order.payment.methodData || '-',
        rawAmount:
          order.approximateRaw.amount +
          ' ' +
          rawUnitStrings[order.approximateRaw.amountUnit],
        rawType: order.approximateRaw._type
          .map((item, i) => {
            if (i === 0) {
              return rawTypeStrings[item];
            }
            return ' ' + rawTypeStrings[item];
          })
          .toString(),
        status: `<p class="${
          orderStatusColors[order.processing.status]
        }-text">${orderStatusStrings[order.processing.status]}</p>`,
        type: orderTypeStrings[order.type],
        weighedRaw: order.processing.weighedRaw
          ? order.processing.weighedRaw.toString()
          : '-',
        weighedRawAmount: order.processing.weighedRaw
          ? order.processing.weighedRaw.toString()
          : '-',
        weigher: order.processing.weigherAssign
          ? order.processing.weigherAssign.toString()
          : '-',
      };

      return tableOrder;
    });
  }
}
