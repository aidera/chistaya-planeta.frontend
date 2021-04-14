import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as UsersActions from '../../store/users/users.actions';
import { LoginComponent } from './login.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';
import { UserType } from '../../models/enums/UserType';
import { MaterialModule } from '../../modules/material/material.module';
import { ErrorMessageComponent } from '../../components/form-controls/error-message/error-message.component';

let store: MockStore;
let storeDispatchSpy: jasmine.Spy;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, TextInputComponent, ErrorMessageComponent],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
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
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has employee identification, if the page belongs to the employees flow', () => {
    component.isEmployee = true;
    fixture.detectChanges();

    const identification = fixture.debugElement.query(By.css('h1'))
      .nativeElement;

    expect(identification.textContent).toBe('Авторизация сотрудника');
  });

  it('should not has employee identification, if the page belongs to the client flow', () => {
    component.isEmployee = false;
    fixture.detectChanges();

    const identification = fixture.debugElement.query(By.css('h1'))
      .nativeElement;

    expect(identification.textContent).toBe('Авторизация');
  });

  it('should has required validation error, if the email field is empty', () => {
    const field = component.form.get('login');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has required validation error, if the password field is empty', () => {
    const field = component.form.get('password');

    field.setValue('');
    fixture.detectChanges();

    expect(field.errors.required).toBeTruthy();
  });

  it('should has minlength validation error, if the password is less than 6', () => {
    const field = component.form.get('password');

    field.setValue('test');
    fixture.detectChanges();

    expect(field.errors.minlength).toBeTruthy();
  });

  it('should dispatch an employee login action if the fields are correct', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.isEmployee = true;
    component.form.controls.login.setValue('test@test.test');
    component.form.controls.password.setValue('987987987');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      UsersActions.loginRequest({
        userType: UserType.employee,
        password: '987987987',
        login: 'test@test.test',
      })
    );
  });

  it('should dispatch a client login action if the fields are correct', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.isEmployee = false;
    component.form.controls.login.setValue('test@test.test');
    component.form.controls.password.setValue('987987987');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      UsersActions.loginRequest({
        userType: UserType.client,
        password: '987987987',
        login: 'test@test.test',
      })
    );
  });

  it('should not dispatch a client login action if the fields are not correct', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.form.controls.login.setValue('test@t.t');
    component.form.controls.password.setValue('9987');
    fixture.detectChanges();

    component.submit();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(0);
  });
});
