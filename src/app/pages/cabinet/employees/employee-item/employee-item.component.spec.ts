import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EmployeeItemComponent } from './employee-item.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { ItemFieldInactiveListComponent } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from '../../../../components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemFieldInactiveStringComponent } from '../../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from '../../../../components/item-field/item-field-save-button/item-field-save-button.component';
import { NgxMaskModule } from 'ngx-mask';

describe('EmployeeItemComponent', () => {
  let component: EmployeeItemComponent;
  let fixture: ComponentFixture<EmployeeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeItemComponent,
        SkeletonComponent,
        ModalComponent,
        SelectComponent,
        ItemFieldInactiveListComponent,
        ItemFieldInactiveStatusComponent,
        ItemFieldInactiveStringComponent,
        ItemFieldSaveButtonComponent,
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
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
