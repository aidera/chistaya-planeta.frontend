import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SidebarComponent } from './sidebar.component';
import { MenuLinkComponent } from '../menu-link/menu-link.component';
import { menuLinksAll } from '../../data/menuLinks';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent, MenuLinkComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
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
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all links', () => {
    const elements = fixture.debugElement.queryAll(By.css('app-menu-link'));
    expect(elements.length).toBe(menuLinksAll.length);
  });
});
