import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { ILocality, ILocalityLessInfo } from '../../models/Locality';
import { environment } from '../../../environments/environment';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ApiService } from './api.service';
import { SimpleStatus } from '../../models/enums/SimpleStatus';

export interface IGetAllLocalitiesResponse extends ServerResponse {
  localities?: ILocalityLessInfo[];
}

export interface IGetOneLocalityResponse extends ServerResponse {
  locality?: ILocality;
}

export interface ICheckLocalityNameResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

export interface IUpdateLocalityResponse extends ServerResponse {
  updatedLocality?: ILocality;
}

export interface IAddLocalityResponse extends ServerResponse {
  addedLocality?: ILocality;
}

export interface IRemoveLocalityResponse extends ServerResponse {
  removedLocality?: ILocality;
}

export interface IGetLocalitiesResponse extends ServerResponse {
  localities?: ILocality[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalityService {
  private path = 'localities';

  constructor(private http: HttpClient, private api: ApiService) {}

  getAllLessInfo(): Observable<IGetAllLocalitiesResponse> {
    return this.http.get<IGetAllLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetLocalitiesResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  getOne(id: string): Observable<IGetOneLocalityResponse> {
    return this.http.get<IGetOneLocalityResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  checkName(name: string): Observable<ICheckLocalityNameResponse> {
    return this.http.get<ICheckLocalityNameResponse>(
      `${environment.serverURL}/${this.path}/check-name/${name}`
    );
  }

  update(
    id: string,
    fields: { name?: string; status?: SimpleStatus }
  ): Observable<IUpdateLocalityResponse> {
    return this.http.patch<IUpdateLocalityResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: { name: string }): Observable<IAddLocalityResponse> {
    return this.http.put<IAddLocalityResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveLocalityResponse> {
    return this.http.delete<IRemoveLocalityResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
