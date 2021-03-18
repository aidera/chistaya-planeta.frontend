import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';

import * as fromRoot from '../../store/root.reducer';
import * as UsersSelectors from '../../store/users/users.selectors';
import { IEmployee } from '../../models/Employee';
import EmployeeRole from '../../models/enums/EmployeeRole';

@Injectable({ providedIn: 'root' })
export class IsRoleHeadGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<fromRoot.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(UsersSelectors.selectUser),
      filter((user) => user !== null),
      take(1),
      map((user) => {
        if ((user as IEmployee)?.role === EmployeeRole.head) {
          return true;
        } else {
          this.router.navigate(['/e', 'cabinet']);
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
