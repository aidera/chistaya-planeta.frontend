import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { LocalityItemComponent } from './locality-item.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { ModalComponent } from '../../../../components/modal/modal.component';

describe('LocalityItemComponent', () => {
  let component: LocalityItemComponent;
  let fixture: ComponentFixture<LocalityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocalityItemComponent, SkeletonComponent, ModalComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
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
