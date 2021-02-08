import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { CarState } from './car.reducer';

export const selectAll = (state: State) => state.car;

export const selectCars = createSelector(
  selectAll,
  (state: CarState) => state.cars
);

export const selectGetCarsIsFetching = createSelector(
  selectAll,
  (state: CarState) => state.getCarsIsFetching
);

export const selectGetCarsPagination = createSelector(
  selectAll,
  (state: CarState) => state.getCarsPagination
);

export const selectGetCarsError = createSelector(
  selectAll,
  (state: CarState) => state.getCarsError
);

export const selectCar = createSelector(
  selectAll,
  (state: CarState) => state.car
);

export const selectGetCarIsFetching = createSelector(
  selectAll,
  (state: CarState) => state.getCarIsFetching
);

export const selectGetCarError = createSelector(
  selectAll,
  (state: CarState) => state.getCarError
);

export const selectUpdateCarIsFetching = createSelector(
  selectAll,
  (state: CarState) => state.updateCarIsFetching
);

export const selectUpdateCarError = createSelector(
  selectAll,
  (state: CarState) => state.updateCarError
);

export const selectUpdateCarSucceed = createSelector(
  selectAll,
  (state: CarState) => state.updateCarSucceed
);

export const selectAddCarIsFetching = createSelector(
  selectAll,
  (state: CarState) => state.addCarIsFetching
);

export const selectAddCarSucceed = createSelector(
  selectAll,
  (state: CarState) => state.addCarSucceed
);

export const selectAddCarError = createSelector(
  selectAll,
  (state: CarState) => state.addCarError
);

export const selectRemoveCarIsFetching = createSelector(
  selectAll,
  (state: CarState) => state.removeCarIsFetching
);

export const selectRemoveCarSucceed = createSelector(
  selectAll,
  (state: CarState) => state.removeCarSucceed
);

export const selectRemoveCarError = createSelector(
  selectAll,
  (state: CarState) => state.removeCarError
);
