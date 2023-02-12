import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';

import { ScheduledOrdersTableComponent } from './scheduled-orders-table.component';
import { TablePageComponent } from '../../table-page.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { OptionsService } from '../../../../services/options/options.service';
import { MaterialModule } from '../../../../modules/material/material.module';
import { GettersService } from '../../../../services/getters/getters.service';

describe('ScheduledOrdersTableComponent', () => {
  let component: ScheduledOrdersTableComponent;
  let fixture: ComponentFixture<ScheduledOrdersTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ScheduledOrdersTableComponent,
          TablePageComponent,
          TableComponent,
          TextInputComponent,
          DateTimeInputComponent,
          SelectComponent,
          CheckboxComponent,
        ],
        providers: [
          OptionsService,
          { provide: GettersService },
          provideMockStore({
            initialState: {
              app: {
                localitiesToSelect: null,
              },
              scheduledOrders: {
                scheduledOrders: [],
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
