import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

import { ItemPageComponent } from './item-page.component';

describe('ItemPageComponent', () => {
  let component: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPageComponent],
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            app: {
              localitiesToSelect: null,
              divisionsToSelect: null,
              carsToSelect: null,
              employeesToSelect: null,
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
