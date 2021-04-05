import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as ScheduledOrdersActions from '../../../../store/scheduled-orders/scheduled-orders.actions';
import * as ScheduledOrdersSelectors from '../../../../store/scheduled-orders/scheduled-orders.selectors';
import * as OffersActions from '../../../../store/offers/offers.actions';
import * as OffersSelectors from '../../../../store/offers/offers.selectors';
import * as ServicesActions from '../../../../store/services/services.actions';
import * as ServicesSelectors from '../../../../store/services/services.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { IOffer } from '../../../../models/Offer';
import { IService } from '../../../../models/Service';
import { OrderType } from '../../../../models/enums/OrderType';
import { DeliveryType } from '../../../../models/enums/DeliveryType';
import { IScheduledOrder } from '../../../../models/ScheduledOrder';
import { deliveryTypeStrings } from '../../../../data/deliveryTypeData';
import { orderTypeStrings } from '../../../../data/orderTypeData';
import {
  unitOffersOptions,
  unitServicesOptions,
  unitStrings,
} from '../../../../data/unitOptions';
import {
  paymentMethodStrings,
  paymentMethodOffersOptions,
  paymentMethodServicesOptions,
} from '../../../../data/paymentMethodData';
import { responseCodes } from '../../../../data/responseCodes';
import { IClient } from '../../../../models/Client';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import {
  simpleStatusColors,
  simpleStatusOptions,
  simpleStatusStrings,
} from '../../../../data/simpleStatusData';
import {
  periodTypeOptions,
  periodTypeStrings,
} from '../../../../data/periodTypeData';
import { tomorrow } from '../../../../utils/date.functions';
import { OptionType } from '../../../../models/types/OptionType';
import { PaymentMethod } from '../../../../models/enums/PaymentMethod';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { OptionsService } from '../../../../services/options/options.service';
import { GettersService } from '../../../../services/getters/getters.service';
import { ClientsApiService } from '../../../../services/api/clients-api.service';

