import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cabinet-layout',
  templateUrl: './cabinet-layout.component.html',
  styleUrls: ['./cabinet-layout.component.scss'],
})
export class CabinetLayoutComponent implements OnInit, OnDestroy {
  public isEmployee: boolean;
  public useBacklink: boolean;

  private routerEvents$: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    if (this.route.snapshot) {
      this.isEmployee = this.route.snapshot.data.isEmployee;
      this.useBacklink = this.route.snapshot.firstChild?.data.useBacklink;
    }

    this.routerEvents$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_) => {
        this.useBacklink = this.route.snapshot.firstChild.data.useBacklink;
      });
  }

  ngOnDestroy(): void {
    this.routerEvents$?.unsubscribe?.();
  }
}
