import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLinkComponent } from './menu-link.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuLinkComponent', () => {
  let component: MenuLinkComponent;
  let fixture: ComponentFixture<MenuLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuLinkComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLinkComponent);
    component = fixture.componentInstance;
    component.menuLink = {
      link: 'test-link',
      iconPath: 'assets/icons/calendar.svg',
      title: 'Test title',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct link information', () => {
    const mainElement = fixture.debugElement.query(By.css('.menu-link'));
    const title = fixture.debugElement.query(By.css('p'));

    expect(mainElement).toBeTruthy();
    expect(
      mainElement.nativeElement.getAttribute('ng-reflect-router-link')
    ).toBe(component.menuLink.link);
    expect(title.nativeElement.textContent).toBe('Test title');
  });
});
