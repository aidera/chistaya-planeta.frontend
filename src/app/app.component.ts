import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { RoutingStateService } from './services/routing-state/routing-state.service';
import { SocketIoService } from './services/socket-io/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public offlineEvent: Observable<Event>;
  private offlineEvent$: Subscription;
  private noInternetSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    private routingState: RoutingStateService,
    private socketIoService: SocketIoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routingState.loadRouting();
    this.socketIoService.setupSocketConnection();

    this.offlineEvent = fromEvent(window, 'offline');
    this.offlineEvent$ = this.offlineEvent.subscribe((_) => {
      this.noInternetSnackbar = this.snackBar.open(
        'Потеряно соединение с интернетом',
        'Скрыть',
        {
          duration: 20000,
          panelClass: 'error',
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.offlineEvent$?.unsubscribe?.();
  }
}
