import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { environment } from '../../../environments/environment';
import { ServerFilterRequest } from '../../models/types/ServerFilterRequest';
import { ServerSortingRequest } from '../../models/types/ServerSortingRequest';
import { ServerPaginationRequest } from '../../models/types/ServerPaginationRequest';

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

  constructor(private http: HttpClient) {}

  getAll(): Observable<IGetAllLocalitiesResponse> {
    return this.http.get<IGetAllLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/all`
    );
  }

  get(request: {
    pagination?: ServerPaginationRequest;
    sorting?: ServerSortingRequest;
    search?: string;
    filter?: ServerFilterRequest;
  }): Observable<IGetLocalitiesResponse> {
    let params = new HttpParams();

    if (request.pagination) {
      if (request.pagination.page) {
        params = params.append('page', request.pagination.page.toString());
      }
      if (request.pagination.perPage) {
        params = params.append(
          'perPage',
          request.pagination.perPage.toString()
        );
      }
    }

    if (request.sorting) {
      params = params.append('sortingField', request.sorting.field);
      params = params.append('sortingType', request.sorting.type);
    }

    console.log(request.filter);

    if (request.filter) {
      Object.keys(request.filter).forEach((key) => {
        if (request.filter[key] && request.filter[key] !== '') {
          console.log(request.filter[key]);
          console.log(JSON.stringify(request.filter[key]));
          if (
            typeof request.filter[key] === 'string' ||
            typeof request.filter[key] === 'number'
          ) {
            params = params.append(
              `filter__${key}`,
              request.filter[key].toString()
            );
          } else {
            params = params.append(
              `filter__${key}`,
              JSON.stringify(request.filter[key])
            );
          }
        }
      });
      console.log(params);
    } else if (request.search) {
      params = params.append('search', request.search);
    }

    return this.http.get<IGetLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }
}
