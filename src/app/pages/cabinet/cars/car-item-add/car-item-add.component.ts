import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../../../store/root.reducer';
import * as AppActions from '../../../../store/app/app.actions';
import * as AppSelectors from '../../../../store/app/app.selectors';
import * as CarActions from '../../../../store/car/car.actions';
import * as CarSelectors from '../../../../store/car/car.selectors';
import { ItemAddPageComponent } from '../../item-add-page.component';
import CarStatus from '../../../../models/enums/CarStatus';
import carTypeOptions from '../../../../data/carTypeOptions';
import { responseCodes } from '../../../../data/responseCodes';
import { RoutingStateService } from '../../../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { CarService } from '../../../../services/api/car.service';
import { OptionType } from '../../../../models/types/OptionType';
import { IDivisionLessInfo } from '../../../../models/Division';

@Component({
  selector: 'app-car-item-add',
  templateUrl: './car-item-add.component.html',
  styleUrls: ['./car-item-add.component.scss'],
})
export class CarItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  public form1: FormGroup;
  public form2: FormGroup;

  private localities$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];
  public divisionsOptions: OptionType[];

  public alreadyExistId: string;

  public carStatus = CarStatus;
  public carTypeOptions = carTypeOptions;

  public isQueryLocalityId: boolean;
  private queryLocalityId: string;
  public isQueryDivisionId: boolean;
  private queryDivisionId: string;

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    protected routingState: RoutingStateService,
    protected socket: SocketIoService,
    private carApi: CarService
  ) {
    super(store, route, router, snackBar, routingState, socket);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.locality && params.divisions) {
        this.isQueryLocalityId = true;
        this.queryLocalityId = params.locality;
        this.isQueryDivisionId = true;
        this.queryDivisionId = params.divisions;
      } else if (params.locality) {
        this.isQueryLocalityId = true;
        this.queryLocalityId = params.locality;
      }
    });

    this.initForm();

    this.isFetching$ = this.store
      .select(CarSelectors.selectAddCarIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(CarSelectors.selectAddCarSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(CarActions.refreshAddCarSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(CarSelectors.selectAddCarError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form1.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else {
            this.addSnackbar = this.snackBar.open(
              'Ошибка при добавлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }
      });

    this.localities$ = this.store
      .select(AppSelectors.selectLocalitiesOptionsToSelect)
      .subscribe((localitiesOptions) => {
        this.localitiesOptions = localitiesOptions;
      });

    if (this.localitiesOptions === null) {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    }

    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });

    this.divisions$ = this.store
      .select(AppSelectors.selectDivisionsToSelect)
      .subscribe((divisions) => {
        this.divisions = divisions;
        this.divisionsOptions = [];
        if (this.isQueryLocalityId) {
          this.divisions?.forEach((el) => {
            if (this.queryLocalityId === el.address.locality) {
              this.divisionsOptions.push({
                value: el._id,
                text: el.name,
              });
            }
          });
        }
      });

    if (this.divisions === null) {
      this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    }

    this.socket.get()?.on('divisions', (_) => {
      this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.localities$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form1 = new FormGroup({
      type: new FormControl('', Validators.required),
      licensePlate: new FormControl('', Validators.required),
      weight: new FormControl(''),
      isCorporate: new FormControl('', Validators.required),
      drivers: new FormControl(''),
    });

    this.form2 = new FormGroup({
      locality: new FormControl(
        this.queryLocalityId || '',
        Validators.required
      ),
      divisions: new FormControl(
        [this.queryDivisionId] || [],
        Validators.required
      ),
    });

    this.form2?.get('locality').valueChanges.subscribe((value) => {
      this.isQueryLocalityId = false;
      this.isQueryDivisionId = false;
      this.divisionsOptions = [];
      this.divisions?.forEach((el) => {
        if (el.address.locality === value) {
          this.divisionsOptions.push({
            value: el._id,
            text: el.name,
          });
        }
      });

      if (this.divisionsOptions.length === 1) {
        this.form2.get('divisions').setValue([this.divisionsOptions[0].value]);
      } else {
        this.form2.get('divisions').setValue([]);
      }
    });

    this.form2?.get('divisions').valueChanges.subscribe((value) => {
      this.isQueryDivisionId = false;
    });
  }

  public sendForm1(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1?.valid) {
      this.carApi
        .checkLicensePlate(this.form1.get('licensePlate').value)
        .pipe(take(1))
        .subscribe((response) => {
          if (response?.responseCode === responseCodes.notFound) {
            this.setActiveForm(2);
          }
          if (response?.responseCode === responseCodes.found) {
            this.form1.get('licensePlate').setErrors({ alreadyExists: true });
            this.alreadyExistId = response.id;
          }
        });
    }
  }

  public sendForm2(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1?.valid && this.form2?.valid) {
      this.store.dispatch(
        CarActions.addCarRequest({
          carType: +this.form1.get('type').value,
          drivers: this.form1.get('drivers').value || [],
          isCorporate: this.form1.get('isCorporate').value === '1',
          licensePlate: this.form1.get('licensePlate').value,
          weight: +this.form1.get('weight').value,
          localityId: this.form2.get('locality').value,
          divisionIds: this.form2.get('divisions').value,
        })
      );
    }
  }
}
