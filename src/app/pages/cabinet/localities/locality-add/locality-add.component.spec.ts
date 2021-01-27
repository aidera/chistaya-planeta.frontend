import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalityAddComponent } from './locality-add.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { TextInputComponent } from '../../../../components/form-controls/text-input/text-input.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LocalityAddComponent', () => {
  let component: LocalityAddComponent;
  let fixture: ComponentFixture<LocalityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocalityAddComponent, TextInputComponent],
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
            locality: {
              locality: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalityAddComponent);
    component = fixture.componentInstance;
    component.form1Main = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
