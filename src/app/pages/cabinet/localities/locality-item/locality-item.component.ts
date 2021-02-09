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
import simpleStatusOptions from '../../../../data/simpleStatusOptions';

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
  public simpleStatusOptions = simpleStatusOptions;

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
          locality?.status === SimpleStatus.inactive
            ? 'Статус: <span class="red-text">' +
              simpleStatusOptions.find(
                (el) => el.value === SimpleStatus.inactive + ''
              ).text +
              '</span>'
            : locality?.status === SimpleStatus.active
            ? 'Статус: <span class="green-text">' +
              simpleStatusOptions.find(
                (el) => el.value === SimpleStatus.active + ''
              ).text +
              '</span>'
            : 'Статус';

        if (this.form) {
          this.form
            .get('status')
            .setValue(locality ? String(locality.status) : '');
          this.form.get('name').setValue(locality ? locality.name : '');
        }

        this.form.get('status').valueChanges.subscribe((value) => {
          if (value === SimpleStatus.inactive + '') {
            this.isDeactivateModalOpen = true;
          }
        });
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
      status: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  public getItemRequest(): void {
    this.store.dispatch(
      LocalitiesActions.getLocalityRequest({ id: this.localityId })
    );
  }

  public update(): void {
    if (this.activeField && !this.isUpdating && this.form.valid) {
      this.store.dispatch(
        LocalitiesActions.updateLocalityRequest({
          id: this.locality._id,
          name: this.form.get('name').value,
          status: +this.form.get('status').value,
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
      this.store.dispatch(
        LocalitiesActions.updateLocalityRequest({
          id: this.locality._id,
          status: SimpleStatus.inactive,
        })
      );
    } else {
      this.form.get('status').setValue(SimpleStatus.active + '');
    }
  }
}
