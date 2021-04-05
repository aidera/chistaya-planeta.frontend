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
import { ItemAddPageComponent } from '../../item-add-page.component';
import { responseCodes } from '../../../../data/responseCodes';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { LocalitiesApiService } from '../../../../services/api/localities-api.service';

@Component({
  selector: 'app-locality-item-add',
  templateUrl: './locality-item-add.component.html',
  styleUrls: ['./locality-item-add.component.scss'],
})
export class LocalityItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
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
    protected snackBar: MatSnackBar,
    protected socket: SocketIoService,
    public localitiesApi: LocalitiesApiService
  ) {
    super(store, router, route);

    title.setTitle('Добавить населённый пункт - Чистая планета');
  }

  ngOnInit(): void {
    /* --------------------- */
    /* --- Form settings --- */
    /* --------------------- */
    this.initForm = () => {
      this.form = new FormGroup({
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
                }
              });
          }
        });
    };

    /* -------------------------- */
    /* --- Main item settings --- */
    /* -------------------------- */

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectAddLocalityIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(LocalitiesSelectors.selectAddLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addResultSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(LocalitiesActions.refreshAddLocalitySucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(LocalitiesSelectors.selectAddLocalityError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form.get('name').setErrors({ alreadyExists: true });
            this.alreadyExistId = error.foundedItem._id;
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

        this.store.dispatch(LocalitiesActions.refreshAddLocalityFailure());
      });

    /* ------------------------ */
    /* --- Request settings --- */
    /* ------------------------ */

    this.createRequest = () => {
      this.store.dispatch(
        LocalitiesActions.addLocalityRequest({
          name: this.form.get('name').value,
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

    this.socket.get()?.off('localities');
  }
}
