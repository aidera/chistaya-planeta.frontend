import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { EmployeeState } from './employee.reducer';

export const selectAll = (state: State) => state.employee;

export const selectCars = createSelector(
  selectAll,
  (state: EmployeeState) => state.employees
);

export const selectGetCarsIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesIsFetching
);

export const selectGetCarsPagination = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesPagination
);

export const selectGetCarsError = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesError
);

export const selectCar = createSelector(
  selectAll,
  (state: EmployeeState) => state.employee
);

export const selectGetCarIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeeIsFetching
);

export const selectGetCarError = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeeError
);

export const selectUpdateCarIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeIsFetching
);

export const selectUpdateCarError = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeError
);

export const selectUpdateCarSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeSucceed
);

export const selectAddCarIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeIsFetching
);

export const selectAddCarSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeSucceed
);

export const selectAddCarError = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeError
);

export const selectRemoveCarIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeIsFetching
);

export const selectRemoveCarSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeSucceed
);

export const selectRemoveCarError = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeError
);
