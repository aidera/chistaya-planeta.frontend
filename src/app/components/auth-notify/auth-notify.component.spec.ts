import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AuthNotifyComponent } from './auth-notify.component';

describe('AuthNotifyComponent', () => {
  let component: AuthNotifyComponent;
  let fixture: ComponentFixture<AuthNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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

  it('should have link to a sign-up and login pages', () => {
    const firstLink = fixture.debugElement.query(By.css('a:first-child'))
      .nativeElement;

    const secondLink = fixture.debugElement.query(By.css('a:last-child'))
      .nativeElement;

    expect(firstLink.getAttribute('href')).toBe('/login');

    expect(secondLink.getAttribute('href')).toBe('/sign-up');
  });
});
