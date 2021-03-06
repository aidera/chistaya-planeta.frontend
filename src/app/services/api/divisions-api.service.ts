import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerResponse } from '../../models/ServerResponse';
import { IDivision, IDivisionLessInfo } from '../../models/Division';
import { environment } from '../../../environments/environment';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { ApiService } from './api.service';

export interface IGetAllDivisionsResponse extends ServerResponse {
  divisions?: IDivisionLessInfo[];
}

export interface IGetOneDivisionResponse extends ServerResponse {
  division?: IDivision;
}

export interface ICheckDivisionNameResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

export interface IUpdateDivisionResponse extends ServerResponse {
  updatedDivision?: IDivision;
}

export interface IAddDivisionResponse extends ServerResponse {
  addedDivision?: IDivision;
}

export interface IRemoveDivisionResponse extends ServerResponse {
  removedDivision?: IDivision;
}

export interface IGetDivisionResponse extends ServerResponse {
  divisions?: IDivision[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class DivisionsApiService {
  private path = 'divisions';

  constructor(private http: HttpClient, private api: ApiService) {}

  getAllLessInfo(): Observable<IGetAllDivisionsResponse> {
    return this.http.get<IGetAllDivisionsResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetDivisionResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetDivisionResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  getOne(id: string): Observable<IGetOneDivisionResponse> {
    return this.http.get<IGetOneDivisionResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  checkName(name: string): Observable<ICheckDivisionNameResponse> {
    return this.http.get<ICheckDivisionNameResponse>(
      `${environment.serverURL}/${this.path}/check-name/${name}`
    );
  }

  update(
    id: string,
    fields: {
      status?: SimpleStatus;
      name?: string;
      locality?: string;
      street?: string;
      house?: string;
    }
  ): Observable<IUpdateDivisionResponse> {
    return this.http.patch<IUpdateDivisionResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: {
    name: string;
    locality: string;
    street: string;
    house: string;
  }): Observable<IAddDivisionResponse> {
    return this.http.put<IAddDivisionResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveDivisionResponse> {
    return this.http.delete<IRemoveDivisionResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
