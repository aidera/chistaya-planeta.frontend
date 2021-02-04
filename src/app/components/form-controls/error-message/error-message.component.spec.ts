import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../../modules/material/material.module';

import { ErrorMessageComponent } from './error-message.component';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
      imports: [MaterialModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message', () => {
    component.errorMessage = 'test error';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.mat-hint'));
    expect(element.nativeElement.textContent).toContain('test error');
  });
});
