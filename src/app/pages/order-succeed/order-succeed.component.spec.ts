import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSucceedComponent } from './order-succeed.component';

describe('OrderSucceedComponent', () => {
  let component: OrderSucceedComponent;
  let fixture: ComponentFixture<OrderSucceedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSucceedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSucceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
