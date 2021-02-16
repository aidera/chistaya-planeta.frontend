import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as CarsActions from './cars.actions';
import { CarsApiService } from '../../services/api/cars-api.service';

@Injectable()
export class CarsEffects {
  constructor(private actions$: Actions, private carsApi: CarsApiService) {}

  getCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarsActions.getCarsRequest),
      switchMap((action) => {
        return this.carsApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.cars) {
                return CarsActions.getCarsSuccess({
                  cars: resData.cars,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return CarsActions.getCarsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarsActions.getCarsFailure({
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
      ofType(CarsActions.getCarRequest),
      switchMap((action) => {
        return this.carsApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.car) {
              return CarsActions.getCarSuccess({
                car: resData.car,
              });
            }
            return CarsActions.getCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarsActions.getCarFailure({
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
      ofType(CarsActions.updateCarRequest),
      switchMap((action) => {
        return this.carsApi
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
                return CarsActions.updateCarSuccess({
                  car: resData.updatedCar,
                });
              }
              return CarsActions.updateCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarsActions.updateCarFailure({
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
      ofType(CarsActions.addCarRequest),
      switchMap((action) => {
        return this.carsApi
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
                return CarsActions.addCarSuccess({
                  car: resData.addedCar,
                });
              }
              return CarsActions.addCarFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                CarsActions.addCarFailure({
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
      ofType(CarsActions.removeCarRequest),
      switchMap((action) => {
        return this.carsApi.remove(action.id).pipe(
          map((resData) => {
            if (resData && resData.removedCar) {
              return CarsActions.removeCarSuccess({
                car: resData.removedCar,
              });
            }
            return CarsActions.removeCarFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              CarsActions.removeCarFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );
}
