import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';

import { CabinetLayoutComponent } from './cabinet-layout.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MobileHeaderComponent } from '../../components/mobile-header/mobile-header.component';
import { FullscreenMenuComponent } from '../../components/fullscreen-menu/fullscreen-menu.component';
import { MenuLinkComponent } from '../../components/menu-link/menu-link.component';

let store: MockStore;

describe('CabinetLayoutComponent', () => {
  let component: CabinetLayoutComponent;
  let fixture: ComponentFixture<CabinetLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CabinetLayoutComponent,
        SidebarComponent,
        MobileHeaderComponent,
        FullscreenMenuComponent,
        MenuLinkComponent,
      ],
      imports: [
        RouterTestingModule,
        InlineSVGModule.forRoot(),
        HttpClientModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              isFullscreenMenuOpen: false,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CabinetLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
