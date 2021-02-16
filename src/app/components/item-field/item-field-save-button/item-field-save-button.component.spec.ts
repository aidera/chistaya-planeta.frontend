import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFieldSaveButtonComponent } from './item-field-save-button.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

describe('ItemFieldSaveButtonComponent', () => {
  let component: ItemFieldSaveButtonComponent;
  let fixture: ComponentFixture<ItemFieldSaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFieldSaveButtonComponent],
      imports: [HttpClientModule, InlineSVGModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFieldSaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
