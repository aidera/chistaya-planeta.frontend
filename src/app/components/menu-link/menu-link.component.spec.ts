import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as AppActions from '../../store/app/app.actions';
import { MenuLinkComponent } from './menu-link.component';
import { EmployeeRole } from '../../models/enums/EmployeeRole';

let store: MockStore;
let storeDispatchSpy: jasmine.Spy;

describe('MenuLinkComponent', () => {
  let component: MenuLinkComponent;
  let fixture: ComponentFixture<MenuLinkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MenuLinkComponent],
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
            },
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MenuLinkComponent);
    component = fixture.componentInstance;
    component.isEmployee = true;
    component.employeeRole = EmployeeRole.head;
    component.menuLink = {
      link: 'test-link',
      iconPath: 'assets/icons/calendar.svg',
      title: 'Test title',
      clientCanSee: true,
      employeesCanSee: [
        EmployeeRole.head,
        EmployeeRole.admin,
        EmployeeRole.clientManager,
        EmployeeRole.driver,
        EmployeeRole.receivingManager,
      ],
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
    expect(title.nativeElement.textContent).toBe('Test title');
  });

  it('should dispatch a close fullscreen menu action', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.closeFullscreenMenu();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      AppActions.setIsFullscreenMenuOpen({ isOpen: false })
    );
  });
});
