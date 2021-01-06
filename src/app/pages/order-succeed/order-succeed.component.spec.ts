import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterTestingModule } from '@angular/router/testing';

import { OrderSucceedComponent } from './order-succeed.component';
import { AuthNotifyComponent } from '../../components/auth-notify/auth-notify.component';

let store: MockStore;

describe('OrderSucceedComponent', () => {
  let component: OrderSucceedComponent;
  let fixture: ComponentFixture<OrderSucceedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSucceedComponent, AuthNotifyComponent],
      imports: [
        InlineSVGModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
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
    fixture = TestBed.createComponent(OrderSucceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
