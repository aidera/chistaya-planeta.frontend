import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';

import { SignUpComponent } from './sign-up.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent, TextInputComponent],
      imports: [
        MatButtonModule,
        RouterTestingModule,
        ReactiveFormsModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
        HttpClientModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            users: {
              isLoginSucceed: false,
              isLoggingIn: false,
              user: null,
              type: null,
              serverError: null,
              isRegistering: false,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
