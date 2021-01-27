import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalityItemComponent } from './locality-item.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { MaterialModule } from '../../../../modules/material/material.module';

describe('LocalityItemComponent', () => {
  let component: LocalityItemComponent;
  let fixture: ComponentFixture<LocalityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocalityItemComponent, SkeletonComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [
        provideMockStore({
          initialState: {
            locality: {
              locality: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
