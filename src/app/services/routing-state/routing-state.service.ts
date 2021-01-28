import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RoutingStateService {
  private history = [];

  constructor(private router: Router, protected location: Location) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getCurrentUrlArray(url: string): string[] {
    return url.split('/');
  }

  public getPreviousUrl(): string {
    const prevUrlString = this.history[this.history.length - 2] || '';
    return prevUrlString.split('/');
  }

  goToPreviousPage(activatedRoute: ActivatedRoute): void {
    const previousUrl = this.getPreviousUrl();
    if (
      activatedRoute.snapshot.url[0].path ===
      previousUrl[previousUrl.length - 1].split('?')[0]
    ) {
      this.location.back();
    } else {
      this.router.navigate(['../'], { relativeTo: activatedRoute });
    }
  }
}
