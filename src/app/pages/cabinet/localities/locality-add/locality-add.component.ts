import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as LocalitiesActions from '../../../../store/locality/locality.actions';
import * as LocalitiesSelectors from '../../../../store/locality/locality.selectors';
import { ItemAddComponent } from '../../item-add.component';

@Component({
  selector: 'app-locality-add',
  templateUrl: './locality-add.component.html',
  styleUrls: ['./locality-add.component.scss'],
})
export class LocalityAddComponent extends ItemAddComponent implements OnInit {
  public form1Main: FormGroup;

  ngOnInit(): void {
    this.initForm();

    this.isFetching$ = this.store
      .select(LocalitiesSelectors.selectAddLocalityIsFetching)
      .subscribe((status) => {
        this.isFetching = status;
      });

    this.addingSucceed$ = this.store
      .select(LocalitiesSelectors.selectAddLocalitySucceed)
      .subscribe((status) => {
        if (status === true) {
          this.addSnackbar = this.snackBar.open('Добавлено', 'Скрыть', {
            duration: 2000,
          });

          this.store.dispatch(LocalitiesActions.refreshAddLocalitySucceed());

          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });

    this.serverError$ = this.store
      .select(LocalitiesSelectors.selectAddLocalityError)
      .subscribe((error) => {
        if (error && error.foundedItem) {
          this.form1Main.get('name').setErrors({ alreadyExists: true });
        } else if (error) {
          this.serverError = 'Ошибка сервера';
        } else {
          this.serverError = undefined;
        }
      });
  }

  private initForm(): void {
    this.form1Main = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  public sendForm1Main(): void {
    Object.keys(this.form1Main.controls).forEach((field) => {
      const control = this.form1Main.get(field);
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.form1Main && this.form1Main.get('name').value !== '') {
      this.store.dispatch(
        LocalitiesActions.addLocalityRequest({
          name: this.form1Main.get('name').value,
        })
      );
    }
  }
}
