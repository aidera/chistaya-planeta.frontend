import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store/root.reducer';
import * as TasksSelectors from '../../../store/tasks/tasks.selectors';
import * as TasksActions from '../../../store/tasks/tasks.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';
import * as UsersActions from '../../../store/users/users.actions';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import { Subscription } from 'rxjs';
import { IEmployee } from '../../../models/Employee';
import { IOrderLessInfo } from '../../../models/Order';
import OrderStatus from '../../../models/enums/OrderStatus';
import { orderStatusStrings } from '../../../data/orderStatusData';
import { orderTypeStrings } from '../../../data/orderTypeData';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  private user$: Subscription;
  private user: IEmployee;

  private tasks$: Subscription;
  private tasks: IOrderLessInfo[];
  private tasksAreFetching$: Subscription;
  public tasksAreFetching: boolean;

  public tasksWithRawStatus: IOrderLessInfo[];
  public tasksWithInProgressStatus: IOrderLessInfo[];
  public tasksWithCompletedStatus: IOrderLessInfo[];
  public tasksWithRefusedStatus: IOrderLessInfo[];

  public orderTypeStrings = orderTypeStrings;
  public orderStatusStrings = orderStatusStrings;

  constructor(
    private store: Store<fromRoot.State>,
    private socket: SocketIoService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TasksActions.getTasksRequest());

    this.user$ = this.store
      .select(UsersSelectors.selectUser)
      .subscribe((user) => {
        this.user = user as IEmployee;
      });

    this.tasks$ = this.store
      .select(TasksSelectors.selectTasks)
      .subscribe((tasks) => {
        this.tasks = tasks;

        this.tasksWithRawStatus = this.getTasksWithRawStatus();
        this.tasksWithInProgressStatus = this.getTasksWithInProgressStatus();
        this.tasksWithCompletedStatus = this.getTasksWithCompletedStatus();
        this.tasksWithRefusedStatus = this.getTasksWithRefusedStatus();
      });

    this.tasksAreFetching$ = this.store
      .select(TasksSelectors.selectGetTasksAreFetching)
      .subscribe((status) => {
        this.tasksAreFetching = status;
      });

    this.socket.get()?.on('orders', (data) => {
      if (data.action === 'add' || data.action === 'delete') {
        this.store.dispatch(TasksActions.getTasksRequest());
      }
      if (data.action === 'update' && data.id) {
        if (this.tasks && this.tasks.length > 0) {
          const isExist = this.tasks.find((order) => {
            return order._id === data.id;
          });
          if (isExist) {
            this.store.dispatch(TasksActions.getTasksRequest());
          }
        }
      }
    });

    this.socket.get()?.on('employees', (data) => {
      if (data.action === 'update' && data.id) {
        if (this.user?._id === data.id) {
          this.store.dispatch(UsersActions.getUserRequest());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.user$?.unsubscribe?.();
    this.tasks$?.unsubscribe?.();
    this.tasksAreFetching$?.unsubscribe?.();

    this.socket.get()?.off('employees');
    this.socket.get()?.off('orders');
  }

  public getTasksWithRawStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter((task) => task.status === OrderStatus.raw);
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithInProgressStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter(
        (task) =>
          task.status === OrderStatus.processed ||
          task.status === OrderStatus.inTransit ||
          task.status === OrderStatus.packed ||
          task.status === OrderStatus.delivered ||
          task.status === OrderStatus.weighed
      );
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithCompletedStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter(
        (task) => task.status === OrderStatus.completed
      );
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithRefusedStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter((task) => {
        return (
          task.status === OrderStatus.refused ||
          task.status === OrderStatus.cancelled
        );
      });
      return tasksCopy;
    }
    return [];
  }
}
