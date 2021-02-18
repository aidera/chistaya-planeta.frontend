import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesComponent } from './prices.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';

describe('PricesComponent', () => {
  let component: PricesComponent;
  let fixture: ComponentFixture<PricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricesComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        InlineSVGModule.forRoot(),
      ],
      providers: [
        SocketIoService,
        provideMockStore({
          initialState: {
            offers: {
              offers: null,
            },
            services: {
              services: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
