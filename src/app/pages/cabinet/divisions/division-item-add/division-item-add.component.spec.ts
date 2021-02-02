import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { DivisionItemAddComponent } from './division-item-add.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { SelectComponent } from '../../../../components/form-controls/select/select.component';

describe('DivisionItemAddComponent', () => {
  let component: DivisionItemAddComponent;
  let fixture: ComponentFixture<DivisionItemAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DivisionItemAddComponent,
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
            app: {
              localitiesOptionsToSelect: [
                { value: '1', text: 'City 1' },
                { value: '2', text: 'City 2' },
              ],
            },
            division: {
              division: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
