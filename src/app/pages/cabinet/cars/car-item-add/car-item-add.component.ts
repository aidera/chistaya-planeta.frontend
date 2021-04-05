import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as CarsActions from '../../../../store/cars/cars.actions';
import * as CarsSelectors from '../../../../store/cars/cars.selectors';
import { EmployeeRole } from '../../../../models/enums/EmployeeRole';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { EmployeeStatus } from '../../../../models/enums/EmployeeStatus';
import { OptionType } from '../../../../models/types/OptionType';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { carTypeOptions } from '../../../../data/carTypeData';
import { responseCodes } from '../../../../data/responseCodes';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { OptionsService } from '../../../../services/options/options.service';
import { CarsApiService } from '../../../../services/api/cars-api.service';

@Component({
  selector: 'app-car-item-add',
  templateUrl: './car-item-add.component.html',
  styleUrls: ['./car-item-add.component.scss'],
})
export class CarItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];
  public divisionsOptions$: Subscription;
  public divisionsOptions: OptionType[] = [];
  public employeesOptions$: Subscription;
  public employeesOptions: OptionType[] = [];

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public alreadyExistId: string;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public carTypeOptions = carTypeOptions;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    /* this */
    private title: Title,
    private options: OptionsService,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private carsApi: CarsApiService
  ) {
    super(store, router, route);

    title.setTitle('Добавить автомобиль - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */
    this.options.initLocalitiesOptions();
    this.options.initDivisionsOptions();
    this.options.initEmployeesOptions();

    /* -------------------------- */
    /* Localities options request */
    /* -------------------------- */
    this.localitiesOptions$ = this.options
      .getLocalitiesOptions({ statuses: [SimpleStatus.active] })
      .subscribe((value) => {
        this.localitiesOptions = value;
      });

    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        type: new FormControl('', Validators.required),
        licensePlate: new FormControl('', Validators.required),
        weight: new FormControl('', Validators.min(0.00000001)),
        isCorporate: new FormControl('', Validators.required),
        drivers: new FormControl(''),
        locality: new FormControl(
          this.queryLocalityId || '',
          Validators.required
        ),
        divisions: new FormControl(
          this.queryDivisionId ? [this.queryDivisionId] : [],
          Validators.required
        ),
        employees: new FormControl([]),
      });

      this.form
        .get('licensePlate')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.carsApi
              .checkLicensePlate(this.form.get('licensePlate').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('licensePlate').markAsTouched();
                  this.form
                    .get('licensePlate')
                    .setErrors({ alreadyExists: true });
                  this.alreadyExistId = response.id;
                }
              });
          }
        });

      this.form.get('locality').valueChanges.subscribe((fieldValue) => {
        this.form.get('divisions').setValue([]);

        /* -------------------------- */
        /* Divisions options request */
        /* -------------------------- */

        this.divisionsOptions$?.unsubscribe();
        this.divisionsOptions$ = this.options
          .getDivisionsOptions({
            statuses: [SimpleStatus.active],
            localitiesIds: fieldValue ? [fieldValue] : undefined,
          })
          .subscribe((value) => {
            this.divisionsOptions = value;
            if (this.divisionsOptions?.length === 1) {
              this.form
                .get('divisions')
                .setValue([this.divisionsOptions[0].value]);
            }
          });
      });

      this.form.get('divisions').valueChanges.subscribe((fieldValues) => {
        this.form.get('drivers').setValue([]);

        /* -------------------------- */
        /* Employees options request */
        /* -------------------------- */

        this.employeesOptions$?.unsubscribe();
        this.employeesOptions$ = this.options
          .getEmployeesOptions({
            statuses: [EmployeeStatus.active, EmployeeStatus.vacation],
            roles: [EmployeeRole.driver],
            divisionsIds: fieldValues,
          })
          .subscribe((value) => {
            this.employeesOptions = value;
          });
      });
    };

    this.isFetching$ = this.store
      .select(CarsSelectors.selectAddCarIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(CarsSelectors.selectAddCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addResultSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(CarsActions.refreshAddCarSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(CarsSelectors.selectAddCarError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.addResultSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
            if (error.description.includes('division')) {
              this.addResultSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно было удалёно',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else {
            this.addResultSnackbar = this.snackBar.open(
              'Ошибка при добавлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(CarsActions.refreshAddCarFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      this.store.dispatch(
        CarsActions.addCarRequest({
          carType: +this.form.get('type').value,
          isCorporate: this.form.get('isCorporate').value === '1',
          licensePlate: this.form.get('licensePlate').value,
          weight: +this.form.get('weight').value,
          locality: this.form.get('locality').value,
          divisions: this.form.get('divisions').value,
          drivers: this.form.get('employees').value || [],
        })
      );
    };

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('cars');

    this.localitiesOptions$?.unsubscribe?.();
    this.divisionsOptions$?.unsubscribe?.();
    this.employeesOptions$?.unsubscribe?.();

    this.options.destroyLocalitiesOptions();
    this.options.destroyDivisionsOptions();
    this.options.destroyEmployeesOptions();
  }
}
