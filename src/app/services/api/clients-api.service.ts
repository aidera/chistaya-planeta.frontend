import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerResponse } from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { IClient } from '../../models/Client';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ClientStatus } from '../../models/enums/ClientStatus';

export interface ICheckClientResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

export interface IGetOneClientResponse extends ServerResponse {
  client?: IClient;
}

export interface IGetClientsResponse extends ServerResponse {
  clients?: IClient[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

export interface IUpdateClientResponse extends ServerResponse {
  updatedClient?: IClient;
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

  checkId(id: string): Observable<ICheckClientResponse> {
    return this.http.get<ICheckClientResponse>(
      `${environment.serverURL}/${this.path}/check-id/${id}`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetClientsResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetClientsResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  getOne(id: string): Observable<IGetOneClientResponse> {
    return this.http.get<IGetOneClientResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  updateStatus(
    id: string,
    status: ClientStatus,
    blockReason?: string
  ): Observable<IUpdateClientResponse> {
    return this.http.patch<IUpdateClientResponse>(
      `${environment.serverURL}/${this.path}/update-status/${id}`,
      { status, blockReason }
    );
  }
}
