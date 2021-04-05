import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxMaskModule } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProfileComponent } from './profile.component';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import { LocalitiesApiService } from '../../../services/api/localities-api.service';
import { DivisionsApiService } from '../../../services/api/divisions-api.service';
import { CarsApiService } from '../../../services/api/cars-api.service';
import { EmployeesApiService } from '../../../services/api/employees-api.service';
import { OptionsService } from '../../../services/options/options.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ItemFieldInactiveStringComponent } from '../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldInactiveListComponent } from '../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { TextInputComponent } from '../../../components/form-controls/text-input/text-input.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { GettersService } from '../../../services/getters/getters.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        ModalComponent,
        ItemFieldInactiveStringComponent,
        ItemFieldInactiveListComponent,
        TextInputComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        InlineSVGModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
      providers: [
        SocketIoService,
        GettersService,
        LocalitiesApiService,
        DivisionsApiService,
        CarsApiService,
        EmployeesApiService,
        OptionsService,
        provideMockStore({
          initialState: {
            users: {
              type: null,
              user: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
