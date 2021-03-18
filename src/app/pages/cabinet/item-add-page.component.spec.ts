import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ItemAddPageComponent } from './item-add-page.component';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConverterService } from '../../services/converter/converter.service';
import { LocalitiesApiService } from '../../services/api/localities-api.service';
import { DivisionsApiService } from '../../services/api/divisions-api.service';
import { CarsApiService } from '../../services/api/cars-api.service';
import { EmployeesApiService } from '../../services/api/employees-api.service';
import { OptionsService } from '../../services/options/options.service';

describe('ItemAddComponent', () => {
  let component: ItemAddPageComponent;
  let fixture: ComponentFixture<ItemAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemAddPageComponent],
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        SocketIoService,
        ConverterService,
        LocalitiesApiService,
        DivisionsApiService,
        CarsApiService,
        EmployeesApiService,
        OptionsService,
        provideMockStore({
          initialState: {
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
