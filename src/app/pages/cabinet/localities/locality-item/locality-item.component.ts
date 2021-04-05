import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as LocalitiesActions from '../../../../store/localities/localities.actions';
import * as LocalitiesSelectors from '../../../../store/localities/localities.selectors';
import { ILocality } from '../../../../models/Locality';
import { ModalAction } from '../../../../components/modal/modal.component';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { CarStatus } from '../../../../models/enums/CarStatus';
import { EmployeeStatus } from '../../../../models/enums/EmployeeStatus';
import { responseCodes } from '../../../../data/responseCodes';
import {
  simpleStatusColors,
  simpleStatusOptions,
  simpleStatusStrings,
} from '../../../../data/simpleStatusData';
import { ItemPageComponent } from '../../item-page.component';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { GettersService } from '../../../../services/getters/getters.service';
import { LocalitiesApiService } from '../../../../services/api/localities-api.service';

@Component({
  selector: 'app-locality-item',
  templateUrl: './locality-item.component.html',
  styleUrls: ['./locality-item.component.scss'],
})
export class LocalityItemComponent
  extends ItemPageComponent
  implements OnInit, OnDestroy {
  /* ------------------ */
  /* Main item settings */
  /* ------------------ */
  public item: ILocality;

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public alreadyExistId: string;
  public isDeactivateModalOpen = false;

  /* ----------- */
  /* Static data */
  /* ----------- */
  public simpleStatus = SimpleStatus;
  public employeeStatus = EmployeeStatus;
  public carStatus = CarStatus;
  public simpleStatusOptions = simpleStatusOptions;
  public simpleStatusStrings = simpleStatusStrings;
  public simpleStatusColors = simpleStatusColors;

  constructor(
    /* parent */
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    /* this */
    private title: Title,
    private snackBar: MatSnackBar,
    private socket: SocketIoService,
    private localitiesApi: LocalitiesApiService,
    public getters: GettersService
  ) {
    super(store, router, route);

    title.setTitle('Населённый пункт - Чистая планета');
  }

  ngOnInit(): void {
    /* ------------- */
    /* Form settings */
    /* ------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        status: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
      });

      this.form
        .get('name')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== '') {
            this.localitiesApi
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
        LocalitiesActions.getLocalityRequest({ id: this.itemId, withLoading })
      );
    };

    this.updateItemRequest = () => {
      this.store.dispatch(
        LocalitiesActions.updateLocalityRequest({
          id: this.item._id,
          name:
            this.activeField === 'name'
              ? this.form.get('name').value
              : undefined,
          status:
            this.activeField === 'status'
              ? +this.form.get('status').value
              : undefined,
        })
      );
    };

    this.removeItemRequest = () => {
      this.store.dispatch(
        LocalitiesActions.removeLocalityRequest({ id: this.item._id })
      );
    };

    /* ----------------- */
    /* Store connections */
    /* ----------------- */
    this.item$ = this.store
      .select(LocalitiesSelectors.selectLocality)
      .subscribe((locality) => {
        this.item = locality;

        if (locality) {
          this.title.setTitle(
            `Населённый пункт - ${locality.name} - Чистая планета`
          );
        }

        this.initForm();

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

    this.getItemError$ = this.store
      .select(LocalitiesSelectors.selectGetLocalityError)
      .subscribe((error) => {
        if (error?.code) {
          this.getItemError =
            error.code === responseCodes.notFound ? 'Не найдено' : error.code;
        } else {
          this.getItemError = null;
        }
      });

    this.itemIsFetching$ = this.store
      .select(LocalitiesSelectors.selectGetLocalityIsFetching)
      .subscribe((status) => {
        this.itemIsFetching = status;
      });

    this.itemIsUpdating$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalityIsFetching)
      .subscribe((status) => {
        this.itemIsUpdating = status;
      });

    this.itemIsUpdateSucceed$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.activeField = null;

          this.updateResultSnackbar = this.snackBar.open(
            'Обновлено',
            'Скрыть',
            {
              duration: 2000,
            }
          );

          this.store.dispatch(LocalitiesActions.refreshUpdateLocalitySucceed());
        }
      });

    this.updateItemError$ = this.store
      .select(LocalitiesSelectors.selectUpdateLocalityError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('name').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
          } else {
            this.updateResultSnackbar = this.snackBar.open(
              'Ошибка при обновлении. Пожалуйста, обратитесь в отдел разработки',
              'Скрыть',
              {
                duration: 2000,
                panelClass: 'error',
              }
            );
          }
        }

        this.store.dispatch(LocalitiesActions.refreshUpdateLocalityFailure());
      });

    this.itemIsRemoving$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalityIsFetching)
      .subscribe((status) => {
        this.itemIsRemoving = status;
      });

    this.itemIsRemoveSucceed$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.isRemoveModalOpen = false;

          this.store.dispatch(LocalitiesActions.refreshRemoveLocalitySucceed());

          this.removeResultSnackbar = this.snackBar.open('Удалено', 'Скрыть', {
            duration: 2000,
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.removeItemError$ = this.store
      .select(LocalitiesSelectors.selectRemoveLocalityError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.isRemoveModalOpen = false;
        } else if (error) {
          this.removeResultSnackbar = this.snackBar.open(
            'Ошибка при удалении. Пожалуйста, обратитесь в отдел разработки',
            'Скрыть',
            {
              duration: 2000,
              panelClass: 'error',
            }
          );
        }

        this.store.dispatch(LocalitiesActions.refreshRemoveLocalityFailure());
      });

    this.socket.get()?.on('localities', (data) => {
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

    this.socket.get()?.off('localities');
  }

  public onDeactivateModalAction(action: ModalAction): void {
    this.isDeactivateModalOpen = false;
    if (action === 'reject') {
      this.store.dispatch(
        LocalitiesActions.updateLocalityRequest({
          id: this.item._id,
          status: SimpleStatus.inactive,
        })
      );
    } else {
      this.form.get('status').setValue(SimpleStatus.active + '');
    }
  }
}
