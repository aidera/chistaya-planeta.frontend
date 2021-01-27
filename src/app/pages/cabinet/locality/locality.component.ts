import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as LocalitiesActions from '../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../store/locality/locality.selectors';
import { ILocality } from '../../../models/Locality';
import { SimpleStatus } from '../../../models/enums/SimpleStatus';
import { ItemPageComponent } from '../../item-page.component';

@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrls: ['./locality.component.scss'],
})
export class LocalityComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  localityId: string;
  locality$: Subscription;
  locality: ILocality | null;

  localityStatusString = 'Статус';

  ngOnInit(): void {
    this.localityId = this.route.snapshot.paramMap.get('id') as string;
    this.store.dispatch(
      LocalitiesActions.getLocalityRequest({ id: this.localityId })
    );

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
        }
      });
  }

  ngOnDestroy(): void {
    if (this.locality$) {
      this.locality$.unsubscribe();
    }
  }

  initForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  enable(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.active,
      })
    );
  }

  disable(): void {
    this.store.dispatch(
      LocalitiesActions.updateLocalityStatusRequest({
        id: this.locality._id,
        status: SimpleStatus.inactive,
      })
    );
  }

  update(): void {
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

  remove(): void {}
}
