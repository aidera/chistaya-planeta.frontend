import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalityComponent } from './locality.component';
import { SkeletonComponent } from '../../../components/skeleton/skeleton.component';
import { MaterialModule } from '../../../modules/material/material.module';

describe('LocalityComponent', () => {
  let component: LocalityComponent;
  let fixture: ComponentFixture<LocalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocalityComponent, SkeletonComponent],
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
    fixture = TestBed.createComponent(LocalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
