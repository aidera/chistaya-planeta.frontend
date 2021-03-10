import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DivisionItemComponent } from './division-item.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { ItemFieldInactiveListComponent } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from '../../../../components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemFieldInactiveStringComponent } from '../../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from '../../../../components/item-field/item-field-save-button/item-field-save-button.component';
import { ItemNotFoundComponent } from '../../../../components/item-not-found/item-not-found.component';
import { OptionsService } from '../../../../services/options/options.service';

describe('DivisionItemComponent', () => {
  let component: DivisionItemComponent;
  let fixture: ComponentFixture<DivisionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DivisionItemComponent,
        SkeletonComponent,
        ModalComponent,
        ItemFieldInactiveListComponent,
        ItemFieldInactiveStatusComponent,
        ItemFieldInactiveStringComponent,
        ItemFieldSaveButtonComponent,
        ItemNotFoundComponent,
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
      providers: [
        OptionsService,
        provideMockStore({
          initialState: {
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
            },
            divisions: {
              division: null,
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
    fixture = TestBed.createComponent(DivisionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
