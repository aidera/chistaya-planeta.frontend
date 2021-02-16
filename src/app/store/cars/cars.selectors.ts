import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { CarsState } from './cars.reducer';

export const selectAll = (state: State) => state.cars;

export const selectCars = createSelector(
  selectAll,
  (state: CarsState) => state.cars
);

export const selectGetCarsIsFetching = createSelector(
  selectAll,
  (state: CarsState) => state.getCarsIsFetching
);

export const selectGetCarsPagination = createSelector(
  selectAll,
  (state: CarsState) => state.getCarsPagination
);

export const selectGetCarsError = createSelector(
  selectAll,
  (state: CarsState) => state.getCarsError
);

export const selectCar = createSelector(
  selectAll,
  (state: CarsState) => state.car
);

export const selectGetCarIsFetching = createSelector(
  selectAll,
  (state: CarsState) => state.getCarIsFetching
);

export const selectGetCarError = createSelector(
  selectAll,
  (state: CarsState) => state.getCarError
);

export const selectUpdateCarIsFetching = createSelector(
  selectAll,
  (state: CarsState) => state.updateCarIsFetching
);

export const selectUpdateCarError = createSelector(
  selectAll,
  (state: CarsState) => state.updateCarError
);

export const selectUpdateCarSucceed = createSelector(
  selectAll,
  (state: CarsState) => state.updateCarSucceed
);

export const selectAddCarIsFetching = createSelector(
  selectAll,
  (state: CarsState) => state.addCarIsFetching
);

export const selectAddCarSucceed = createSelector(
  selectAll,
  (state: CarsState) => state.addCarSucceed
);

export const selectAddCarError = createSelector(
  selectAll,
  (state: CarsState) => state.addCarError
);

export const selectRemoveCarIsFetching = createSelector(
  selectAll,
  (state: CarsState) => state.removeCarIsFetching
);

export const selectRemoveCarSucceed = createSelector(
  selectAll,
  (state: CarsState) => state.removeCarSucceed
);

export const selectRemoveCarError = createSelector(
  selectAll,
  (state: CarsState) => state.removeCarError
);
