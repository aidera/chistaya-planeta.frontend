import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';

import { ScheduledOrderItemComponent } from './scheduled-order-item.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { ItemFieldInactiveListComponent } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from '../../../../components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemFieldInactiveStringComponent } from '../../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from '../../../../components/item-field/item-field-save-button/item-field-save-button.component';
import { ItemNotFoundComponent } from '../../../../components/item-not-found/item-not-found.component';
import { PhonePipe } from '../../../../pipes/phone.pipe';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { TextareaComponent } from '../../../../components/form-controls/textarea/textarea.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { OptionsService } from '../../../../services/options/options.service';

describe('ScheduledOrderItemComponent', () => {
  let component: ScheduledOrderItemComponent;
  let fixture: ComponentFixture<ScheduledOrderItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ScheduledOrderItemComponent,
          SkeletonComponent,
          ModalComponent,
          SelectComponent,
          ItemFieldInactiveListComponent,
          ItemFieldInactiveStatusComponent,
          ItemFieldInactiveStringComponent,
          ItemFieldSaveButtonComponent,
          ItemNotFoundComponent,
          PhonePipe,
          TextInputComponent,
          TextareaComponent,
        ],
        imports: [
          BrowserAnimationsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          MaterialModule,
          HttpClientModule,
          InlineSVGModule.forRoot(),
          NgxMaskModule.forRoot(),
        ],
        providers: [
          OptionsService,
          provideMockStore({
            initialState: {
              scheduledOrders: {
                scheduledOrder: null,
              },
              app: {
                localitiesToSelect: null,
                divisionsToSelect: null,
                carsToSelect: null,
                employeesToSelect: null,
              },
              users: {
                user: null,
                type: null,
              },
              offers: {
                offers: null,
              },
              services: {
                services: null,
              },
            },
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
