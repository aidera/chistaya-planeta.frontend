import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as DivisionsActions from '../../../../store/divisions/divisions.actions';
import * as DivisionsSelectors from '../../../../store/divisions/divisions.selectors';
import { IDivision } from '../../../../models/Division';
import { ILocality } from '../../../../models/Locality';
import { OptionType } from '../../../../models/types/OptionType';
import SimpleStatus from '../../../../models/enums/SimpleStatus';
import CarStatus from '../../../../models/enums/CarStatus';
import EmployeeStatus from '../../../../models/enums/EmployeeStatus';
import { ItemPageComponent } from '../../item-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import {
  simpleStatusOptions,
  simpleStatusStrings,
  simpleStatusColors,
} from '../../../../data/simpleStatusData';

@Component({
  selector: 'app-division-item',
  templateUrl: './division-item.component.html',
  styleUrls: ['./division-item.component.scss'],
})
export class DivisionItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  public item: IDivision;

  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];

  public simpleStatusOptions = simpleStatusOptions;
  public simpleStatusStrings = simpleStatusStrings;
  public simpleStatusColors = simpleStatusColors;

  public simpleStatus = SimpleStatus;
  public employeeStatus = EmployeeStatus;
  public carStatus = CarStatus;

  ngOnInit(): void {
    /* ------------ */
    /* Options init */
    /* ------------ */

    /* Localities */
    this.options.initLocalitiesOptions();
    this.localitiesOptions$ = this.options
      .getLocalitiesOptions({ statuses: [SimpleStatus.active] })
      .subscribe((value) => {
        this.localitiesOptions = value;
      });

    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        locality: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        house: new FormControl('', Validators.required),
      });

      this.form
        .get('name')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.divisionsApi
              .checkName(this.form.get('name').value)
              .pipe(take(1))
              .subscribe((response) => {
                if (response?.responseCode === responseCodes.found) {
                  this.form.get('name').markAsTouched();
                  this.form.get('name').setErrors({ alreadyExists: true });
                  this.alreadyExistId = response.id;
                } else {
                  this.alreadyExistId = '';
                }
              });
          }
        });
    };

    /* ---------------- */
    /* Request settings */
    /* ---------------- */
    this.getItemRequest = (withLoading: boolean) => {
      this.store.dispatch(
        DivisionsActions.getDivisionRequest({ id: this.itemId, withLoading })
      );
    };

    this.updateItemRequest = () => {
      this.store.dispatch(
        DivisionsActions.updateDivisionRequest({
          id: this.item._id,
          status:
            this.activeField === 'status'
              ? +this.form.get('status').value
              : undefined,
          name:
            this.activeField === 'name'
              ? this.form.get('name').value
              : undefined,
          locality:
            this.activeField === 'locality'
              ? this.form.get('locality').value
              : undefined,
          street:
            this.activeField === 'street'
              ? this.form.get('street').value
              : undefined,
          house:
            this.activeField === 'house'
              ? this.form.get('house').value
              : undefined,
        })
      );
    };

    this.removeItemRequest = () => {
      this.store.dispatch(
        DivisionsActions.removeDivisionRequest({ id: this.item._id })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */
    this.item$ = this.store
      .select(DivisionsSelectors.selectDivision)
      .subscribe((division) => {
        this.item = division;

        this.initForm();

        if (this.form) {
          this.form.setValue({
            status: String(division?.status) || '',
            name: String(division?.name) || '',
            locality: (division?.locality as ILocality)?._id || '',
            street: division?.street || '',
            house: division?.house || '',
          });
        }
      });

    this.getItemError$ = this.store
      .select(DivisionsSelectors.selectGetDivisionError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(DivisionsSelectors.selectGetDivisionIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(DivisionsSelectors.selectUpdateDivisionIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(DivisionsSelectors.selectUpdateDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateSnackbar = this.snackBar.open('Обновлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(DivisionsActions.refreshUpdateDivisionSucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(DivisionsSelectors.selectUpdateDivisionError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('name').setErrors({ alreadyExists: true });
          } else if (error.code === responseCodes.notFound) {
            if (error.description.includes('locality')) {
              this.updateSnackbar = this.snackBar.open(
                'Ошибка населённого пункта. Возможно, он был удалён',
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

        this.store.dispatch(DivisionsActions.refreshUpdateDivisionFailure());
      });

    this.itemIsRemoving$ = this.store
      .select(DivisionsSelectors.selectRemoveDivisionIsFetching)
      .subscribe((status) => {
        this.itemIsRemoving = status;
      });

    this.itemIsRemoveSucceed$ = this.store
      .select(DivisionsSelectors.selectRemoveDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(DivisionsActions.refreshRemoveDivisionSucceed());

          this.removeSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeItemError$ = this.store
      .select(DivisionsSelectors.selectRemoveDivisionError)
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

        this.store.dispatch(DivisionsActions.refreshRemoveDivisionFailure());
      });

    this.socket.get()?.on('divisions', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.getItemRequest(false);
      }
      if (data.action === 'update' && data.id) {
        if (this.item?._id === data.id) {
          this.getItemRequest(false);
        }
      }
    });

    /* --------------------------- */
    /* --- Parent class ngInit --- */
    /* --------------------------- */

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.socket.get()?.off('divisions');
  }
}
