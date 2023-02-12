import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PricesComponent } from './prices.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';

describe('PricesComponent', () => {
  let component: PricesComponent;
  let fixture: ComponentFixture<PricesComponent>;

  beforeEach(
    waitForAsync(() => {
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
              users: {
                user: null,
                type: null,
              },
            },
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
