import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthNotifyComponent } from './auth-notify.component';

describe('AuthNotifyComponent', () => {
  let component: AuthNotifyComponent;
  let fixture: ComponentFixture<AuthNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthNotifyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
