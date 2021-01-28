import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ItemAddPageComponent } from './item-add-page.component';
import { MaterialModule } from '../../modules/material/material.module';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';

describe('ItemAddComponent', () => {
  let component: ItemAddPageComponent;
  let fixture: ComponentFixture<ItemAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemAddPageComponent],
      imports: [MaterialModule, RouterTestingModule],
      providers: [
        RoutingStateService,
        provideMockStore({
          initialState: {},
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has first form for active at start', () => {
    expect(component.activeForm).toBe(1);
  });
});
