import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as fromRoot from '../../../../store/root.reducer';
import * as DivisionsSelectors from '../../../../store/divisions/divisions.selectors';
import * as DivisionsActions from '../../../../store/divisions/divisions.actions';
import { SimpleStatus } from '../../../../models/enums/SimpleStatus';
import { OptionType } from '../../../../models/types/OptionType';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import { OptionsService } from '../../../../services/options/options.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { DivisionsApiService } from '../../../../services/api/divisions-api.service';

@Component({
  selector: 'app-division-item-add',
  templateUrl: './division-item-add.component.html',
  styleUrls: ['./division-item-add.component.scss'],
})
export class DivisionItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  /* ---------------- */
  /* Options settings */
  /* ---------------- */
  public localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[] = [];

  /* -------------- */
  /* Forms settings */
  /* -------------- */
  public alreadyExistId: string;

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
    private divisionsApi: DivisionsApiService
  ) {
    super(store, router, route);

    title.setTitle('Добавить подразделение - Чистая планета');
  }

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

    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        locality: new FormControl(
          this.queryLocalityId || '',
          Validators.required
        ),
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
                }
              });
          }
        });

      this.form
        .get('locality')
        .valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (value !== this.queryLocalityId) {
            this.isQueryLocalityId = false;
          }
        });
    };

    /* -------------------------- */
    /* --- Main item settings --- */
    /* -------------------------- */

    this.isFetching$ = this.store
      .select(DivisionsSelectors.selectAddDivisionIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(DivisionsSelectors.selectAddDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addResultSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(DivisionsActions.refreshAddDivisionSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(DivisionsSelectors.selectAddDivisionError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('name').setErrors({ alreadyExists: true });
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

        this.store.dispatch(DivisionsActions.refreshAddDivisionFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      this.store.dispatch(
        DivisionsActions.addDivisionRequest({
          name: this.form.get('name').value,
          locality: this.form.get('locality').value,
          street: this.form.get('street').value,
          house: this.form.get('house').value,
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

    this.socket.get()?.off('divisions');

    this.localitiesOptions$?.unsubscribe?.();
    this.options.destroyLocalitiesOptions();
  }
}
