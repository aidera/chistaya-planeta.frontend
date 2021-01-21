import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { environment } from '../../../environments/environment';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ApiService } from './api.service';

export interface IGetAllLocalitiesResponse extends ServerResponse {
  localities?: ILocality[];
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

  getAll(): Observable<IGetAllLocalitiesResponse> {
    return this.http.get<IGetAllLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/all`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetLocalitiesResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }
}
