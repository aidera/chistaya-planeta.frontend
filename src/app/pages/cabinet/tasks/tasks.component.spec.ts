import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { TasksComponent } from './tasks.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
