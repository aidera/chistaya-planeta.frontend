import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: Socket;

  constructor() {}

  setupSocketConnection(): void {
    this.socket = io(environment.socketURL);
  }

  get(): Socket | undefined {
    return this.socket;
  }
}
