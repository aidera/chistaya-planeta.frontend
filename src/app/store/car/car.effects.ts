import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as CarAction from './car.actions';
import { CarService } from '../../services/api/car.service';

@Injectable()
export class CarEffects {
  constructor(private actions$: Actions, private carApi: CarService) {}

  getCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarAction.getCarsRequest),
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
                return CarAction.getCarsSuccess({
                  cars: resData.cars,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return CarAction.getCarsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarAction.getCarsFailure({
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
      ofType(CarAction.getCarRequest),
      switchMap((action) => {
        return this.carApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.car) {
              return CarAction.getCarSuccess({
                car: resData.car,
              });
            }
            return CarAction.getCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarAction.getCarFailure({
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
      ofType(CarAction.updateCarRequest),
      switchMap((action) => {
        return this.carApi
          .update(action.id, {
            status: action.status,
            drivers: action.drivers,
            isCorporate: action.isCorporate,
            type: action.carType,
            licensePlate: action.licensePlate,
            weight: action.weight,
            localityId: action.localityId,
            divisionIds: action.divisionIds,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.updatedCar) {
                return CarAction.updateCarSuccess({
                  car: resData.updatedCar,
                });
              }
              return CarAction.updateCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarAction.updateCarFailure({
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
      ofType(CarAction.addCarRequest),
      switchMap((action) => {
        return this.carApi
          .add({
            drivers: action.drivers,
            isCorporate: action.isCorporate,
            type: action.carType,
            licensePlate: action.licensePlate,
            weight: action.weight,
            localityId: action.localityId,
            divisionIds: action.divisionIds,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.addedCar) {
                return CarAction.addCarSuccess({
                  car: resData.addedCar,
                });
              }
              return CarAction.addCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarAction.addCarFailure({
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
      ofType(CarAction.removeCarRequest),
      switchMap((action) => {
        return this.carApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedCar) {
              return CarAction.removeCarSuccess({
                car: resData.removedCar,
              });
            }
            return CarAction.removeCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarAction.removeCarFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
