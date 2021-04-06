import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as OrdersActions from '../../../../store/orders/orders.actions';
import * as OrdersSelectors from '../../../../store/orders/orders.selectors';
import * as OffersActions from '../../../../store/offers/offers.actions';
import * as OffersSelectors from '../../../../store/offers/offers.selectors';
import * as ServicesActions from '../../../../store/services/services.actions';
import * as ServicesSelectors from '../../../../store/services/services.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { IEmployee } from '../../../../models/Employee';
import { OptionType } from '../../../../models/types/OptionType';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { CarStatus } from '../../../../models/enums/CarStatus';
import { responseCodes } from '../../../../data/responseCodes';
import { ILocality } from '../../../../models/Locality';
import { IDivision } from '../../../../models/Division';
import { ICar } from '../../../../models/Car';
import { IOrder } from '../../../../models/Order';
import {
  orderStatusColors,
  orderStatusStrings,
} from '../../../../data/orderStatusData';
import { orderTypeStrings } from '../../../../data/orderTypeData';
import { OrderType } from '../../../../models/enums/OrderType';
import { ItemFieldListElement } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { IOffer } from '../../../../models/Offer';
import { DeliveryType } from '../../../../models/enums/DeliveryType';
import { deliveryTypeStrings } from '../../../../data/deliveryTypeData';
import { paymentMethodStrings } from '../../../../data/paymentMethodData';
import { unitStrings } from '../../../../data/unitOptions';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { OrderStatus } from '../../../../models/enums/OrderStatus';
import { tomorrow } from '../../../../utils/date.functions';
import { ModalAction } from '../../../../components/modal/modal.component';
import { timeOptions } from '../../../../data/timeOptions';
import { EmployeeStatus } from '../../../../models/enums/EmployeeStatus';
import { IService } from '../../../../models/Service';
import { IClient } from '../../../../models/Client';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { OptionsService } from '../../../../services/options/options.service';
import { GettersService } from '../../../../services/getters/getters.service';
import { OrdersApiService } from '../../../../services/api/orders-api.service';
import { ClientsApiService } from '../../../../services/api/clients-api.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public item: IOrder;

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
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public clientManagersOptions$: Subscription;
  public clientManagersOptions: OptionType[] = [];
  public driversOptions$: Subscription;
  public driversOptions: OptionType[] = [];
  public receivingManagersOptions$: Subscription;
  public receivingManagersOptions: OptionType[] = [];
  public carsOptions$: Subscription;
  public carsOptions: OptionType[] = [];
  //
  public processFormDivisionsOptions$: Subscription;
  public processFormDivisionsOptions: OptionType[] = [];
  public processFormDriversOptions$: Subscription;
  public processFormDriversOptions: OptionType[] = [];
  public processFormCarsOptions$: Subscription;
  public processFormCarsOptions: OptionType[] = [];

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public processForm: FormGroup;
  public isProcessFormModalOpen = false;
  public deadlineMinDate = tomorrow;
  public timeOptions = timeOptions;
  //
  public refuseForm: FormGroup;
  public isRefuseFormModalOpen = false;
  //
  public completeForm: FormGroup;
  public isCompleteFormModalOpen = false;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public orderStatusColors = orderStatusColors;
  public orderStatusStrings = orderStatusStrings;
  public orderTypeStrings = orderTypeStrings;
  public deliveryTypeStrings = deliveryTypeStrings;
  public paymentMethodStrings = paymentMethodStrings;
  public unitStrings = unitStrings;
  public orderType = OrderType;
  public orderStatus = OrderStatus;
  public deliveryType = DeliveryType;

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
    private ordersApi: OrdersApiService,
    private clientsApi: ClientsApiService,
    public getters: GettersService
  ) {
    super(store, router, route);

    title.setTitle('Заявка - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initDivisionsOptions();
    this.options.initEmployeesOptions();
    this.options.initCarsOptions();

    /* ------------- */
    /* Form settings */
    /* ------------- */

    /* --- Main form --- */
    this.initForm = () => {
      this.form = new FormGroup({
        client: new FormControl(''),
        status: new FormControl('', Validators.required),
        companyComment: new FormControl(''),
        division: new FormControl(''),
        clientManager: new FormControl(''),
        receivingManager: new FormControl(''),
        driver: new FormControl(''),
        car: new FormControl(''),
        deadlineDate: new FormControl('', Validators.required),
        deadlineTime: new FormControl('', Validators.required),
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

    /* --- Process form --- */
    this.processForm = new FormGroup({
      division: new FormControl(''),
      driver: new FormControl(''),
      car: new FormControl(''),
      deadlineDate: new FormControl(''),
      deadlineTime: new FormControl(''),
      comment: new FormControl(''),
    });

    this.processForm.get('division').valueChanges.subscribe((fieldValue) => {
      /* Process Drivers */
      this.processFormDriversOptions$?.unsubscribe();
      this.processFormDriversOptions$ = this.options
        .getEmployeesOptions({
          statuses: [EmployeeStatus.active],
          roles: [EmployeeRole.driver],
          divisionsIds: [fieldValue],
        })
        .subscribe((value) => {
          this.processFormDriversOptions = value;
        });
    });

    this.processForm.get('driver').valueChanges.subscribe((fieldValue) => {
      /* Process Cars */
      this.processFormCarsOptions$?.unsubscribe();
      this.processFormCarsOptions$ = this.options
        .getCarsOptions({
          statuses: [CarStatus.active],
          driversIds: [fieldValue],
        })
        .subscribe((value) => {
          this.processFormCarsOptions = value;
        });
    });

    /* --- Refuse/cancel form --- */
    this.refuseForm = new FormGroup({
      reason: new FormControl(''),
    });

    /* --- Complete form --- */
    this.completeForm = new FormGroup({
      finalSum: new FormControl('', Validators.required),
    });

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        OrdersActions.getOrderRequest({ id: this.itemId, withLoading })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */

    this.item$ = this.store
      .select(OrdersSelectors.selectOrder)
      .subscribe((order) => {
        this.item = order;

        this.initForm();

        this.refreshProcessForm();

        if (this.form && order) {
          let deadlineDate;
          let deadlineHours;
          let deadlineMinutes;
          if (this.item.deadline) {
            deadlineDate = new Date(Date.parse(this.item.deadline));
            deadlineHours = deadlineDate.getHours();
            deadlineMinutes = deadlineDate.getMinutes() || '00';
          }

          this.form.setValue({
            status: order.status || '',
            client: (order.client as IClient)?._id || '',
            companyComment: order.companyComment || '',
            division: (order.division as IDivision)?._id || '',
            clientManager:
              (order.performers.clientManager as IEmployee)?._id || '',
            receivingManager:
              (order.performers.receivingManager as IEmployee)?._id || '',
            driver: (order.performers.driver as IEmployee)?._id || '',
            car: (order.performers.car as ICar)?._id || '',
            deadlineDate: deadlineDate !== undefined ? deadlineDate : '',
            deadlineTime:
              deadlineHours !== undefined
                ? deadlineHours + ':' + deadlineMinutes
                : '',
          });
        }

        if (this.completeForm && order) {
          this.completeForm.setValue({
            finalSum: order.weighed.paymentAmount || '',
          });
        }

        /* ----------------------------------- */
        /* Options requests in item connection */
        /* ----------------------------------- */

        /* Divisions */
        this.divisionsOptions$?.unsubscribe();
        this.divisionsOptions$ = this.options
          .getDivisionsOptions({
            statuses: [SimpleStatus.active],
            localitiesIds: (order?.locality as ILocality)?._id
              ? [(order?.locality as ILocality)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.divisionsOptions = value;
          });

        /* Client Managers */
        this.clientManagersOptions$?.unsubscribe();
        this.clientManagersOptions$ = this.options
          .getEmployeesOptions({
            statuses: [EmployeeStatus.active],
            roles: [EmployeeRole.clientManager],
            localitiesIds: (order?.locality as ILocality)?._id
              ? [(order?.locality as ILocality)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.clientManagersOptions = value;
          });

        /* Receiving Managers */
        this.driversOptions$?.unsubscribe();
        this.driversOptions$ = this.options
          .getEmployeesOptions({
            statuses: [EmployeeStatus.active],
            roles: [EmployeeRole.driver],
            divisionsIds: (order?.division as IDivision)?._id
              ? [(order?.division as IDivision)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.driversOptions = value;
          });

        /* Receiving Managers */
        this.receivingManagersOptions$?.unsubscribe();
        this.receivingManagersOptions$ = this.options
          .getEmployeesOptions({
            statuses: [EmployeeStatus.active],
            roles: [EmployeeRole.receivingManager],
            divisionsIds: (order?.division as IDivision)?._id
              ? [(order?.division as IDivision)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.receivingManagersOptions = value;
          });

        /* Cars */
        this.carsOptions$?.unsubscribe();
        this.carsOptions$ = this.options
          .getCarsOptions({
            statuses: [CarStatus.active, CarStatus.temporaryUnavailable],
            divisionsIds: (order?.division as IDivision)?._id
              ? [(order?.division as IDivision)?._id]
              : undefined,
            driversIds: (order?.performers?.driver as IEmployee)?._id
              ? [(order?.performers.driver as IEmployee)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.carsOptions = value;
          });

        /* Process Divisions */
        this.processFormDivisionsOptions$?.unsubscribe();
        this.processFormDivisionsOptions$ = this.options
          .getDivisionsOptions({
            useAddress: true,
            statuses: [SimpleStatus.active],
            localitiesIds: (order?.locality as ILocality)?._id
              ? [(order?.locality as ILocality)?._id]
              : undefined,
          })
          .subscribe((value) => {
            this.processFormDivisionsOptions = value;
          });
      });

    this.getItemError$ = this.store
      .select(OrdersSelectors.selectGetOrderError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(OrdersSelectors.selectGetOrderIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(OrdersSelectors.selectUpdateOrderIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(OrdersSelectors.selectUpdateOrderSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;
          this.isProcessFormModalOpen = false;
          this.isRefuseFormModalOpen = false;
          this.isCompleteFormModalOpen = false;

          this.updateResultSnackbar = this.snackBar.open(
            'Обновлено',
            'Скрыть',
            {
              duration: 2000,
            }
          );

          this.store.dispatch(OrdersActions.refreshUpdateOrderSucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(OrdersSelectors.selectUpdateOrderError)
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
            if (error.description.includes('division')) {
              this.updateResultSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно былы удалёно',
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

        this.store.dispatch(OrdersActions.refreshUpdateOrderFailure());
      });

    this.socket.get()?.on('orders', (data) => {
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

    /* --------------- */
    /* After user init */
    /* --------------- */
    this.userInitCallback = () => {
      this.refreshProcessForm();
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('orders');

    this.offers$?.unsubscribe?.();
    this.socket.get()?.off('offers');
    this.services$?.unsubscribe?.();
    this.socket.get()?.off('services');

    this.divisionsOptions$?.unsubscribe?.();
    this.clientManagersOptions$?.unsubscribe?.();
    this.driversOptions$?.unsubscribe?.();
    this.receivingManagersOptions$?.unsubscribe?.();
    this.carsOptions$?.unsubscribe?.();

    this.processFormDivisionsOptions$?.unsubscribe?.();
    this.processFormDriversOptions$?.unsubscribe?.();
    this.processFormCarsOptions$?.unsubscribe?.();

    this.options.destroyDivisionsOptions();
    this.options.destroyEmployeesOptions();
    this.options.destroyCarsOptions();
  }

  public getServicesAmount(): string | undefined {
    if (this.item?.services) {
      const unit = unitStrings[this.item?.services?.amountUnit];
      return this.item.services.amount + ' ' + unit;
    }
    return undefined;
  }

  public getOffersList(): ItemFieldListElement[] {
    if (this.item?.offers?.items) {
      return (this.item.offers.items as IOffer[]).map((offer) => {
        return {
          text: offer.name,
          color: offer.status === SimpleStatus.inactive ? 'red' : undefined,
        };
      });
    }
    return [];
  }

  public takeToWork(): void {
    if (this.userEmployee?.role === EmployeeRole.clientManager) {
      this.store.dispatch(
        OrdersActions.acceptOrderClientManagerRequest({ id: this.item._id })
      );
    }

    if (this.userEmployee?.role === EmployeeRole.driver) {
      this.store.dispatch(
        OrdersActions.acceptOrderDriverRequest({ id: this.item._id })
      );
    }

    if (this.userEmployee?.role === EmployeeRole.receivingManager) {
      this.store.dispatch(
        OrdersActions.acceptOrderReceivingManagerRequest({ id: this.item._id })
      );
    }
  }

  private refreshProcessForm(): void {
    if (this.item) {
      let deadlineDate;
      let deadlineHours;
      let deadlineMinutes;
      if (this.item.deadline) {
        deadlineDate = new Date(Date.parse(this.item.deadline));
        deadlineHours = deadlineDate.getHours();
        deadlineMinutes = deadlineDate.getMinutes() || '00';
      }

      this.processForm.setValue({
        division: (this.item.division as IDivision)?._id || '',
        driver: '',
        car: '',
        deadlineDate: deadlineDate !== undefined ? deadlineDate : '',
        deadlineTime:
          deadlineHours !== undefined
            ? deadlineHours + ':' + deadlineMinutes
            : '',
        comment: '',
      });

      if (
        (this.item.type === OrderType.offer &&
          this.item.delivery._type === DeliveryType.company) ||
        this.item.type === OrderType.service
      ) {
        this.processForm.get('division').setValidators([Validators.required]);
        this.processForm.get('driver').setValidators([Validators.required]);
        this.processForm.get('car').setValidators([Validators.required]);
        this.processForm
          .get('deadlineDate')
          .setValidators([Validators.required]);
        this.processForm
          .get('deadlineTime')
          .setValidators([Validators.required]);
      } else {
        this.processForm.get('division').clearValidators();
        this.processForm.get('driver').clearValidators();
        this.processForm.get('car').clearValidators();
        this.processForm.get('deadlineDate').clearValidators();
        this.processForm.get('deadlineTime').clearValidators();
      }
    }
  }

  public onProcessOrderModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isProcessFormModalOpen = false;
        break;
      case 'reject':
        this.isProcessFormModalOpen = false;
        break;
      case 'resolve':
        this.processOrder();
        break;
    }
  }

  public processOrder(): void {
    Object.keys(this.processForm?.controls).forEach((field) => {
      const control = this.processForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.processForm.valid) {
      if (
        (this.item?.type === OrderType.offer &&
          this.item?.delivery._type === DeliveryType.company) ||
        this.item?.type === OrderType.service
      ) {
        const deadlineDate = new Date(
          this.processForm.get('deadlineDate').value
        );
        const deadlineTime = this.processForm.get('deadlineTime').value;
        const deadlineHours = deadlineTime.split(':')[0];
        const deadlineMinutes = deadlineTime.split(':')[1];

        const deadline = deadlineDate;
        deadline.setHours(deadlineHours, deadlineMinutes);

        this.store.dispatch(
          OrdersActions.processOrderRequest({
            id: this.item._id,
            deadline,
            division: this.processForm?.get('division').value,
            driver: this.processForm?.get('driver').value,
            car: this.processForm?.get('car').value,
            comment: this.processForm?.get('comment').value,
          })
        );
      } else {
        this.store.dispatch(
          OrdersActions.processOrderRequest({
            id: this.item._id,
            comment: this.processForm?.get('comment').value,
          })
        );
      }
    }
  }

  public onRefuseOrderModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isRefuseFormModalOpen = false;
        break;
      case 'reject':
        this.isRefuseFormModalOpen = false;
        break;
      case 'resolve':
        this.refuseOrder();
        break;
    }
  }

  public refuseOrder(): void {
    Object.keys(this.refuseForm?.controls).forEach((field) => {
      const control = this.refuseForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.refuseForm.valid) {
      if (this.userEmployee) {
        this.store.dispatch(
          OrdersActions.cancelOrderRequest({
            id: this.item._id,
            reason: this.refuseForm?.get('reason').value,
          })
        );
      }
      if (this.userClient) {
        this.store.dispatch(
          OrdersActions.refuseOrderRequest({
            id: this.item._id,
            reason: this.refuseForm?.get('reason').value,
          })
        );
      }
    }
  }

  public goToWeighPage(): void {
    if (this.item) {
      this.router.navigate(['../', 'weigh', this.item._id], {
        relativeTo: this.route,
      });
    }
  }

  public onCompleteOrderModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isCompleteFormModalOpen = false;
        break;
      case 'reject':
        this.isCompleteFormModalOpen = false;
        break;
      case 'resolve':
        this.completeOrder();
        break;
    }
  }

  public completeOrder(): void {
    Object.keys(this.completeForm?.controls).forEach((field) => {
      const control = this.completeForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.completeForm.valid) {
      if (this.userEmployee) {
        this.store.dispatch(
          OrdersActions.completeOrderRequest({
            id: this.item._id,
            finalSum: +this.completeForm.get('finalSum').value,
          })
        );
      }
    }
  }

  public setOrderInTransit(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.setOrderInTransit({
          id: this.item._id,
        })
      );
    }
  }

  public setOrderDelivered(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.setOrderDelivered({
          id: this.item._id,
        })
      );
    }
  }

  public updateCompanyComment(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.updateOrderCompanyCommentRequest({
          id: this.item._id,
          comment: this.form.get('companyComment').value,
        })
      );
    }
  }

  public setOrderDivision(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.setOrderDivisionRequest({
          id: this.item._id,
          division: this.form.get('division').value,
        })
      );
    }
  }

  public setClientManager(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.assignOrderClientManagerRequest({
          id: this.item._id,
          manager: this.form.get('clientManager').value,
        })
      );
    }
  }

  public setReceivingManager(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.assignOrderReceivingManagerRequest({
          id: this.item._id,
          manager: this.form.get('receivingManager').value,
        })
      );
    }
  }

  public setDriver(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.assignOrderDriverRequest({
          id: this.item._id,
          driver: this.form.get('driver').value,
        })
      );
    }
  }

  public setCar(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.setOrderCarRequest({
          id: this.item._id,
          car: this.form.get('car').value,
        })
      );
    }
  }

  public setClient(): void {
    if (this.userEmployee) {
      this.store.dispatch(
        OrdersActions.setOrderClientRequest({
          id: this.item._id,
          client: this.form.get('client').value,
        })
      );
    }
  }

  public updateDeadline(): void {
    if (this.userEmployee) {
      const deadlineDate = new Date(this.form.get('deadlineDate').value);
      const deadlineTime = this.form.get('deadlineTime').value;
      const deadlineHours = deadlineTime.split(':')[0];
      const deadlineMinutes = deadlineTime.split(':')[1];

      const deadline = deadlineDate;
      deadline.setHours(deadlineHours, deadlineMinutes);

      this.store.dispatch(
        OrdersActions.updateOrderDeadlineRequest({
          id: this.item._id,
          deadline,
        })
      );
    }
  }
}
