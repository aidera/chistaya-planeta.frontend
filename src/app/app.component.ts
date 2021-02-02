import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import * as fromRoot from './store/root.reducer';
import * as AppActions from './store/app/app.actions';
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
    private snackBar: MatSnackBar,
    private store: Store<fromRoot.State>,
    protected socket: SocketIoService
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

    this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    this.socket.get()?.on('localities', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });

    this.store.dispatch(AppActions.getDivisionsToSelectRequest());
    this.socket.get()?.on('divisions', (_) => {
      this.store.dispatch(AppActions.getLocalitiesToSelectRequest());
    });
  }

  ngOnDestroy(): void {
    this.offlineEvent$?.unsubscribe?.();
  }
}
