import { Component, OnInit } from '@angular/core';
import { RoutingStateService } from './services/routing-state/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private routingState: RoutingStateService) {}

  ngOnInit(): void {
    this.routingState.loadRouting();
  }
}
