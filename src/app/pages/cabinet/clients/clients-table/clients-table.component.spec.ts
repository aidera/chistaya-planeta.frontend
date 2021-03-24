import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';

import { ClientsTableComponent } from './clients-table.component';
import { TablePageComponent } from '../../table-page.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { ErrorMessageComponent } from '../../../../components/form-controls/error-message/error-message.component';
import { OptionsService } from '../../../../services/options/options.service';
import { ConverterService } from '../../../../services/converter/converter.service';
import { MaterialModule } from '../../../../modules/material/material.module';

describe('ClientsTableComponent', () => {
  let component: ClientsTableComponent;
  let fixture: ComponentFixture<ClientsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClientsTableComponent,
        TablePageComponent,
        TableComponent,
        TextInputComponent,
        DateTimeInputComponent,
        SelectComponent,
        CheckboxComponent,
        ErrorMessageComponent,
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
            users: {
              user: null,
              type: null,
            },
            clients: {
              clients: [],
              client: null,
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
    fixture = TestBed.createComponent(ClientsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
