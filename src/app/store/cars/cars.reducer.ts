import { Action, createReducer, on } from '@ngrx/store';

import * as CarsActions from './cars.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { ICar } from 'src/app/models/Car';

export const carsInitialState = {
  cars: null as ICar[] | null,

  getCarsIsFetching: false,
  getCarsError: null as ServerError | null,
  getCarsPagination: null as PaginationType | null,

  car: null as ICar | null,

  getCarIsFetching: false,
  getCarError: null as ServerError | null,

  updateCarIsFetching: false,
  updateCarError: null as ServerError | null,
  updateCarSucceed: false as boolean,

  addCarIsFetching: false,
  addCarError: null as ServerError | null,
  addCarSucceed: false as boolean,

  removeCarIsFetching: false,
  removeCarError: null as ServerError | null,
  removeCarSucceed: false as boolean,
};
export type CarsState = typeof carsInitialState;

const _carsReducer = createReducer(
  carsInitialState,

  /* ---------------- */
  /* --- Get Cars --- */
  /* ---------------- */

  on(CarsActions.getCarsRequest, (state, payload) => ({
    ...state,
    getCarsIsFetching: payload.withLoading,
    getCarsError: null,
  })),
  on(CarsActions.getCarsSuccess, (state, payload) => ({
    ...state,
    cars: payload.cars,
    getCarsIsFetching: false,
    getCarsError: null,
    getCarsPagination: payload.pagination,
  })),
  on(CarsActions.getCarsFailure, (state, payload) => ({
    ...state,
    getCarsIsFetching: false,
    getCarsError: payload.error,
  })),

  /* --------------- */
  /* --- Get Car --- */
  /* --------------- */

  on(CarsActions.getCarRequest, (state, payload) => ({
    ...state,
    car: null,
    getCarIsFetching: payload.withLoading,
    getCarError: null,
  })),
  on(CarsActions.getCarSuccess, (state, payload) => ({
    ...state,
    car: payload.car,
    getCarIsFetching: false,
    getCarError: null,
  })),
  on(CarsActions.getCarFailure, (state, payload) => ({
    ...state,
    getCarIsFetching: false,
    getCarError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Car --- */
  /* ----------------------- */

  on(CarsActions.updateCarRequest, (state) => ({
    ...state,
    updateCarIsFetching: true,
    updateCarError: null,
  })),
  on(CarsActions.updateCarSuccess, (state, payload) => ({
    ...state,
    car: payload.car,
    updateCarIsFetching: false,
    updateCarError: null,
    updateCarSucceed: true,
  })),
  on(CarsActions.updateCarFailure, (state, payload) => ({
    ...state,
    updateCarIsFetching: false,
    updateCarError: payload.error,
  })),
  on(CarsActions.refreshUpdateCarSucceed, (state) => ({
    ...state,
    updateCarSucceed: false,
  })),
  on(CarsActions.refreshUpdateCarFailure, (state) => ({
    ...state,
    updateCarError: null,
  })),

  /* --------------- */
  /* --- Add Car --- */
  /* --------------- */

  on(CarsActions.addCarRequest, (state) => ({
    ...state,
    addCarIsFetching: true,
    addCarError: null,
  })),
  on(CarsActions.addCarSuccess, (state) => ({
    ...state,
    addCarIsFetching: false,
    addCarError: null,
    addCarSucceed: true,
  })),
  on(CarsActions.addCarFailure, (state, payload) => ({
    ...state,
    addCarIsFetching: false,
    addCarError: payload.error,
  })),
  on(CarsActions.refreshAddCarSucceed, (state) => ({
    ...state,
    addCarSucceed: false,
  })),
  on(CarsActions.refreshAddCarFailure, (state) => ({
    ...state,
    addCarError: null,
  })),

  /* ------------------ */
  /* --- Remove Car --- */
  /* ------------------ */

  on(CarsActions.removeCarRequest, (state) => ({
    ...state,
    removeCarIsFetching: true,
    removeCarError: null,
  })),
  on(CarsActions.removeCarSuccess, (state) => ({
    ...state,
    removeCarIsFetching: false,
    removeCarError: null,
    removeCarSucceed: true,
  })),
  on(CarsActions.removeCarFailure, (state, payload) => ({
    ...state,
    removeCarIsFetching: false,
    removeCarError: payload.error,
  })),
  on(CarsActions.refreshRemoveCarSucceed, (state) => ({
    ...state,
    removeCarSucceed: false,
  })),
  on(CarsActions.refreshRemoveCarFailure, (state) => ({
    ...state,
    removeCarError: null,
  }))
);

export function carsReducer(
  state: CarsState | undefined,
  action: Action
): CarsState {
  return _carsReducer(state, action);
}
