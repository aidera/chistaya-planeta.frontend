import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InlineSVGModule } from 'ng-inline-svg';

import { MobileHeaderComponent } from './mobile-header.component';
import * as AppActions from '../../store/app/app.actions';

let store: MockStore;
let storeDispatchSpy: jasmine.Spy;

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
      ],
      imports: [InlineSVGModule.forRoot()],
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
