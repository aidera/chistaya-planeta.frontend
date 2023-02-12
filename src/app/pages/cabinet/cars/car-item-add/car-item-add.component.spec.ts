import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarItemAddComponent } from './car-item-add.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';

describe('CarItemAddComponent', () => {
  let component: CarItemAddComponent;
  let fixture: ComponentFixture<CarItemAddComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          CarItemAddComponent,
          TextInputComponent,
          SelectComponent,
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
              cars: {
                car: null,
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
    fixture = TestBed.createComponent(CarItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
