import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as CarActions from './car.actions';
import { CarService } from '../../services/api/car.service';

@Injectable()
export class CarEffects {
  constructor(private actions$: Actions, private carApi: CarService) {}

  getCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.getCarsRequest),
      switchMap((action) => {
        return this.carApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.cars) {
                return CarActions.getCarsSuccess({
                  cars: resData.cars,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return CarActions.getCarsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarActions.getCarsFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.getCarRequest),
      switchMap((action) => {
        return this.carApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.car) {
              return CarActions.getCarSuccess({
                car: resData.car,
              });
            }
            return CarActions.getCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarActions.getCarFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.updateCarRequest),
      switchMap((action) => {
        return this.carApi
          .update(action.id, {
            status: action.status,
            drivers: action.drivers,
            isCorporate: action.isCorporate,
            type: action.carType,
            licensePlate: action.licensePlate,
            weight: action.weight,
            locality: action.locality,
            divisions: action.divisions,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedCar) {
                return CarActions.updateCarSuccess({
                  car: resData.updatedCar,
                });
              }
              return CarActions.updateCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarActions.updateCarFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  addCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.addCarRequest),
      switchMap((action) => {
        return this.carApi
          .add({
            drivers: action.drivers,
            isCorporate: action.isCorporate,
            type: action.carType,
            licensePlate: action.licensePlate,
            weight: action.weight,
            locality: action.locality,
            divisions: action.divisions,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedCar) {
                return CarActions.addCarSuccess({
                  car: resData.addedCar,
                });
              }
              return CarActions.addCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarActions.addCarFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  removeCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.removeCarRequest),
      switchMap((action) => {
        return this.carApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedCar) {
              return CarActions.removeCarSuccess({
                car: resData.removedCar,
              });
            }
            return CarActions.removeCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarActions.removeCarFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
