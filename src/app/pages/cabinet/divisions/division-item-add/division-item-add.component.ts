import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as fromRoot from '../../../../store/root.reducer';
import * as AppSelectors from '../../../../store/app/app.selectors';
import * as AppActions from '../../../../store/app/app.actions';
import * as DivisionSelectors from '../../../../store/division/division.selectors';
import * as DivisionActions from '../../../../store/division/division.actions';
import { ItemAddPageComponent } from '../../item-add-page.component';
import { OptionType } from '../../../../models/types/OptionType';
import { RoutingStateService } from '../../../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../../../services/socket-io/socket-io.service';
import { DivisionService } from '../../../../services/api/division.service';
import { responseCodes } from '../../../../data/responseCodes';

@Component({
  selector: 'app-division-item-add',
  templateUrl: './division-item-add.component.html',
  styleUrls: ['./division-item-add.component.scss'],
})
export class DivisionItemAddComponent
  extends ItemAddPageComponent
  implements OnInit, OnDestroy {
  private localitiesOptions$: Subscription;
  public localitiesOptions: OptionType[];

  public form1: FormGroup;
  public form2: FormGroup;

  constructor(
    protected store: Store<fromRoot.State>,
    protected route: ActivatedRoute,
    protected router: Router,
    protected snackBar: MatSnackBar,
    protected routingState: RoutingStateService,
    protected socket: SocketIoService,
    private divisionApi: DivisionService
  ) {
    super(store, route, router, snackBar, routingState, socket);
  }

  ngOnInit(): void {
    this.initForm();

    this.isFetching$ = this.store
      .select(DivisionSelectors.selectAddDivisionIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(DivisionSelectors.selectAddDivisionSucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(DivisionActions.refreshAddDivisionSucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(DivisionSelectors.selectAddDivisionError)
      .subscribe((error) => {
        if (error) {
          if (error.foundedItem) {
            this.form1.get('name').setErrors({ alreadyExists: true });
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
    super.ngOnDestroy();
    this.localitiesOptions$?.unsubscribe?.();
  }

  private initForm(): void {
    this.form1 = new FormGroup({
      name: new FormControl('', Validators.required),
    });

    this.form1
      .get('name')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value !== '') {
          this.divisionApi
            .checkName(this.form1.get('name').value)
            .pipe(take(1))
            .subscribe((response) => {
              if (response?.responseCode === responseCodes.found) {
                this.form1.get('name').markAsTouched();
                this.form1.get('name').setErrors({ alreadyExists: true });
              }
            });
        }
      });

    this.form2 = new FormGroup({
      localityId: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      house: new FormControl('', Validators.required),
    });
  }

  public sendForm1(): void {
    Object.keys(this.form1.controls).forEach((field) => {
      const control = this.form1.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1?.valid) {
      this.divisionApi
        .checkName(this.form1.get('name').value)
        .pipe(take(1))
        .subscribe((response) => {
          if (response?.responseCode === responseCodes.notFound) {
            this.setActiveForm(2);
          }
          if (response?.responseCode === responseCodes.found) {
            this.form1.get('name').setErrors({ alreadyExists: true });
          }
        });
    }
  }

  public sendForm2(): void {
    Object.keys(this.form2.controls).forEach((field) => {
      const control = this.form2.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1?.valid && this.form2?.valid) {
      this.store.dispatch(
        DivisionActions.addDivisionRequest({
          name: this.form1.get('name').value,
          localityId: this.form2.get('localityId').value,
          street: this.form2.get('street').value,
          house: this.form2.get('house').value,
        })
      );
    }
  }
}
