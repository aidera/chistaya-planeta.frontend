import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  CanActivateChild,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap, filter, take } from 'rxjs/operators';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import * as UserActions from '../../store/users/users.actions';
import { UserType } from '../../models/enums/UserType';

@Injectable({ providedIn: 'root' })
export class IsEmployeeGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<fromRoot.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/e', 'login']);
      return false;
    }

    return this.store.pipe(
      select(UsersSelectors.selectUserType),
      tap((user) => {
        if (user === null) {
          this.store.dispatch(UserActions.getUserRequest());
        }
      }),
      filter((user) => user !== null),
      take(1),
      map((user) => {
        if (user === UserType.employee) {
          return true;
        } else {
          this.router.navigate(['/e', 'login']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
