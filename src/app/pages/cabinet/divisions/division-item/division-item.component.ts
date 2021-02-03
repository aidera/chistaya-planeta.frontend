import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as AppActions from '../../../../store/app/app.actions';
import * as AppSelectors from '../../../../store/app/app.selectors';
import * as DivisionActions from '../../../../store/division/division.actions';
import * as DivisionSelectors from '../../../../store/division/division.selectors';
import { ItemPageComponent } from '../../item-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { ModalAction } from '../../../../components/modal/modal.component';
import { IDivision } from '../../../../models/Division';
import { OptionType } from '../../../../models/types/OptionType';
import { ILocality } from '../../../../models/Locality';

@Component({
  selector: 'app-division-item',
  templateUrl: './division-item.component.html',
  styleUrls: ['./division-item.component.scss'],
})
export class DivisionItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  private divisionId: string;
  private division$: Subscription;
  public division: IDivision | null;
  private localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[];

  divisionStatusString = 'Статус';

  ngOnInit(): void {
    this.divisionId = this.route.snapshot.paramMap.get('id') as string;
    this.getItemRequest();

    this.socket.get()?.on('divisions', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest();
      }
      if (data.action === 'update' && data.id) {
        if (this.division && this.division._id === data.id) {
          this.getItemRequest();
        }
      }
    });

    this.division$ = this.store
      .select(DivisionSelectors.selectDivision)
      .subscribe((division) => {
        this.division = division;

        this.initForm();

        this.divisionStatusString =
          division && division.status === 0
            ? 'Статус: <span class="red-text">Не активно</span>'
            : division && division.status === 1
            ? 'Статус: <span class="green-text">Активно</span>'
            : 'Статус';

        if (this.form) {
          this.form.get('name').setValue(division?.name || '');
          this.form
            .get('localityId')
            .setValue((division?.address?.locality as ILocality)?._id || '');
          this.form.get('street').setValue(division?.address?.street || '');
          this.form.get('house').setValue(division?.address?.house || '');
        }
      });

    this.getItemError$ = this.store
      .select(DivisionSelectors.selectGetDivisionError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.isFetching$ = this.store
      .select(DivisionSelectors.selectGetDivisionIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.isUpdating$ = this.store
      .select(DivisionSelectors.selectUpdateDivisionIsFetching)
      .subscribe((status) => {
        this.isUpdating = status;
      });

    this.isUpdateSucceed$ = this.store
      .select(DivisionSelectors.selectUpdateDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(DivisionActions.refreshUpdateDivisionSucceed());
        }
      });

    this.updateError$ = this.store
      .select(DivisionSelectors.selectUpdateDivisionError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.form.get('name').markAsTouched();
          if (error.foundedItem._id === this.division._id) {
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
      .select(DivisionSelectors.selectRemoveDivisionIsFetching)
      .subscribe((status) => {
        this.isRemoving = status;
      });

    this.isRemoveSucceed$ = this.store
      .select(DivisionSelectors.selectRemoveDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(DivisionActions.refreshRemoveDivisionSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeError$ = this.store
      .select(DivisionSelectors.selectRemoveDivisionError)
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

    this.localitiesOptions$ = this.store
      .select(AppSelectors.selectLocalitiesOptionsToSelect)
      .subscribe((localities) => {
        this.localitiesOptions = localities;
        if (localities === null) {
          this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
        }
      });
    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });
  }

  ngOnDestroy(): void {
    this.division$?.unsubscribe?.();
    this.localitiesOptions$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      localityId: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      house: new FormControl('', Validators.required),
    });
  }

  public getItemRequest(): void {
    this.store.dispatch(
      DivisionActions.getDivisionRequest({ id: this.divisionId })
    );
  }

  public enable(): void {
    this.store.dispatch(
      DivisionActions.updateDivisionStatusRequest({
        id: this.division._id,
        status: SimpleStatus.active,
      })
    );
  }

  public disable(): void {
    this.store.dispatch(
      DivisionActions.updateDivisionStatusRequest({
        id: this.division._id,
        status: SimpleStatus.inactive,
      })
    );
  }

  public update(): void {
    if (this.activeField && !this.isUpdating && this.form.valid) {
      this.store.dispatch(
        DivisionActions.updateDivisionRequest({
          id: this.division._id,
          name: this.form.get('name').value,
          localityId: this.form.get('localityId').value,
          street: this.form.get('street').value,
          house: this.form.get('house').value,
        })
      );
    }
  }

  public onRemoveModalAction(action: ModalAction): void {
    super.onRemoveModalAction(action);
    if (action === 'reject') {
      this.store.dispatch(
        DivisionActions.removeDivisionRequest({ id: this.division._id })
      );
    }
  }
}