@Component({
  selector: 'app-scheduled-order-item',
  templateUrl: './scheduled-order-item.component.html',
  styleUrls: ['./scheduled-order-item.component.scss'],
})
export class ScheduledOrderItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public item: IScheduledOrder;

  /* -------------------- */
  /* Other items settings */
  /* -------------------- */
  public offers$: Subscription;
  public offers: IOffer[];
  public services$: Subscription;
  public services: IService[];

  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public offersOptions: OptionType[] = [];
  public servicesOptions: OptionType[] = [];

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderType = OrderType;
  public simpleStatus = SimpleStatus;
  public deliveryType = DeliveryType;
  public paymentMethod = PaymentMethod;
  public simpleStatusOptions = simpleStatusOptions;
  public periodTypeOptions = periodTypeOptions;
  public periodTypeStrings = periodTypeStrings;
  public simpleStatusColors = simpleStatusColors;
  public simpleStatusStrings = simpleStatusStrings;
  public orderTypeStrings = orderTypeStrings;
  public deliveryTypeStrings = deliveryTypeStrings;
  public paymentMethodStrings = paymentMethodStrings;
  public paymentMethodOffersOptions = paymentMethodOffersOptions;
  public paymentMethodServicesOptions = paymentMethodServicesOptions;
  public unitStrings = unitStrings;
  public offersUnitOptions = unitOffersOptions;
  public servicesUnitOptions = unitServicesOptions;
  public startMinDate = tomorrow;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    /* this */
    private title: Title,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private options: OptionsService,
    private clientsApi: ClientsApiService,
    public getters: GettersService
  ) {
    super(store, router, route);

    title.setTitle('Периодическая заявка - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initDivisionsOptions();

    /* ------------- */
    /* Form settings */
    /* ------------- */

    /* --- Main form --- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl('', Validators.required),

        periodType: new FormControl('', Validators.required),
        periodAmount: new FormControl('1', [
          Validators.required,
          Validators.min(1),
        ]),

        startDate: new FormControl('', Validators.required),

        client: new FormControl(''),

        offersItems: new FormControl([]),
        offersAmountUnit: new FormControl(''),
        offersAmount: new FormControl(''),

        servicesAmountUnit: new FormControl(''),
        servicesAmount: new FormControl(''),

        customerContactName: new FormControl(
          this.userClient ? this.userClient.name : '',
          Validators.required
        ),
        customerContactPhone: new FormControl(
          this.userClient ? this.userClient.phone.substr(2) : '',
          Validators.required
        ),
        customerOrganizationLegalName: new FormControl(''),
        customerOrganizationActualName: new FormControl(''),

        deliveryCustomerCarNumber: new FormControl(''),
        deliveryHasAssistant: new FormControl(''),
        deliveryAddressFromStreet: new FormControl(''),
        deliveryAddressFromHouse: new FormControl(''),

        paymentMethod: new FormControl(''),
        paymentMethodData: new FormControl(''),

        customerComment: new FormControl(''),
      });

      this.form
        .get('client')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '' && this.activeField === 'client') {
            this.clientsApi
              .checkId(this.form.get('client').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode !== responseCodes.found) {
                  this.form.get('client').markAsTouched();
                  this.form.get('client').setErrors({ notExists: true });
                }
              });
          }
        });
    };

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        ScheduledOrdersActions.getScheduledOrderRequest({
          id: this.itemId,
          withLoading,
        })
      );
    };

    this.updateItemRequest = () => {
      const startDate = new Date(this.form.get('startDate').value);
      if (startDate) {
        startDate.setHours(0, 0);
      }

      this.store.dispatch(
        ScheduledOrdersActions.updateScheduledOrderRequest({
          id: this.item._id,
          fields: {
            status:
              this.activeField === 'status'
                ? +this.form.get('status').value
                : undefined,
            periodType:
              this.activeField === 'periodType'
                ? +this.form.get('periodType').value
                : undefined,
            periodAmount:
              this.activeField === 'periodAmount'
                ? +this.form.get('periodAmount').value
                : undefined,
            startDate: this.activeField === 'startDate' ? startDate : undefined,
            client:
              this.activeField === 'client'
                ? this.form.get('client').value
                : undefined,
            offersItems:
              this.activeField === 'offersItems'
                ? this.form.get('offersItems').value
                : undefined,
            offersAmount:
              this.activeField === 'offersAmount'
                ? +this.form.get('offersAmount').value
                : undefined,
            offersAmountUnit:
              this.activeField === 'offersAmountUnit'
                ? +this.form.get('offersAmountUnit').value
                : undefined,
            servicesAmount:
              this.activeField === 'servicesAmount'
                ? +this.form.get('servicesAmount').value
                : undefined,
            servicesAmountUnit:
              this.activeField === 'servicesAmountUnit'
                ? +this.form.get('servicesAmountUnit').value
                : undefined,
            deliveryCustomerCarNumber:
              this.activeField === 'deliveryCustomerCarNumber'
                ? this.form.get('deliveryCustomerCarNumber').value
                : undefined,
            deliveryAddressFromStreet:
              this.activeField === 'deliveryAddressFromStreet'
                ? this.form.get('deliveryAddressFromStreet').value
                : undefined,
            deliveryAddressFromHouse:
              this.activeField === 'deliveryAddressFromHouse'
                ? this.form.get('deliveryAddressFromHouse').value
                : undefined,
            deliveryHasAssistant:
              this.activeField === 'deliveryHasAssistant'
                ? this.form.get('deliveryHasAssistant').value === 'true'
                : undefined,
            customerContactName:
              this.activeField === 'customerContactName'
                ? this.form.get('customerContactName').value
                : undefined,
            customerContactPhone:
              this.activeField === 'customerContactPhone'
                ? '+7' + this.form.get('customerContactPhone').value
                : undefined,
            customerOrganizationLegalName:
              this.activeField === 'customerOrganizationLegalName'
                ? this.form.get('customerOrganizationLegalName').value
                : undefined,
            customerOrganizationActualName:
              this.activeField === 'customerOrganizationActualName'
                ? this.form.get('customerOrganizationActualName').value
                : undefined,
            paymentMethod:
              this.activeField === 'paymentMethod'
                ? +this.form.get('paymentMethod').value
                : undefined,
            paymentMethodData:
              this.activeField === 'paymentMethodData'
                ? this.form.get('paymentMethodData').value
                : undefined,
            customerComment:
              this.activeField === 'customerComment'
                ? this.form.get('customerComment').value
                : undefined,
          },
        })
      );
    };

    this.removeItemRequest = () => {
      this.store.dispatch(
        ScheduledOrdersActions.removeScheduledOrderRequest({
          id: this.item._id,
        })
      );
      this.router.navigate(['../'], { relativeTo: this.route });
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */

    this.item$ = this.store
      .select(ScheduledOrdersSelectors.selectScheduledOrder)
      .subscribe((scheduledOrder) => {
        this.item = scheduledOrder;

        this.initForm();

        if (this.form && scheduledOrder) {
          this.form.setValue({
            status: scheduledOrder.status + '',

            periodType:
              scheduledOrder.periodType !== undefined
                ? scheduledOrder.periodType + ''
                : '',
            periodAmount:
              scheduledOrder.periodAmount !== undefined
                ? scheduledOrder.periodAmount
                : '',

            startDate: scheduledOrder.startDate || '',

            client: (scheduledOrder.client as IClient)?._id || '',

            offersItems:
              (scheduledOrder.offers?.items as IOffer[]).map((el) => el._id) ||
              [],
            offersAmountUnit:
              scheduledOrder.offers?.amountUnit !== undefined
                ? scheduledOrder.offers.amountUnit + ''
                : '',
            offersAmount:
              scheduledOrder.offers?.amount !== undefined
                ? scheduledOrder.offers?.amount
                : '',

            servicesAmountUnit:
              scheduledOrder.services?.amountUnit !== undefined
                ? scheduledOrder.services.amountUnit + ''
                : '',
            servicesAmount:
              scheduledOrder.services?.amount !== undefined
                ? scheduledOrder.services?.amount
                : '',

            customerContactName: scheduledOrder.customer?.contactName || '',
            customerContactPhone:
              scheduledOrder.customer?.contactPhone?.substr(2) || '',
            customerOrganizationLegalName:
              scheduledOrder.customer?.organizationLegalName || '',
            customerOrganizationActualName:
              scheduledOrder.customer?.organizationActualName || '',

            deliveryCustomerCarNumber:
              scheduledOrder.delivery?.customerCarNumber || '',
            deliveryHasAssistant:
              scheduledOrder.delivery?.hasAssistant === true ? 'true' : 'false',
            deliveryAddressFromStreet:
              scheduledOrder.delivery?.addressFrom?.street || '',
            deliveryAddressFromHouse:
              scheduledOrder.delivery?.addressFrom?.house || '',

            paymentMethod:
              scheduledOrder.payment?.method !== undefined
                ? scheduledOrder.payment.method + ''
                : '',
            paymentMethodData: scheduledOrder.payment?.methodData || '',

            customerComment: scheduledOrder.customerComment || '',
          });
        }
      });

    this.getItemError$ = this.store
      .select(ScheduledOrdersSelectors.selectGetScheduledOrderError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(ScheduledOrdersSelectors.selectGetScheduledOrderIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(ScheduledOrdersSelectors.selectUpdateScheduledOrderIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(ScheduledOrdersSelectors.selectUpdateScheduledOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateResultSnackbar = this.snackBar.open(
            'Обновлено',
            'Скрыть',
            {
              duration: 2000,
            }
          );

          this.store.dispatch(
            ScheduledOrdersActions.refreshUpdateScheduledOrderSucceed()
          );
        }
      });

    this.updateItemError$ = this.store
      .select(ScheduledOrdersSelectors.selectUpdateScheduledOrderError)
      .subscribe((error) => {
        if (error) {
          if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.updateResultSnackbar = this.snackBar.open(
                'Некорректный email',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('client')) {
              this.updateResultSnackbar = this.snackBar.open(
                'Ошибка. Клиент не найден',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            } else if (error.description.includes('locality')) {
              this.updateResultSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else {
            this.updateResultSnackbar = this.snackBar.open(
              'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(
          ScheduledOrdersActions.refreshUpdateScheduledOrderFailure()
        );
      });

    this.socket.get()?.on('scheduledOrders', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.item?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    this.store.dispatch(OffersActions.getOffersRequest());
    this.offers$ = this.store
      .select(OffersSelectors.selectOffers)
      .subscribe((offers) => {
        this.offers = offers;
        offers?.forEach((offer) => {
          if (offer.status === SimpleStatus.active) {
            this.offersOptions.push({ text: offer.name, value: offer._id });
          }
        });
      });
    this.socket.get()?.on('offers', () => {
      this.store.dispatch(OffersActions.getOffersRequest());
    });

    this.store.dispatch(ServicesActions.getServicesRequest());
    this.services$ = this.store
      .select(ServicesSelectors.selectServices)
      .subscribe((services) => {
        this.services = services;
      });
    this.socket.get()?.on('services', () => {
      this.store.dispatch(ServicesActions.getServicesRequest());
    });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('scheduledOrders');

    this.offers$?.unsubscribe?.();
    this.socket.get()?.off('offers');
    this.services$?.unsubscribe?.();
    this.socket.get()?.off('services');
  }
}
