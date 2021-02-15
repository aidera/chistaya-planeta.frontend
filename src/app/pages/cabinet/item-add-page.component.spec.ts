import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ItemAddPageComponent } from './item-add-page.component';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConverterService } from '../../services/converter/converter.service';
import { LocalityService } from '../../services/api/locality.service';
import { DivisionService } from '../../services/api/division.service';
import { CarService } from '../../services/api/car.service';
import { EmployeeService } from '../../services/api/employee.service';

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
        RoutingStateService,
        ConverterService,
        LocalityService,
        DivisionService,
        CarService,
        EmployeeService,
        provideMockStore({
          initialState: {
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
    fixture = TestBed.createComponent(ItemAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
