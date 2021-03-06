import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';

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
    private socketIoService: SocketIoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (
        evt.url.includes('?') &&
        evt.url.split('?')[0] === window.location.pathname
      ) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): void {
    this.offlineEvent$?.unsubscribe?.();
  }
}
