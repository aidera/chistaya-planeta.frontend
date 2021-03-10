import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemAddComponent } from './order-item-add.component';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { TextareaComponent } from '../../../../components/form-controls/textarea/textarea.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { provideMockStore } from '@ngrx/store/testing';
import { DateInputComponent } from '../../../../components/form-controls/date-input/date-input.component';

describe('OrderItemAddComponent', () => {
  let component: OrderItemAddComponent;
  let fixture: ComponentFixture<OrderItemAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderItemAddComponent,
        TextInputComponent,
        TextareaComponent,
        SelectComponent,
        CheckboxComponent,
        DateInputComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
      providers: [
        provideMockStore({
          initialState: {
            orders: {
              order: null,
            },
            offers: {
              offers: null,
            },
            services: {
              services: null,
            },
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
              offersToSelect: null,
              servicesToSelect: null,
            },
            users: {
              user: null,
              type: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
