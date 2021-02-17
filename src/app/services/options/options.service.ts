import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromRoot from '../../store/root.reducer';
import * as AppActions from '../../store/app/app.actions';
import * as AppSelectors from '../../store/app/app.selectors';
import { OptionType } from '../../models/types/OptionType';
import SimpleStatus from '../../models/enums/SimpleStatus';
import CarStatus from '../../models/enums/CarStatus';
import EmployeeRole from '../../models/enums/EmployeeRole';
import EmployeeStatus from '../../models/enums/EmployeeStatus';
import { SocketIoService } from '../socket-io/socket-io.service';
import { ConverterService } from '../converter/converter.service';
import { LocalitiesApiService } from '../api/localities-api.service';
import { DivisionsApiService } from '../api/divisions-api.service';
import { CarsApiService } from '../api/cars-api.service';
import { EmployeesApiService } from '../api/employees-api.service';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(
    protected store: Store<fromRoot.State>,
    protected socket: SocketIoService,
    protected converter: ConverterService,
    protected localitiesApi: LocalitiesApiService,
    protected divisionsApi: DivisionsApiService,
    protected carsApi: CarsApiService,
    protected employeesApi: EmployeesApiService
  ) {}

  /* ---------- */
  /* Localities */
  /* ---------- */

  public initLocalitiesOptions(): void {
    this.store.dispatch(AppActions.getLocalitiesToSelectRequest());

    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });
  }

  public getLocalitiesOptions({
    statuses,
  }: {
    statuses?: SimpleStatus[];
  }): Observable<OptionType[] | null> {
    return this.store.select(AppSelectors.selectLocalitiesToSelect).pipe(
      map((value) => {
        if (value === null) {
          return null;
        }

        const localitiesOptions = [];
        let localitiesToSelect = value;

        if (localitiesToSelect) {
          if (statuses !== undefined) {
            localitiesToSelect = localitiesToSelect.filter((el) => {
              return statuses.includes(el.status);
            });
          }

          localitiesToSelect?.forEach((el) => {
            localitiesOptions.push({ text: el.name, value: el._id });
          });
        }

        return localitiesOptions;
      })
    );
  }

  public destroyLocalitiesOptions(): void {
    this.socket?.get()?.off('localities');
  }

  /* ---------- */
  /* Divisions */

  /* ---------- */

  public initDivisionsOptions(): void {
    this.store.dispatch(AppActions.getDivisionsToSelectRequest());

    this.socket.get()?.on('divisions', (_) => {
      this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    });
  }

  public getDivisionsOptions({
    localitiesIds,
    statuses,
  }: {
    localitiesIds?: string[];
    statuses?: SimpleStatus[];
  }): Observable<OptionType[] | null> {
    return this.store.select(AppSelectors.selectDivisionsToSelect).pipe(
      map((value) => {
        if (value === null) {
          return null;
        }

        const divisionsOptions = [];
        let divisionsToSelect = value;

        if (localitiesIds !== undefined) {
          divisionsToSelect = divisionsToSelect?.filter((el) => {
            return localitiesIds.includes(el.locality);
          });
        }

        if (statuses !== undefined) {
          divisionsToSelect = divisionsToSelect?.filter((el) => {
            return statuses.includes(el.status);
          });
        }

        divisionsToSelect?.forEach((el) => {
          divisionsOptions.push({ text: el.name, value: el._id });
        });

        return divisionsOptions;
      })
    );
  }

  public destroyDivisionsOptions(): void {
    this.socket?.get()?.off('divisions');
  }

  /* ---- */
  /* Cars */

  /* ---- */

  public initCarsOptions(): void {
    this.store.dispatch(AppActions.getCarsToSelectRequest());

    this.socket.get()?.on('cars', (_) => {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    });
  }

  public getCarsOptions({
    localitiesIds,
    divisionsIds,
    statuses,
  }: {
    localitiesIds?: string[];
    divisionsIds?: string[];
    statuses?: CarStatus[];
  }): Observable<OptionType[] | null> {
    return this.store.select(AppSelectors.selectCarsToSelect).pipe(
      map((value) => {
        if (value === null) {
          return null;
        }

        const carsOptions = [];
        let carsToSelect = value;

        if (localitiesIds !== undefined) {
          carsToSelect = carsToSelect?.filter((el) => {
            return localitiesIds.includes(el.locality);
          });
        }

        if (divisionsIds !== undefined) {
          carsToSelect = carsToSelect?.filter((el) => {
            return divisionsIds.some((ai) => el.divisions.includes(ai));
          });
        }

        if (statuses !== undefined) {
          carsToSelect = carsToSelect?.filter((el) => {
            return statuses.includes(el.status);
          });
        }

        carsToSelect?.forEach((el) => {
          carsOptions.push({ text: el.licensePlate, value: el._id });
        });

        return carsOptions;
      })
    );
  }

  public destroyCarsOptions(): void {
    this.socket?.get()?.off('cars');
  }

  /* --------- */
  /* Employees */
  /* --------- */

  public initEmployeesOptions(): void {
    this.store.dispatch(AppActions.getEmployeesToSelectRequest());

    this.socket.get()?.on('employees', (_) => {
      this.store.dispatch(AppActions.getEmployeesToSelectRequest());
    });
  }

  public getEmployeesOptions({
    localitiesIds,
    divisionsIds,
    statuses,
    roles,
  }: {
    localitiesIds?: string[];
    divisionsIds?: string[];
    statuses?: EmployeeStatus[];
    roles?: EmployeeRole[];
  }): Observable<OptionType[] | null> {
    return this.store.select(AppSelectors.selectEmployeesToSelect).pipe(
      map((value) => {
        if (value === null) {
          return null;
        }

        const employeesOptions = [];
        let employeesToSelect = value;

        if (localitiesIds !== undefined) {
          employeesToSelect = employeesToSelect?.filter((el) => {
            return localitiesIds.includes(el.locality);
          });
        }

        if (divisionsIds !== undefined) {
          employeesToSelect = employeesToSelect?.filter((el) => {
            return divisionsIds.includes(el.division);
          });
        }

        if (statuses !== undefined) {
          employeesToSelect = employeesToSelect?.filter((el) => {
            return statuses.includes(el.status);
          });
        }

        if (roles !== undefined) {
          employeesToSelect = employeesToSelect?.filter((el) => {
            return roles.includes(el.role);
          });
        }

        employeesToSelect?.forEach((el) => {
          employeesOptions.push({
            text: this.converter.getUserInitials(
              el.name,
              el.surname,
              el.patronymic
            ),
            value: el._id,
          });
        });

        return employeesOptions;
      })
    );
  }

  public destroyEmployeesOptions(): void {
    this.socket?.get()?.off('employees');
  }
}