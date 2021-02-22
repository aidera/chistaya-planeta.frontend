import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import Price from '../../models/types/Price';
import { IService, IServiceLessInfo } from '../../models/Service';

export interface IGetAllServicesResponse extends ServerResponse {
  services?: IServiceLessInfo[];
}

export interface IGetServicesResponse extends ServerResponse {
  services?: IService[];
  totalItemsCount?: number;
}

export interface IUpdateServiceResponse extends ServerResponse {
  updatedService?: IService;
}

export interface IAddServiceResponse extends ServerResponse {
  addedService?: IService;
}

export interface IRemoveServiceResponse extends ServerResponse {
  removedService?: IService;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesApiService {
  private path = 'services';

  constructor(private http: HttpClient) {}

  getAllLessInfo(): Observable<IGetAllServicesResponse> {
    return this.http.get<IGetAllServicesResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(): Observable<IGetServicesResponse> {
    return this.http.get<IGetServicesResponse>(
      `${environment.serverURL}/${this.path}/`
    );
  }

  update(
    id: string,
    fields: {
      name?: string;
      description?: string;
      status?: SimpleStatus;
      prices?: Price[];
    }
  ): Observable<IUpdateServiceResponse> {
    return this.http.patch<IUpdateServiceResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: {
    name: string;
    description?: string;
    prices: Price[];
  }): Observable<IAddServiceResponse> {
    return this.http.put<IAddServiceResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveServiceResponse> {
    return this.http.delete<IRemoveServiceResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
