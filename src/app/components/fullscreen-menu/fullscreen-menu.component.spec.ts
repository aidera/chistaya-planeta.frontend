import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterTestingModule } from '@angular/router/testing';

import { FullscreenMenuComponent } from './fullscreen-menu.component';
import { MenuLinkComponent } from '../menu-link/menu-link.component';
import { menuLinksAll } from '../../data/menuLinks';

let store: MockStore;

describe('FullscreenMenuComponent', () => {
  let component: FullscreenMenuComponent;
  let fixture: ComponentFixture<FullscreenMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullscreenMenuComponent, MenuLinkComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              isFullscreenMenuOpen: false,
            },
            users: {
              user: null,
              type: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(FullscreenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be displayed if isFullscreenMenuOpen parameter is true', () => {
    component.isFullscreenMenuOpen = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.fullscreen-menu'));
    expect(element).toBeTruthy();
  });

  it('should not be displayed if isFullscreenMenuOpen parameter is false', () => {
    component.isFullscreenMenuOpen = false;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.fullscreen-menu'));
    expect(element).toBeFalsy();
  });

  it('should display all links', () => {
    component.isFullscreenMenuOpen = true;
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('app-menu-link'));
    expect(elements.length).toBe(menuLinksAll.length);
  });
});
