import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ItemPageComponent } from './item-page.component';
import { MaterialModule } from '../modules/material/material.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('ItemPageComponent', () => {
  let component: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPageComponent],
      imports: [MaterialModule, RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: {},
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPageComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active field', () => {
    component.setActiveField('name');
    expect(component.activeField).toBe('name');
  });

  it('should remove active field', () => {
    component.activeField = 'name';
    component.removeActiveField('name', 'some value');
    expect(component.activeField).toBe(null);
  });

  it('should remove active field and set form value', () => {
    component.activeField = 'name';
    fixture.detectChanges();

    component.removeActiveField('name', 'some value');
    fixture.detectChanges();

    expect(component.activeField).toBe(null);
    expect(component.form.get('name').value).toBe('some value');
  });
});
