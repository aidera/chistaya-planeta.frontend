import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarsTableComponent } from './cars-table.component';
import { TablePageComponent } from '../../table-page.component';
import { ConverterService } from '../../../../services/converter/converter.service';
import { TableComponent } from '../../../../components/table/table.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { OptionsService } from '../../../../services/options/options.service';

describe('CarsTableComponent', () => {
  let component: CarsTableComponent;
  let fixture: ComponentFixture<CarsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarsTableComponent,
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
            cars: {
              cars: [],
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
    fixture = TestBed.createComponent(CarsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.ngZone.run(() => {
      component.ngOnInit();
      expect(component).toBeTruthy();
    });
  });
});
