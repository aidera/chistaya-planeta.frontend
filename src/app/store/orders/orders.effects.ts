import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as OrdersActions from './orders.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private ordersApi: OrdersApiService) {}

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.getOrdersRequest),
      switchMap((action) => {
        return this.ordersApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.orders) {
                return OrdersActions.getOrdersSuccess({
                  orders: resData.orders,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return OrdersActions.getOrdersFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.getOrdersFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.getOrderRequest),
      switchMap((action) => {
        return this.ordersApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.order) {
              return OrdersActions.getOrderSuccess({
                order: resData.order,
              });
            }
            return OrdersActions.getOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.getOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderStatusRequest),
      switchMap((action) => {
        return this.ordersApi.updateStatus(action.id, action.status).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateOrderCompanyComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderCompanyCommentRequest),
      switchMap((action) => {
        return this.ordersApi
          .updateCompanyComment(action.id, action.comment)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  updateOrderDeadline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.updateOrderDeadlineRequest),
      switchMap((action) => {
        return this.ordersApi.updateDeadline(action.id, action.deadline).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  setOrderDivision$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderDivisionRequest),
      switchMap((action) => {
        return this.ordersApi.setDivision(action.id, action.division).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderClientManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderClientManagerRequest),
      switchMap((action) => {
        return this.ordersApi
          .assignClientManager(action.id, action.manager)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  acceptOrderClientManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderClientManagerRequest),
      switchMap((action) => {
        return this.ordersApi.acceptClientManager(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderReceivingManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderReceivingManagerRequest),
      switchMap((action) => {
        return this.ordersApi
          .assignReceivingManager(action.id, action.manager)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  acceptOrderReceivingManager$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderReceivingManagerRequest),
      switchMap((action) => {
        return this.ordersApi.acceptReceivingManager(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  assignOrderDriver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.assignOrderDriverRequest),
      switchMap((action) => {
        return this.ordersApi.assignDriver(action.id, action.driver).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  acceptOrderDriver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.acceptOrderDriverRequest),
      switchMap((action) => {
        return this.ordersApi.acceptDriver(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  setOrderCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderCarRequest),
      switchMap((action) => {
        return this.ordersApi.setCar(action.id, action.car).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  setOrderClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderClientRequest),
      switchMap((action) => {
        return this.ordersApi.setClient(action.id, action.client).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  processOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.processOrderRequest),
      switchMap((action) => {
        return this.ordersApi
          .process({
            id: action.id,
            division: action.division,
            driver: action.driver,
            car: action.car,
            comment: action.comment,
            deadline: action.deadline,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  refuseOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.refuseOrderRequest),
      switchMap((action) => {
        return this.ordersApi
          .refuse({
            id: action.id,
            reason: action.reason,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  cancelOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.cancelOrderRequest),
      switchMap((action) => {
        return this.ordersApi
          .cancel({
            id: action.id,
            reason: action.reason,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedOrder) {
                return OrdersActions.updateOrderSuccess({
                  order: resData.updatedOrder,
                });
              }
              return OrdersActions.updateOrderFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                OrdersActions.updateOrderFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  setOrderInTransit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderInTransit),
      switchMap((action) => {
        return this.ordersApi.setInTransit(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  setOrderDelivered$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setOrderDelivered),
      switchMap((action) => {
        return this.ordersApi.setDelivered(action.id).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  weighOrderOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.weighOrderRequest),
      switchMap((action) => {
        let request: Observable<any>;

        if (action.services) {
          request = this.ordersApi.weighServices({
            id: action.id,
            services: action.services,
          });
        }

        if (action.offers) {
          request = this.ordersApi.weighOffers({
            id: action.id,
            offers: action.offers,
          });
        }

        return request.pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  completeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.completeOrderRequest),
      switchMap((action) => {
        return this.ordersApi.complete(action.id, action.finalSum).pipe(
          map((resData) => {
            if (resData && resData.updatedOrder) {
              return OrdersActions.updateOrderSuccess({
                order: resData.updatedOrder,
              });
            }
            return OrdersActions.updateOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.updateOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  addOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.addOrderRequest),
      switchMap((action) => {
        return this.ordersApi.add(action.order).pipe(
          map((resData) => {
            if (resData && resData.addedOrder) {
              return OrdersActions.addOrderSuccess({
                order: resData.addedOrder,
              });
            }
            return OrdersActions.addOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.addOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  removeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.removeOrderRequest),
      switchMap((action) => {
        return this.ordersApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedOrder) {
              return OrdersActions.removeOrderSuccess({
                order: resData.removedOrder,
              });
            }
            return OrdersActions.removeOrderFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              OrdersActions.removeOrderFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
