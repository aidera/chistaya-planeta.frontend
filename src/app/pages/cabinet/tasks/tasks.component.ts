import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../../store/root.reducer';
import * as TasksSelectors from '../../../store/tasks/tasks.selectors';
import * as TasksActions from '../../../store/tasks/tasks.actions';
import * as UsersSelectors from '../../../store/users/users.selectors';
import * as UsersActions from '../../../store/users/users.actions';
import { SocketIoService } from '../../../services/socket-io/socket-io.service';
import { IEmployee } from '../../../models/Employee';
import { IOrderLessInfo } from '../../../models/Order';
import OrderStatus from '../../../models/enums/OrderStatus';
import { orderStatusStrings } from '../../../data/orderStatusData';
import { orderTypeStrings } from '../../../data/orderTypeData';
import EmployeeRole from '../../../models/enums/EmployeeRole';
import { IDivision } from '../../../models/Division';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  public user: IEmployee;

  private tasks$: Subscription;
  private tasks: IOrderLessInfo[];
  private tasksAreFetching$: Subscription;
  public tasksAreFetching: boolean;

  public tasksNew: IOrderLessInfo[];
  public tasksWithRawStatus: IOrderLessInfo[];
  public tasksWithInProgressStatus: IOrderLessInfo[];
  public tasksToDelivery: IOrderLessInfo[];
  public tasksWithInTransitStatus: IOrderLessInfo[];
  public tasksWithDeliveredStatus: IOrderLessInfo[];
  public tasksWithDeliveredStatusAndCurrentDivision: IOrderLessInfo[];
  public tasksWithWeighedStatus: IOrderLessInfo[];
  public tasksWithCompletedStatus: IOrderLessInfo[];
  public tasksWithRefusedStatus: IOrderLessInfo[];

  public dateNow = new Date();

  public employeeRole = EmployeeRole;
  public orderTypeStrings = orderTypeStrings;
  public orderStatusStrings = orderStatusStrings;

  constructor(
    private store: Store<fromRoot.State>,
    private socket: SocketIoService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TasksActions.getTasksRequest());

    this.tasks$ = this.store
      .select(UsersSelectors.selectUser)
      .pipe(
        switchMap((user) => {
          this.user = user as IEmployee;
          return this.store.select(TasksSelectors.selectTasks);
        })
      )
      .subscribe((tasks) => {
        this.tasks = tasks;

        this.tasksNew = this.getTasksNew();
        this.tasksWithRawStatus = this.getTasksWithRawStatus();
        this.tasksWithInProgressStatus = this.getTasksWithInProgressStatus();
        this.tasksToDelivery = this.getTasksToDelivery();
        this.tasksWithInTransitStatus = this.getTasksInTransitStatus();
        this.tasksWithDeliveredStatus = this.getTasksWithDeliveredStatus();
        this.tasksWithDeliveredStatusAndCurrentDivision = this.getTasksWithDeliveredStatusAndCurrentDivision();
        this.tasksWithWeighedStatus = this.getTasksWithWeighedStatus();
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
    this.tasks$?.unsubscribe?.();
    this.tasksAreFetching$?.unsubscribe?.();

    this.socket.get()?.off('employees');
    this.socket.get()?.off('orders');
  }

  public getTasksNew(): IOrderLessInfo[] {
    const employeeRole = this.user?.role;
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      if (
        employeeRole === EmployeeRole.clientManager ||
        employeeRole === EmployeeRole.admin ||
        employeeRole === EmployeeRole.head
      ) {
        tasksCopy = tasksCopy.filter(
          (task) =>
            task.status === OrderStatus.raw && !task.performers.clientManager
        );
      } else if (employeeRole === EmployeeRole.driver) {
        tasksCopy = tasksCopy.filter(
          (task) =>
            task.status === OrderStatus.processed &&
            !task.performers.driverAccepted
        );
      } else if (employeeRole === EmployeeRole.receivingManager) {
        tasksCopy = tasksCopy.filter(
          (task) =>
            task.status !== OrderStatus.delivered &&
            task.status !== OrderStatus.completed &&
            task.status !== OrderStatus.cancelled &&
            task.status !== OrderStatus.refused &&
            task.status !== OrderStatus.weighed &&
            task.status !== OrderStatus.packed
        );
      } else {
        tasksCopy = [];
      }
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithRawStatus(): IOrderLessInfo[] {
    const employeeRole = this.user?.role;
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      if (employeeRole === EmployeeRole.clientManager) {
        tasksCopy = tasksCopy.filter(
          (task) =>
            task.status === OrderStatus.raw && task.performers.clientManager
        );
      } else {
        tasksCopy = tasksCopy.filter((task) => task.status === OrderStatus.raw);
      }
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

  public getTasksToDelivery(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter(
        (task) =>
          task.status === OrderStatus.processed &&
          task.performers.driverAccepted
      );
      return tasksCopy;
    }
    return [];
  }

  public getTasksInTransitStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter(
        (task) => task.status === OrderStatus.inTransit
      );
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithDeliveredStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter(
        (task) => task.status === OrderStatus.delivered
      );
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithDeliveredStatusAndCurrentDivision(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter((task) => {
        return (
          task.status === OrderStatus.delivered &&
          task.division === (this.user?.division as IDivision)?._id
        );
      });
      return tasksCopy;
    }
    return [];
  }

  public getTasksWithWeighedStatus(): IOrderLessInfo[] {
    let tasksCopy = this.tasks;
    if (tasksCopy) {
      tasksCopy = tasksCopy.filter((task) => {
        return (
          task.status === OrderStatus.weighed &&
          task.performers.receivingManager === this.user?._id
        );
      });
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

  public getDate(stringedDate: string): Date {
    return new Date(stringedDate);
  }
}
