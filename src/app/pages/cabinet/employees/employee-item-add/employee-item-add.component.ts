import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import * as fromRoot from '../../../../store/root.reducer';
import * as AppSelectors from '../../../../store/app/app.selectors';
import * as AppActions from '../../../../store/app/app.actions';
import * as EmployeeSelectors from '../../../../store/employee/employee.selectors';
import * as EmployeeActions from '../../../../store/employee/employee.actions';
import { OptionType } from '../../../../models/types/OptionType';
import { IDivisionLessInfo } from '../../../../models/Division';
import { RoutingStateService } from '../../../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { responseCodes } from '../../../../data/responseCodes';
import employeeRoleOptions from '../../../../data/employeeRoleOptions';
import { EmployeeService } from '../../../../services/api/employee.service';
import { ICarLessInfo } from '../../../../models/Car';
import EmployeeRole from '../../../../models/enums/EmployeeRole';

@Component({
  selector: 'app-employee-item-add',
  templateUrl: './employee-item-add.component.html',
  styleUrls: ['./employee-item-add.component.scss'],
})
export class EmployeeItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  public form1: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;
  public form4: FormGroup;

  private localities$: Subscription;
  public localitiesOptions: OptionType[];
  private divisions$: Subscription;
  public divisions: IDivisionLessInfo[];
  public divisionsOptions: OptionType[];
  private cars$: Subscription;
  public cars: ICarLessInfo[];
  public carsOptions: OptionType[];

  public alreadyExistId: string;

  public employeeRole = EmployeeRole;
  public employeeRoleOptions = employeeRoleOptions.filter(
    (el) => el.value !== EmployeeRole.head + ''
  );

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
    private employeeApi: EmployeeService
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
      .select(EmployeeSelectors.selectAddEmployeeIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(EmployeeSelectors.selectAddEmployeeSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(EmployeeActions.refreshAddEmployeeSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(EmployeeSelectors.selectAddEmployeeError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            if (error.description?.includes('email')) {
              this.form2.get('email').setErrors({ alreadyExists: true });
            }
            if (error.description?.includes('phone')) {
              this.form2.get('phone').setErrors({ alreadyExists: true });
            }
            this.alreadyExistId = error.foundedItem._id;
          } else if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.addSnackbar = this.snackBar.open(
                'Некорректный email',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.addSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
            if (error.description.includes('division')) {
              this.addSnackbar = this.snackBar.open(
                'Ошибка подразделения. Возможно, оно былы удалёно',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
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
            if (this.queryLocalityId === el.locality) {
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

    this.cars$ = this.store
      .select(AppSelectors.selectCarsToSelect)
      .subscribe((cars) => {
        this.cars = cars;
        this.carsOptions = [];
      });

    if (this.cars === null) {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    }

    this.socket.get()?.on('cars', (_) => {
      this.store.dispatch(AppActions.getCarsToSelectRequest());
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.localities$?.unsubscribe?.();
    this.divisions$?.unsubscribe?.();
    this.cars$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form1 = new FormGroup({
      role: new FormControl('', Validators.required),
    });

    this.form2 = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      patronymic: new FormControl(''),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.form3 = new FormGroup({
      locality: new FormControl(
        this.queryLocalityId || '',
        Validators.required
      ),
      division: new FormControl(
        this.queryLocalityId || '',
        Validators.required
      ),
    });

    this.form4 = new FormGroup({
      cars: new FormControl(''),
    });

    this.form3?.get('locality').valueChanges.subscribe((value) => {
      this.isQueryLocalityId = false;
      this.isQueryDivisionId = false;
      this.divisionsOptions = [];
      this.divisions?.forEach((el) => {
        if (el.locality === value) {
          this.divisionsOptions.push({
            value: el._id,
            text: el.name,
          });
        }
      });

      if (this.divisionsOptions.length === 1) {
        this.form3.get('division').setValue(this.divisionsOptions[0].value);
      } else {
        this.form3.get('division').setValue('');
      }
    });

    this.form3?.get('division').valueChanges.subscribe((value) => {
      this.isQueryDivisionId = false;

      this.carsOptions = [];
      this.cars?.forEach((el) => {
        if (el.divisions.includes(value)) {
          this.carsOptions.push({
            value: el._id,
            text: el.licensePlate,
          });
        }
      });
      this.form4.get('cars').setValue('');
    });
  }

  public sendForm1(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1.valid) {
      this.setActiveForm(2);
    }
  }

  public sendForm2(): void {
    Object.keys(this.form2.controls).forEach((field) => {
      const control = this.form2.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form2?.valid) {
      let requestFinished = false;
      this.employeeApi
        .checkEmail(this.form2.get('email').value)
        .pipe(take(1))
        .subscribe((response) => {
          if (response?.responseCode === responseCodes.notFound) {
            if (requestFinished) {
              this.setActiveForm(3);
            }
            requestFinished = true;
          }
          if (response?.responseCode === responseCodes.found) {
            this.form2.get('email').setErrors({ alreadyExists: true });
            this.alreadyExistId = response.id;
          }
        });

      this.employeeApi
        .checkPhone('+7' + this.form2.get('phone').value)
        .pipe(take(1))
        .subscribe((response) => {
          if (response?.responseCode === responseCodes.notFound) {
            if (requestFinished) {
              this.setActiveForm(3);
            }
            requestFinished = true;
          }
          if (response?.responseCode === responseCodes.found) {
            this.form2.get('phone').setErrors({ alreadyExists: true });
            this.alreadyExistId = response.id;
          }
        });
    }
  }

  public sendForm3(): void {
    Object.keys(this.form3.controls).forEach((field) => {
      const control = this.form3.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.form1?.valid && this.form2?.valid && this.form3?.valid) {
      if (+this.form1.get('role').value === EmployeeRole.driver) {
        this.setActiveForm(4);
      } else {
        this.sendForm4();
      }
    }
  }

  public sendForm4(): void {
    Object.keys(this.form4.controls).forEach((field) => {
      const control = this.form4.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (
      this.form1?.valid &&
      this.form2?.valid &&
      this.form3?.valid &&
      this.form4?.valid
    ) {
      this.store.dispatch(
        EmployeeActions.addEmployeeRequest({
          role: +this.form1.get('role').value,
          name: this.form2.get('name').value,
          surname: this.form2.get('surname').value,
          patronymic: this.form2.get('patronymic').value,
          email: this.form2.get('email').value,
          phone: '+7' + this.form2.get('phone').value,
          locality: this.form3.get('locality').value,
          division: this.form3.get('division').value,
          cars:
            +this.form1.get('role').value === EmployeeRole.driver
              ? this.form4.get('cars').value
              : [],
        })
      );
    }
  }
}
