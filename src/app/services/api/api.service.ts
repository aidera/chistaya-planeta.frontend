import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  public createGetRouteParams(request: GetRouteParamsType): HttpParams {
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

    if (request.filter) {
      Object.keys(request.filter).forEach((key) => {
        if (request.filter[key] && request.filter[key] !== '') {
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
    } else if (request.search) {
      params = params.append('search', request.search);
    }

    return params;
  }
}
