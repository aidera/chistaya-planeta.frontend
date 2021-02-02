import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DivisionItemComponent } from './division-item.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';

describe('DivisionItemComponent', () => {
  let component: DivisionItemComponent;
  let fixture: ComponentFixture<DivisionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionItemComponent, SkeletonComponent, ModalComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              localitiesOptionsToSelect: [
                { value: '1', text: 'City 1' },
                { value: '2', text: 'City 2' },
              ],
            },
            division: {
              division: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
