import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RestorePasswordComponent } from './restore-password.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';

describe('RestorePasswordComponent', () => {
  let component: RestorePasswordComponent;
  let fixture: ComponentFixture<RestorePasswordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RestorePasswordComponent, TextInputComponent],
        imports: [
          MatSnackBarModule,
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RestorePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
