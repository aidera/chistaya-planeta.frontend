import { createSelector } from '@ngrx/store';

import { State } from '../root.reducer';
import { EmployeesState } from './employees.reducer';

export const selectAll = (state: State) => state.employees;

export const selectEmployees = createSelector(
  selectAll,
  (state: EmployeesState) => state.employees
);

export const selectGetEmployeesIsFetching = createSelector(
  selectAll,
  (state: EmployeesState) => state.getEmployeesIsFetching
);

export const selectGetEmployeesPagination = createSelector(
  selectAll,
  (state: EmployeesState) => state.getEmployeesPagination
);

export const selectGetEmployeesError = createSelector(
  selectAll,
  (state: EmployeesState) => state.getEmployeesError
);

export const selectEmployee = createSelector(
  selectAll,
  (state: EmployeesState) => state.employee
);

export const selectGetEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeesState) => state.getEmployeeIsFetching
);

export const selectGetEmployeeError = createSelector(
  selectAll,
  (state: EmployeesState) => state.getEmployeeError
);

export const selectUpdateEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeesState) => state.updateEmployeeIsFetching
);

export const selectUpdateEmployeeError = createSelector(
  selectAll,
  (state: EmployeesState) => state.updateEmployeeError
);

export const selectUpdateEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeesState) => state.updateEmployeeSucceed
);

export const selectAddEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeesState) => state.addEmployeeIsFetching
);

export const selectAddEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeesState) => state.addEmployeeSucceed
);

export const selectAddEmployeeError = createSelector(
  selectAll,
  (state: EmployeesState) => state.addEmployeeError
);

export const selectRemoveEmployeeIsFetching = createSelector(
  selectAll,
  (state: EmployeesState) => state.removeEmployeeIsFetching
);

export const selectRemoveEmployeeSucceed = createSelector(
  selectAll,
  (state: EmployeesState) => state.removeEmployeeSucceed
);

export const selectRemoveEmployeeError = createSelector(
  selectAll,
  (state: EmployeesState) => state.removeEmployeeError
);
