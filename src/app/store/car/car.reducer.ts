import { Action, createReducer, on } from '@ngrx/store';

import * as CarActions from './car.actions';
import { ServerError } from '../../models/ServerResponse';
import { PaginationType } from '../../models/types/PaginationType';
import { ICar } from 'src/app/models/Car';

export const carInitialState = {
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
export type CarState = typeof carInitialState;

const _carReducer = createReducer(
  carInitialState,

  /* ---------------- */
  /* --- Get Cars --- */
  /* ---------------- */

  on(CarActions.getCarsRequest, (state, payload) => ({
    ...state,
    getCarsIsFetching: payload.withLoading,
    getCarsError: null,
  })),
  on(CarActions.getCarsSuccess, (state, payload) => ({
    ...state,
    cars: payload.cars,
    getCarsIsFetching: false,
    getCarsError: null,
    getCarsPagination: payload.pagination,
  })),
  on(CarActions.getCarsFailure, (state, payload) => ({
    ...state,
    getCarsIsFetching: false,
    getCarsError: payload.error,
  })),

  /* --------------- */
  /* --- Get Car --- */
  /* --------------- */

  on(CarActions.getCarRequest, (state, payload) => ({
    ...state,
    car: null,
    getCarIsFetching: payload.withLoading,
    getCarError: null,
  })),
  on(CarActions.getCarSuccess, (state, payload) => ({
    ...state,
    car: payload.car,
    getCarIsFetching: false,
    getCarError: null,
  })),
  on(CarActions.getCarFailure, (state, payload) => ({
    ...state,
    getCarIsFetching: false,
    getCarError: payload.error,
  })),

  /* ----------------------- */
  /* --- Update Car --- */
  /* ----------------------- */

  on(CarActions.updateCarRequest, (state) => ({
    ...state,
    updateCarIsFetching: true,
    updateCarError: null,
  })),
  on(CarActions.updateCarSuccess, (state, payload) => ({
    ...state,
    car: payload.car,
    updateCarIsFetching: false,
    updateCarError: null,
    updateCarSucceed: true,
  })),
  on(CarActions.updateCarFailure, (state, payload) => ({
    ...state,
    updateCarIsFetching: false,
    updateCarError: payload.error,
  })),
  on(CarActions.refreshUpdateCarSucceed, (state) => ({
    ...state,
    updateCarSucceed: false,
  })),
  on(CarActions.refreshUpdateCarFailure, (state) => ({
    ...state,
    updateCarError: null,
  })),

  /* --------------- */
  /* --- Add Car --- */
  /* --------------- */

  on(CarActions.addCarRequest, (state) => ({
    ...state,
    addCarIsFetching: true,
    addCarError: null,
  })),
  on(CarActions.addCarSuccess, (state) => ({
    ...state,
    addCarIsFetching: false,
    addCarError: null,
    addCarSucceed: true,
  })),
  on(CarActions.addCarFailure, (state, payload) => ({
    ...state,
    addCarIsFetching: false,
    addCarError: payload.error,
  })),
  on(CarActions.refreshAddCarSucceed, (state) => ({
    ...state,
    addCarSucceed: false,
  })),
  on(CarActions.refreshAddCarFailure, (state) => ({
    ...state,
    addCarError: null,
  })),

  /* ------------------ */
  /* --- Remove Car --- */
  /* ------------------ */

  on(CarActions.removeCarRequest, (state) => ({
    ...state,
    removeCarIsFetching: true,
    removeCarError: null,
  })),
  on(CarActions.removeCarSuccess, (state) => ({
    ...state,
    removeCarIsFetching: false,
    removeCarError: null,
    removeCarSucceed: true,
  })),
  on(CarActions.removeCarFailure, (state, payload) => ({
    ...state,
    removeCarIsFetching: false,
    removeCarError: payload.error,
  })),
  on(CarActions.refreshRemoveCarSucceed, (state) => ({
    ...state,
    removeCarSucceed: false,
  })),
  on(CarActions.refreshRemoveCarFailure, (state) => ({
    ...state,
    removeCarError: null,
  }))
);

export function carReducer(
  state: CarState | undefined,
  action: Action
): CarState {
  return _carReducer(state, action);
}
