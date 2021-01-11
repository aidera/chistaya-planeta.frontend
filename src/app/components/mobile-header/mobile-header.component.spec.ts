import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { MobileHeaderComponent } from './mobile-header.component';
import * as AppActions from '../../store/app/app.actions';

let store: MockStore;
let storeDispatchSpy: jasmine.Spy;
const locationStub = {
  back: jasmine.createSpy('back'),
};

describe('MobileHeaderComponent', () => {
  let component: MobileHeaderComponent;
  let fixture: ComponentFixture<MobileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileHeaderComponent],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              isFullscreenMenuOpen: false,
            },
          },
        }),
        { provide: Location, useValue: locationStub },
      ],
      imports: [HttpClientModule, InlineSVGModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MobileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display backlink if this parameter is true', () => {
    component.useBacklink = true;
    fixture.detectChanges();

    let backlink = fixture.debugElement.query(
      By.css('.mobile-header__backlink')
    );
    expect(backlink).toBeTruthy();

    component.useBacklink = false;
    fixture.detectChanges();

    backlink = fixture.debugElement.query(By.css('.mobile-header__backlink'));
    expect(backlink).toBeFalsy();
  });

  it('should call location back, when goToPreviousPage function called', () => {
    component.goToPreviousPage();
    fixture.detectChanges();
    const location = fixture.debugElement.injector.get(Location);
    expect(location.back).toHaveBeenCalled();
  });

  it('should call goToPreviousPage function, when user clicks on backlink button', () => {
    spyOn(component, 'goToPreviousPage');

    component.useBacklink = true;
    fixture.detectChanges();

    const backlink = fixture.debugElement.query(
      By.css('.mobile-header__backlink')
    ).nativeElement;
    backlink.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.goToPreviousPage).toHaveBeenCalled();
  });

  it('should dispatch a store action to close fullscreen menu', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.isFullscreenMenuOpen = true;
    fixture.detectChanges();
    component.toggleFullscreenMenu();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      AppActions.setIsFullscreenMenuOpen({
        isOpen: false,
      })
    );
  });

  it('should dispatch a store action to open fullscreen menu', () => {
    storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    component.isFullscreenMenuOpen = false;
    fixture.detectChanges();
    component.toggleFullscreenMenu();
    fixture.detectChanges();

    expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
    expect(storeDispatchSpy).toHaveBeenCalledWith(
      AppActions.setIsFullscreenMenuOpen({
        isOpen: true,
      })
    );
  });
});
