import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap, take } from 'rxjs/operators';

import * as fromRoot from '../../../store/root.reducer';
import * as UsersSelectors from '../../../store/users/users.selectors';
import * as UsersActions from '../../../store/users/users.actions';
import { IEmployee } from '../../../models/Employee';
import { IClient } from '../../../models/Client';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import SimpleStatus from '../../../models/enums/SimpleStatus';
import { UserType } from '../../../models/enums/UserType';
import { employeeRoleStrings } from '../../../data/employeeRoleData';
import { ICar } from '../../../models/Car';
import { ItemFieldListElement } from '../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { carStatusColors } from '../../../data/carStatusData';
import EmployeeRole from '../../../models/enums/EmployeeRole';
import { responseCodes } from '../../../data/responseCodes';
import { EmployeesApiService } from '../../../services/api/employees-api.service';
import { ModalAction } from '../../../components/modal/modal.component';
import { ClientsApiService } from '../../../services/api/clients-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userType: UserType;
  private user$: Subscription;
  public userEmployee: IEmployee;
  public userClient: IClient;

  private userIsUpdating$: Subscription;
  public userIsUpdating: boolean;
  private userUpdateSucceed$: Subscription;
  private userUpdateError$: Subscription;

  private usersPasswordIsUpdating$: Subscription;
  public usersPasswordIsUpdating: boolean;
  private usersPasswordUpdateSucceed$: Subscription;
  private usersPasswordUpdateError$: Subscription;

  public updateForm: FormGroup;
  public changePasswordForm: FormGroup;
  public activeField: string | null = null;
  protected updateSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  public isChangePasswordModalOpen = false;

  public simpleStatus = SimpleStatus;
  public userTypeEnum = UserType;
  public employeeRole = EmployeeRole;
  public employeeRoleStrings = employeeRoleStrings;

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private employeesApi: EmployeesApiService,
    private clientsApi: ClientsApiService
  ) {}

  ngOnInit(): void {
    this.initChangePasswordForm();

    /* ----------------- */
    /* Get user settings */
    /* ----------------- */
    this.user$ = this.store
      .select(UsersSelectors.selectUserType)
      .pipe(
        switchMap((userType) => {
          this.userType = userType;
          return this.store.select(UsersSelectors.selectUser);
        })
      )
      .subscribe((user) => {
        if (this.userType === UserType.employee) {
          this.userEmployee = user as IEmployee;
        }
        if (this.userType === UserType.client) {
          this.userClient = user as IClient;
        }
        this.setUpdateFormValues();
      });

    this.userIsUpdating$ = this.store
      .select(UsersSelectors.selectUpdateUserIsFetching)
      .subscribe((status) => {
        this.userIsUpdating = status;
      });

    this.userUpdateSucceed$ = this.store
      .select(UsersSelectors.selectUpdateUserSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(UsersActions.refreshUpdateUserSucceed());
        }
      });

    this.userUpdateError$ = this.store
      .select(UsersSelectors.selectUpdateUserError)
      .subscribe((error) => {
        if (error) {
          if (error.description?.includes('email')) {
            this.updateForm.get('email').setErrors({ alreadyExists: true });
          } else if (error.description?.includes('phone')) {
            this.updateForm.get('phone').setErrors({ alreadyExists: true });
          } else if (error.code === responseCodes.validationFailed) {
            if (error.errors[0].param === 'email') {
              this.updateSnackbar = this.snackBar.open(
                'Некорректный email',
                'Скрыть',
                {
                  duration: 2000,
                  panelClass: 'error',
                }
              );
            }
          } else {
            this.updateSnackbar = this.snackBar.open(
              'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(UsersActions.refreshUpdateUserFailure());
      });

    this.usersPasswordIsUpdating$ = this.store
      .select(UsersSelectors.selectUpdateUsersPasswordIsFetching)
      .subscribe((status) => {
        this.usersPasswordIsUpdating = status;
      });

    this.usersPasswordUpdateSucceed$ = this.store
      .select(UsersSelectors.selectUpdateUsersPasswordSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.isChangePasswordModalOpen = false;

          this.resetChangePasswordForm();

          this.store.dispatch(UsersActions.refreshUpdateUsersPasswordSucceed());
        }
      });

    this.usersPasswordUpdateError$ = this.store
      .select(UsersSelectors.selectUpdateUsersPasswordError)
      .subscribe((error) => {
        if (error) {
          this.updateSnackbar = this.snackBar.open(
            'Ошибка при смене пароля. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(UsersActions.refreshUpdateUsersPasswordFailure());
      });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe();

    this.userIsUpdating$?.unsubscribe();
    this.userUpdateSucceed$?.unsubscribe();
    this.userUpdateError$?.unsubscribe();

    this.usersPasswordIsUpdating$?.unsubscribe();
    this.usersPasswordUpdateSucceed$?.unsubscribe();
    this.usersPasswordUpdateError$?.unsubscribe();

    this.socket.get()?.off('employees');
    this.socket.get()?.off('clients');
  }

  private setUpdateFormValues(): void {
    if (this.userEmployee) {
      this.updateForm = new FormGroup({
        name: new FormControl(
          this.userEmployee.name || '',
          Validators.required
        ),
        surname: new FormControl(
          this.userEmployee.surname || '',
          Validators.required
        ),
        patronymic: new FormControl(this.userEmployee.patronymic || ''),
        phone: new FormControl(
          this.userEmployee.phone.substr(2) || '',
          Validators.required
        ),
        email: new FormControl(
          this.userEmployee.email || '',
          Validators.required
        ),
      });

      this.updateForm
        .get('email')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.employeesApi
              .checkEmail(this.updateForm.get('email').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  if (this.userEmployee?._id !== response.id) {
                    this.updateForm.get('email').markAsTouched();
                    this.updateForm
                      .get('email')
                      .setErrors({ alreadyExists: true });
                  }
                }
              });
          }
        });

      this.updateForm
        .get('phone')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.employeesApi
              .checkPhone('+7' + this.updateForm.get('phone').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  if (this.userEmployee?._id !== response.id) {
                    this.updateForm.get('phone').markAsTouched();
                    this.updateForm
                      .get('phone')
                      .setErrors({ alreadyExists: true });
                  }
                }
              });
          }
        });
    }

    if (this.userClient) {
      this.updateForm = new FormGroup({
        name: new FormControl(this.userClient.name || '', Validators.required),
        phone: new FormControl(
          this.userClient.phone.substr(2) || '',
          Validators.required
        ),
        email: new FormControl(
          this.userClient.email || '',
          Validators.required
        ),
      });

      this.updateForm
        .get('email')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.clientsApi
              .checkEmail(this.updateForm.get('email').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  if (this.userClient?._id !== response.id) {
                    this.updateForm.get('email').markAsTouched();
                    this.updateForm
                      .get('email')
                      .setErrors({ alreadyExists: true });
                  }
                }
              });
          }
        });
    }
  }

  public initChangePasswordForm(): void {
    this.changePasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        repeatPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        validators: (group: FormGroup) => {
          const password = group.get('password').value;
          const repeatPassword = group.get('repeatPassword').value;

          return password === repeatPassword ? null : { notSame: true };
        },
      }
    );
  }

  public resetChangePasswordForm(): void {
    this.changePasswordForm?.setValue({
      password: '',
      repeatPassword: '',
    });
    this.changePasswordForm?.markAsUntouched();
  }

  public setActiveField(fieldName: string): void {
    this.activeField = fieldName;
  }

  public removeActiveField(fieldName: string, controlValue): void {
    if (this.activeField === fieldName) {
      this.activeField = null;

      if (fieldName === 'password') {
        this.changePasswordForm?.setValue({
          password: '',
          repeatPassword: '',
        });
      } else {
        this.updateForm?.get(fieldName).setValue(controlValue);
      }
    }
  }

  public getItemCarsFieldListElements(
    cars: (ICar | string)[]
  ): ItemFieldListElement[] {
    return (
      (cars as ICar[])?.map((el) => {
        return {
          text: el.licensePlate,
          color: carStatusColors[el.status],
          linkArray: ['../', 'cars', el._id],
        };
      }) || []
    );
  }

  public updateUser(): void {
    if (
      this.activeField &&
      !this.userIsUpdating &&
      this.updateForm.get(this.activeField).valid
    ) {
      if (this.userEmployee) {
        this.store.dispatch(
          UsersActions.updateUserRequest({
            name:
              this.activeField === 'name'
                ? this.updateForm.get('name').value
                : undefined,
            surname:
              this.activeField === 'surname'
                ? this.updateForm.get('surname').value
                : undefined,
            patronymic:
              this.activeField === 'patronymic'
                ? this.updateForm.get('patronymic').value
                : undefined,
            email:
              this.activeField === 'email'
                ? this.updateForm.get('email').value
                : undefined,
            phone:
              this.activeField === 'phone'
                ? '+7' + this.updateForm.get('phone').value
                : undefined,
          })
        );
      }
      if (this.userClient) {
        this.store.dispatch(
          UsersActions.updateUserRequest({
            name:
              this.activeField === 'name'
                ? this.updateForm.get('name').value
                : undefined,
            email:
              this.activeField === 'email'
                ? this.updateForm.get('email').value
                : undefined,
            phone:
              this.activeField === 'phone'
                ? '+7' + this.updateForm.get('phone').value
                : undefined,
          })
        );
      }
    }
  }

  public changePassword(): void {
    if (
      !this.userIsUpdating &&
      !this.usersPasswordIsUpdating &&
      this.changePasswordForm.valid
    ) {
      const newPassword = this.changePasswordForm.get('password').value;
      this.store.dispatch(
        UsersActions.updateUsersPasswordRequest({ password: newPassword })
      );
    }
  }

  public onChangePasswordModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isChangePasswordModalOpen = false;
        this.resetChangePasswordForm();
        break;
      case 'reject':
        this.isChangePasswordModalOpen = false;
        this.resetChangePasswordForm();
        break;
    }
    if (action === 'resolve') {
      this.changePassword();
    }
  }

  public logout(): void {
    const userType = this.userType;
    this.store.dispatch(UsersActions.logout());
    if (userType === UserType.employee) {
      this.router.navigateByUrl('/e/login');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
