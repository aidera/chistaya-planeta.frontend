import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { testOrdersResponse } from '../../../data/testOrders';
import { ITableOrderData } from '../../../models/TableOrderData';
import { IOrder } from 'src/app/models/Order';
import DeliveryType, {
  deliveryTypeStrings,
} from '../../../models/enums/DeliveryType';
import OrderStatus, {
  orderStatusColors,
  orderStatusStrings,
} from '../../../models/enums/OrderStatus';
import { ILocality } from '../../../models/Locality';
import OrderType, { orderTypeStrings } from '../../../models/enums/OrderType';
import RawType, { rawTypeStrings } from '../../../models/enums/RawType';
import { rawUnitStrings } from '../../../models/enums/RawUnit';
import { PhonePipe } from '../../../pipes/phone.pipe';
import { paymentMethodStrings } from '../../../models/enums/PaymentMethod';
import { FilterType } from 'src/app/models/enums/FilterType';
import { TableColumnType } from '../../../models/types/TableColumnType';
import { TableSortType } from '../../../models/types/TableSortType';
import { TableFilterOutputType } from 'src/app/models/types/TableFilterType';
import { TableDisplayOutputType } from 'src/app/models/types/TableDisplayType';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [PhonePipe],
})
export class OrdersComponent implements OnInit {
  public isEmployee: boolean;

  // remove to ngrx
  public totalOrdersCount = 22;
  public totalPagesCount = 3;
  public currentPage = 1;
  public perPage = 10;

  // @ts-ignore
  public orders: IOrder[] = testOrdersResponse.orders;
  public tableColumns: TableColumnType[];
  public tableData: ITableOrderData[];

  public displayedColumns: TableDisplayOutputType[];
  public tableSorting: TableSortType = {
    field: 'status',
    type: 'asc',
  };
  public tableFiltration: TableFilterOutputType[] = [
    {
      field: 'status',
      value: [0, 1, 6],
    },
    {
      field: 'customerContactName',
      value: 'вася',
    },
    {
      field: 'deliveryAddress',
      value: 'a',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private phonePipe: PhonePipe,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    if (this.route.parent) {
      this.isEmployee = this.route.parent.snapshot.data.isEmployee;
    }

    this.makeTableColumns();
    this.makeTableData();
  }

  makeTableColumns(): void {
    this.tableColumns = [
      {
        key: 'status',
        title: 'Статус',
        filter: {
          type: FilterType.values,
          values: Object.keys(OrderStatus)
            .filter((value: string | number) => !isNaN(+value))
            .map((key) => {
              return {
                value: Number(key),
                text: orderStatusStrings[key],
              };
            }),
        },
      },
      {
        key: 'type',
        title: 'Тип заявки',
        filter: {
          type: FilterType.values,
          values: Object.keys(OrderType)
            .filter((value: string | number) => !isNaN(+value))
            .map((key) => {
              return {
                value: Number(key),
                text: orderTypeStrings[key],
              };
            }),
        },
      },
      {
        key: 'rawType',
        title: 'Тип сырья',
        filter: {
          type: FilterType.values,
          values: Object.keys(RawType)
            .filter((value: string | number) => !isNaN(+value))
            .map((key) => {
              return {
                value: Number(key),
                text: rawTypeStrings[key],
              };
            }),
        },
      },
      {
        key: 'rawAmount',
        title: 'Прибл. кол-во сырья',
        // filterType: FilterType.number,
      },
      {
        key: 'locality',
        title: 'Населённый пункт',
        // filterType: FilterType.values,
      },
      {
        key: 'division',
        title: 'Подразделение',
        // filterType: FilterType.values,
      },
      {
        key: 'deliveryType',
        title: 'Тип доставки',
        filter: {
          type: FilterType.values,
          values: Object.keys(DeliveryType)
            .filter((value: string | number) => !isNaN(+value))
            .map((key) => {
              return {
                value: Number(key),
                text: deliveryTypeStrings[key],
              };
            }),
        },
      },
      {
        key: 'deliveryAddress',
        title: 'Адрес доставки',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'hasAssistant',
        title: 'Помощник',
        // filterType: FilterType.values,
      },
      {
        key: 'customerCarNumber',
        title: 'Номер авто клиента',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'customerOrganizationLegalName',
        title: 'Юр. наиманование организации',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'customerOrganizationActualName',
        title: 'Факт. наиманование организации',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'customerContactName',
        title: 'Контактное имя',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'customerContactPhone',
        title: 'Контактный телефон',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'paymentMethod',
        title: 'Способ оплаты',
        // filterType: FilterType.values,
      },
      {
        key: 'paymentMethodData',
        title: 'Информация об оплате',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'manager',
        title: 'Менеджер',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'driver',
        title: 'Водитель',
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'weigher',
        title: 'Весовщик',
        filter: {
          type: FilterType.text,
        },
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
        filter: {
          type: FilterType.text,
        },
      },
      {
        key: 'employeeComment',
        title: 'Комментарий сотрудника',
        filter: {
          type: FilterType.text,
        },
      },
    ];

    this.displayedColumns = this.tableColumns.map((column) => column.key);
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

  onTableDisplay(event: TableDisplayOutputType[]): void {
    this.displayedColumns = event;
  }

  onTableSort(event: TableSortType): void {
    this.tableSorting = event;
  }

  onTableFilter(event: TableFilterOutputType[]): void {
    this.tableFiltration = event;
  }
}
