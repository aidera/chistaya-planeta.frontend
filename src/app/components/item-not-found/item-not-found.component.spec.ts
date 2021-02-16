import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ItemNotFoundComponent } from './item-not-found.component';

describe('ItemNotFoundComponent', () => {
  let component: ItemNotFoundComponent;
  let fixture: ComponentFixture<ItemNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemNotFoundComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
