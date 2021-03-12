import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { provideMockStore } from '@ngrx/store/testing';

import { OrderItemWeighComponent } from './order-item-weigh.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { ItemFieldInactiveListComponent } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from '../../../../components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemFieldInactiveStringComponent } from '../../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from '../../../../components/item-field/item-field-save-button/item-field-save-button.component';
import { ItemNotFoundComponent } from '../../../../components/item-not-found/item-not-found.component';
import { PhonePipe } from '../../../../pipes/phone.pipe';
import { MaterialModule } from '../../../../modules/material/material.module';
import { OptionsService } from '../../../../services/options/options.service';

describe('OrderItemWeighComponent', () => {
  let component: OrderItemWeighComponent;
  let fixture: ComponentFixture<OrderItemWeighComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderItemWeighComponent,
        SkeletonComponent,
        ModalComponent,
        SelectComponent,
        ItemFieldInactiveListComponent,
        ItemFieldInactiveStatusComponent,
        ItemFieldInactiveStringComponent,
        ItemFieldSaveButtonComponent,
        ItemNotFoundComponent,
        PhonePipe,
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
            orders: {
              order: null,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemWeighComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
