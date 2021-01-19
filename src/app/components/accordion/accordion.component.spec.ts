import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isOpen parameter', () => {
    component.isOpen = true;
    component.toggleIsOpen();

    expect(component.isOpen).toBe(false);

    component.isOpen = false;
    component.toggleIsOpen();

    expect(component.isOpen).toBe(true);
  });

  it('should not touch initialIsOpen parameter when toggle', () => {
    component.isOpenInitial = true;
    component.isOpen = true;

    component.toggleIsOpen();

    expect(component.isOpenInitial).toBe(true);

    component.isOpen = false;
    component.toggleIsOpen();

    expect(component.isOpenInitial).toBe(true);

    component.isOpenInitial = false;
    component.isOpen = true;

    component.toggleIsOpen();

    expect(component.isOpenInitial).toBe(false);

    component.isOpen = false;
    component.toggleIsOpen();

    expect(component.isOpenInitial).toBe(false);
  });
});
