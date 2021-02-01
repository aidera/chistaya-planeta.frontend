import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  private noInternetSnackbar: MatSnackBarRef<TextOnlySnackBar>;

  constructor(private snackBar: MatSnackBar) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!window.navigator.onLine) {
      this.noInternetSnackbar = this.snackBar.open(
        'Потеряно соединение с интернетом',
        'Скрыть',
        {
          duration: 20000,
        }
      );
    } else {
      return next.handle(req);
    }
  }
}
