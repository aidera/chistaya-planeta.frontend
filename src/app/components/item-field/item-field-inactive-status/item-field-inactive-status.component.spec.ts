import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ItemFieldInactiveStatusComponent } from './item-field-inactive-status.component';

describe('ItemFieldInactiveStatusComponent', () => {
  let component: ItemFieldInactiveStatusComponent;
  let fixture: ComponentFixture<ItemFieldInactiveStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFieldInactiveStatusComponent],
      imports: [HttpClientModule, InlineSVGModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFieldInactiveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
