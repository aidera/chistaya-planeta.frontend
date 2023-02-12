import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalComponent],
        imports: [BrowserAnimationsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display background if isOpen is true', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const background1 = fixture.debugElement.query(
      By.css('.modal__background')
    );
    expect(background1).toBeFalsy();

    component.isOpen = true;
    fixture.detectChanges();
    const background2 = fixture.debugElement.query(
      By.css('.modal__background')
    );
    expect(background2).toBeTruthy();
  });

  it('should display base if isOpen is true', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const base1 = fixture.debugElement.query(By.css('.modal__base'));
    expect(base1).toBeFalsy();

    component.isOpen = true;
    fixture.detectChanges();
    const base = fixture.debugElement.query(By.css('.modal__base'));
    expect(base).toBeTruthy();
  });

  it('should display only one resolve button', () => {
    component.isOpen = true;
    component.resolveButtonText = 'OK';
    fixture.detectChanges();
    const actions = fixture.debugElement.queryAll(
      By.css('.modal__actions button')
    );
    expect(actions.length).toBe(1);
  });

  it('should display only one reject button', () => {
    component.isOpen = true;
    component.rejectButtonText = 'NO';
    fixture.detectChanges();
    const actions = fixture.debugElement.queryAll(
      By.css('.modal__actions button')
    );
    expect(actions.length).toBe(1);
  });

  it('should display both buttons', () => {
    component.isOpen = true;
    component.resolveButtonText = 'YES';
    component.rejectButtonText = 'NO';
    fixture.detectChanges();
    const actions = fixture.debugElement.queryAll(
      By.css('.modal__actions button')
    );
    expect(actions.length).toBe(2);
  });
});
