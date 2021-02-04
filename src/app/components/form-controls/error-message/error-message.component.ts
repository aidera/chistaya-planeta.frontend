import { Component, Input } from '@angular/core';

/* --- SIMPLE ERROR --- */
/* Use errorMessages in each control to display simple text error */
/* For example: */
/*
<app-text-input
  label="Название"
  [control]="form1.get('name')"
  [errorMessages]="{
    required: 'Обязательное поле',
    alreadyExists: 'Такое поле уже сузествует'
  }"
></app-text-input>
 */

/* --- CUSTOM ERROR --- */
/* If you want to make custom error with router link may be, use ng-content with error attribute */
/* For example: */
/*
<app-text-input
  label="Название"
  [control]="form1.get('name')"
  [errorMessages]="{
    required: 'Обязательное поле'
  }"
>
  <ng-container error *ngIf="form1.get('name')?.errors?.alreadyExists">
    Такое <a [routerLink]="['../../', 'divisions', alreadyExistId]">подразделение</a> уже существует.
  </ng-container>
</app-text-input>
 */

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() errorMessage: string;
}
