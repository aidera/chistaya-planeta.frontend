import { Component, OnInit } from '@angular/core';

import { RoutingStateService } from './services/routing-state/routing-state.service';
import { SocketIoService } from './services/socket-io/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private routingState: RoutingStateService,
    private socketIoService: SocketIoService
  ) {}

  ngOnInit(): void {
    this.routingState.loadRouting();
    this.socketIoService.setupSocketConnection();
  }
}
