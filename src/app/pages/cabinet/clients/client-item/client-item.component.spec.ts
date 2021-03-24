import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';

import { ClientItemComponent } from './client-item.component';
import { SkeletonComponent } from '../../../../components/skeleton/skeleton.component';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { ItemFieldInactiveListComponent } from '../../../../components/item-field/item-field-inactive-list/item-field-inactive-list.component';
import { ItemFieldInactiveStatusComponent } from '../../../../components/item-field/item-field-inactive-status/item-field-inactive-status.component';
import { ItemFieldInactiveStringComponent } from '../../../../components/item-field/item-field-inactive-string/item-field-inactive-string.component';
import { ItemFieldSaveButtonComponent } from '../../../../components/item-field/item-field-save-button/item-field-save-button.component';
import { ItemNotFoundComponent } from '../../../../components/item-not-found/item-not-found.component';
import { MaterialModule } from '../../../../modules/material/material.module';
import { OptionsService } from '../../../../services/options/options.service';
import { TextareaComponent } from '../../../../components/form-controls/textarea/textarea.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ClientItemComponent', () => {
  let component: ClientItemComponent;
  let fixture: ComponentFixture<ClientItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClientItemComponent,
        SkeletonComponent,
        ModalComponent,
        ItemFieldInactiveListComponent,
        ItemFieldInactiveStatusComponent,
        ItemFieldInactiveStringComponent,
        ItemFieldSaveButtonComponent,
        ItemNotFoundComponent,
        TextareaComponent,
      ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
      providers: [
        OptionsService,
        provideMockStore({
          initialState: {
            clients: {
              client: null,
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
    fixture = TestBed.createComponent(ClientItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
