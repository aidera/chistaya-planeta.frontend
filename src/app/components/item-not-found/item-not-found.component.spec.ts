import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ItemNotFoundComponent } from './item-not-found.component';
import { MaterialModule } from '../../modules/material/material.module';

describe('ItemNotFoundComponent', () => {
  let component: ItemNotFoundComponent;
  let fixture: ComponentFixture<ItemNotFoundComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemNotFoundComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientModule,
          MaterialModule,
          InlineSVGModule.forRoot(),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
