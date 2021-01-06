import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

import { OrderComponent } from './order.component';
import { TextInputComponent } from '../../components/form-controls/text-input/text-input.component';
import { DateInputComponent } from '../../components/form-controls/date-input/date-input.component';
import { SelectComponent } from '../../components/form-controls/select/select.component';
import { CheckboxComponent } from '../../components/form-controls/checkbox/checkbox.component';
import { AuthNotifyComponent } from '../../components/auth-notify/auth-notify.component';

let store: MockStore;

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderComponent,
        TextInputComponent,
        DateInputComponent,
        SelectComponent,
        CheckboxComponent,
        AuthNotifyComponent,
      ],
      imports: [
        RouterTestingModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            order: {
              addOrderLocalities: [],
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;

    component.ngOnInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
