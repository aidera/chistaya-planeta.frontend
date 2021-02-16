import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ItemFieldInactiveListComponent } from './item-field-inactive-list.component';

describe('ItemFieldInactiveListComponent', () => {
  let component: ItemFieldInactiveListComponent;
  let fixture: ComponentFixture<ItemFieldInactiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFieldInactiveListComponent],
      imports: [HttpClientModule, InlineSVGModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFieldInactiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
