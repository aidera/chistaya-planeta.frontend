import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

export interface ICheckClientResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsApiService {
  private path = 'clients';

  constructor(private http: HttpClient, private api: ApiService) {}

  checkEmail(email: string): Observable<ICheckClientResponse> {
    return this.http.get<ICheckClientResponse>(
      `${environment.serverURL}/${this.path}/check-email/${email}`
    );
  }
}
