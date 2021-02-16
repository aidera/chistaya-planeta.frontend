import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ApiService } from './api.service';
import { ICar, ICarLessInfo } from '../../models/Car';
import CarStatus from '../../models/enums/CarStatus';
import CarType from '../../models/enums/CarType';
import { IEmployee } from '../../models/Employee';

export interface IGetAllCarsResponse extends ServerResponse {
  cars?: ICarLessInfo[];
}

export interface IGetOneCarResponse extends ServerResponse {
  car?: ICar;
}

export interface ICheckLicensePlateResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

export interface IUpdateCarResponse extends ServerResponse {
  updatedCar?: ICar;
}

export interface IAddCarResponse extends ServerResponse {
  addedCar?: ICar;
}

export interface IRemoveCarResponse extends ServerResponse {
  removedCar?: ICar;
}

export interface IGetCarsResponse extends ServerResponse {
  cars?: ICar[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarsApiService {
  private path = 'cars';

  constructor(private http: HttpClient, private api: ApiService) {}

  getAllLessInfo(): Observable<IGetAllCarsResponse> {
    return this.http.get<IGetAllCarsResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetCarsResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetCarsResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  checkLicensePlate(
    licensePlate: string
  ): Observable<ICheckLicensePlateResponse> {
    return this.http.get<ICheckLicensePlateResponse>(
      `${environment.serverURL}/${this.path}/check-license-plate/${licensePlate}`
    );
  }

  getOne(id: string): Observable<IGetOneCarResponse> {
    return this.http.get<IGetOneCarResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  update(
    id: string,
    fields: {
      status?: CarStatus;
      type?: CarType;
      licensePlate?: string;
      weight?: number;
      isCorporate?: boolean;
      drivers?: IEmployee[];
      locality?: string;
      divisions?: string[];
    }
  ): Observable<IUpdateCarResponse> {
    return this.http.patch<IUpdateCarResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: {
    type: CarType;
    licensePlate: string;
    weight: number;
    isCorporate?: boolean;
    drivers?: IEmployee[];
    locality: string;
    divisions: string[];
  }): Observable<IAddCarResponse> {
    return this.http.put<IAddCarResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveCarResponse> {
    return this.http.delete<IRemoveCarResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
