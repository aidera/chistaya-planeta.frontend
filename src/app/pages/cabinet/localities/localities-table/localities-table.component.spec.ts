import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LocalitiesTableComponent } from './localities-table.component';
import { TablePageComponent } from '../../table-page.component';
import { TableComponent } from '../../../../components/table/table.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';
import { OptionsService } from '../../../../services/options/options.service';
import { GettersService } from '../../../../services/getters/getters.service';

describe('LocalitiesTableComponent', () => {
  let component: LocalitiesTableComponent;
  let fixture: ComponentFixture<LocalitiesTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          LocalitiesTableComponent,
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
                divisionsToSelect: null,
                carsToSelect: null,
                employeesToSelect: null,
              },
              localities: {
                localities: [],
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
    fixture = TestBed.createComponent(LocalitiesTableComponent);
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
