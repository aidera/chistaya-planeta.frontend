import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksComponent } from './tasks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [BrowserAnimationsModule, MaterialModule, RouterTestingModule],
      providers: [
        SocketIoService,
        provideMockStore({
          initialState: {
            tasks: {
              tasks: null,
            },
            users: {
              user: null,
            },
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
