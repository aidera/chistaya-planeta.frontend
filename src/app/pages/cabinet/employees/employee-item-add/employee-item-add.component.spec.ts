import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeItemAddComponent } from './employee-item-add.component';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { provideMockStore } from '@ngrx/store/testing';
import { CheckboxComponent } from '../../../../components/form-controls/checkbox/checkbox.component';

describe('EmployeeItemAddComponent', () => {
  let component: EmployeeItemAddComponent;
  let fixture: ComponentFixture<EmployeeItemAddComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          EmployeeItemAddComponent,
          TextInputComponent,
          SelectComponent,
          CheckboxComponent,
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
              employees: {
                employee: null,
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
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
