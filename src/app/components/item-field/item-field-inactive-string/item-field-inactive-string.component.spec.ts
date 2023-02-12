import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { ItemFieldInactiveStringComponent } from './item-field-inactive-string.component';

describe('ItemFieldInactiveStringComponent', () => {
  let component: ItemFieldInactiveStringComponent;
  let fixture: ComponentFixture<ItemFieldInactiveStringComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemFieldInactiveStringComponent],
        imports: [HttpClientModule, InlineSVGModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFieldInactiveStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
