import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { EmployeeState } from './employee.reducer';

export const selectAll = (state: State) => state.employee;

export const selectEmployees = createSelector(
  selectAll,
  (state: EmployeeState) => state.employees
);

export const selectGetEmployeesIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesIsFetching
);

export const selectGetEmployeesPagination = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesPagination
);

export const selectGetEmployeesError = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeesError
);

export const selectEmployee = createSelector(
  selectAll,
  (state: EmployeeState) => state.employee
);

export const selectGetEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeeIsFetching
);

export const selectGetEmployeeError = createSelector(
  selectAll,
  (state: EmployeeState) => state.getEmployeeError
);

export const selectUpdateEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeIsFetching
);

export const selectUpdateEmployeeError = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeError
);

export const selectUpdateEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.updateEmployeeSucceed
);

export const selectAddEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeIsFetching
);

export const selectAddEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeSucceed
);

export const selectAddEmployeeError = createSelector(
  selectAll,
  (state: EmployeeState) => state.addEmployeeError
);

export const selectRemoveEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeIsFetching
);

export const selectRemoveEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeSucceed
);

export const selectRemoveEmployeeError = createSelector(
  selectAll,
  (state: EmployeeState) => state.removeEmployeeError
);
