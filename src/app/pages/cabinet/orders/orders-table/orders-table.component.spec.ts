import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';

import { OrdersTableComponent } from './orders-table.component';
import { TablePageComponent } from '../../table-page.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { OptionsService } from '../../../../services/options/options.service';
import { ConverterService } from '../../../../services/converter/converter.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';

describe('OrdersComponent', () => {
  let component: OrdersTableComponent;
  let fixture: ComponentFixture<OrdersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrdersTableComponent,
        TablePageComponent,
        TableComponent,
        TextInputComponent,
        DateTimeInputComponent,
        SelectComponent,
        CheckboxComponent,
      ],
      providers: [
        OptionsService,
        { provide: ConverterService },
        provideMockStore({
          initialState: {
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
            },
            orders: {
              orders: [],
            },
            users: {
              user: null,
              type: null,
            },
          },
        }),
      ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
