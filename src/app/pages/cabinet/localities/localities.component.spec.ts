import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

import { LocalitiesComponent } from './localities.component';
import { TablePageComponent } from '../../table-page.component';
import { ConverterService } from '../../../services/converter.service';
import { TableComponent } from '../../../components/table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../modules/material/material.module';
import { TextInputComponent } from '../../../components/form-controls/text-input/text-input.component';
import { DateTimeInputComponent } from '../../../components/form-controls/date-time-input/date-time-input.component';
import { SelectComponent } from '../../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../../components/form-controls/checkbox/checkbox.component';

describe('LocalitiesComponent', () => {
  let component: LocalitiesComponent;
  let fixture: ComponentFixture<LocalitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LocalitiesComponent,
        TablePageComponent,
        TableComponent,
        TextInputComponent,
        DateTimeInputComponent,
        SelectComponent,
        CheckboxComponent,
      ],
      providers: [
        { provide: ConverterService },
        provideMockStore({
          initialState: {
            locality: {
              localities: [],
            },
          },
        }),
      ],
      imports: [
        FormsModule,
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
    fixture = TestBed.createComponent(LocalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
