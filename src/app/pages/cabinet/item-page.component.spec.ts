import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ItemPageComponent } from './item-page.component';
import { RoutingStateService } from '../../services/routing-state/routing-state.service';
import { SocketIoService } from '../../services/socket-io/socket-io.service';

describe('ItemPageComponent', () => {
  let component: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPageComponent],
      imports: [MatSnackBarModule, RouterTestingModule],
      providers: [
        RoutingStateService,
        SocketIoService,
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
