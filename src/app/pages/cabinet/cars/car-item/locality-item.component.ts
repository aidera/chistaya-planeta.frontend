import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

import * as LocalitiesActions from '../../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../../store/locality/locality.selectors';
import { ILocality } from '../../../../models/Locality';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { ItemPageComponent } from '../../item-page.component';
import { ModalAction } from '../../../../components/modal/modal.component';
import { responseCodes } from '../../../../data/responseCodes';

@Component({
  selector: 'app-locality-item',
  templateUrl: './locality-item.component.html',
  styleUrls: ['./locality-item.component.scss'],
})
export class LocalityItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  private localityId: string;
  private locality$: Subscription;
  public locality: ILocality | null;
  private getLocalityError$: Subscription;
  public getLocalityError: string | null;
  protected isRemoving$: Subscription;
  public isRemoving = false;
  protected isRemoveSucceed$: Subscription;
  protected removeError$: Subscription;
  public removeError: string | null;

  public isRemoveModalOpen = false;
  protected removeSnackbar: MatSnackBarRef<TextOnlySnackBar>;
  public isDeactivateModalOpen = false;

  public simpleStatus = SimpleStatus;

  localityStatusString = 'Статус';

  ngOnInit(): void {
    this.localityId = this.route.snapshot.paramMap.get('id') as string;
    this.getItemRequest();

    this.socket.get()?.on('localities', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest();
      }
      if (data.action === 'update' && data.id) {
        if (this.locality && this.locality._id === data.id) {
          this.getItemRequest();
        }
      }
    });

    this.locality$ = this.store
      .select(LocalitiesSelectors.selectLocality)
      .subscribe((locality) => {
        this.locality = locality;

        this.initForm();

        this.localityStatusString =
          locality && locality.status === 0
            ? 'Статус: <span class="red-text">Не активно</span>'
            : locality && locality.status === 1
            ? 'Статус: <span class="green-text">Активно</span>'
            : 'Статус';

        if (this.form) {
          this.form.get('name').setValue(locality ? locality.name : '');
        }
      });

    this.getLocalityError$ = this.store
      .select(LocalitiesSelectors.selectGetLocalityError)
      .subscribe((error) => {
        if (error?.code) {
          this.getLocalityError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getLocalityError = null;
        }
      });

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectGetLocalityIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.isUpdating$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalityIsFetching)
      .subscribe((status) => {
        this.isUpdating = status;
      });

    this.isUpdateSucceed$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(LocalitiesActions.refreshUpdateLocalitySucceed());
        }
      });

    this.updateError$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalityError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.form.get('name').markAsTouched();
          if (error.foundedItem._id === this.locality._id) {
            this.form.get('name').setErrors({ sameName: true });
          } else {
            this.form.get('name').setErrors({ alreadyExists: true });
          }
        } else if (error) {
          this.updateSnackbar = this.snackBar.open(
            'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });

    this.isRemoving$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalityIsFetching)
      .subscribe((status) => {
        this.isRemoving = status;
      });

    this.isRemoveSucceed$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(LocalitiesActions.refreshRemoveLocalitySucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeError$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalityError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.isRemoveModalOpen = false;
        } else if (error) {
          this.removeSnackbar = this.snackBar.open(
            'Ошибка при удалении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.locality$?.unsubscribe?.();
    this.getLocalityError$?.unsubscribe?.();
    this.isRemoving$?.unsubscribe?.();
    this.isRemoveSucceed$?.unsubscribe?.();
    this.removeError$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  public getItemRequest(): void {
    this.store.dispatch(
      LocalitiesActions.getLocalityRequest({ id: this.localityId })
    );
  }

  public enable(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.active,
      })
    );
  }

  public disable(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.inactive,
      })
    );
  }

  public update(): void {
    if (
      this.activeField &&
      !this.isUpdating &&
      this.form.get('name').value !== this.locality.name
    ) {
      this.store.dispatch(
        LocalitiesActions.updateLocalityRequest({
          id: this.locality._id,
          name: this.form.get('name').value,
        })
      );
    }
  }

  public onRemoveModalAction(action: ModalAction): void {
    switch (action) {
      case 'cancel':
        this.isRemoveModalOpen = false;
        break;
      case 'resolve':
        this.isRemoveModalOpen = false;
        break;
    }
    if (action === 'reject') {
      this.store.dispatch(
        LocalitiesActions.removeLocalityRequest({ id: this.locality._id })
      );
    }
  }

  public onDeactivateModalAction(action: ModalAction): void {
    this.isDeactivateModalOpen = false;
    if (action === 'reject') {
      this.disable();
    }
  }
}
